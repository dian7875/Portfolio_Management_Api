import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/createProject.dto';
import { PrismaService } from 'src/prismaConfig/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { ProjectFiltersDto } from './dto/projects.filters.dto';
import { Prisma, Project } from 'generated/prisma/client';
import { UpdateProjectDto } from './dto/updateProject.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async addProject(
    userId: string,
    dto: CreateProjectDto,
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new InternalServerErrorException('At least one image is required');
    }

    const uploads = await Promise.all(
      files.map((file) =>
        this.storageService.uploadFile(
          userId,
          file,
          `${userId}/projects/${dto.title}`,
        ),
      ),
    );

    const imagesUrl = uploads.map((upload) => upload.publicUrl);
    const imagesPath = uploads.map((u) => u.path);
    try {
      await this.prisma.project.create({
        data: {
          ...dto,
          userId,
          imagesUrl,
          imagesPath,
        },
      });

      return { message: 'Successful' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not create project');
    }
  }

  async getProjects(userId: string, filters: ProjectFiltersDto) {
    const { hidden, page = 1, limit = 10, highlight } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      userId,
      ...(hidden !== undefined && { hidden }),
      ...(highlight !== undefined && { highlight }),
    };

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy: {
          finishDate: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        hasNext: skip + data.length < total,
        hasPrev: page > 1,
      },
    };
  }

  async verifyProperty(userId: string, id: number): Promise<boolean> {
    const experience = await this.prisma.project.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!experience) {
      throw new ForbiddenException(
        'You do not have access to this project reference',
      );
    }
    return true;
  }

  async changeVisibility(id: number, value: boolean): Promise<void> {
    try {
      await this.prisma.project.update({
        where: { id },
        data: {
          hidden: value,
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Project reference not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not update Project visibility',
      );
    }
  }

  async hideProject(userId: string, id: number): Promise<{ message: string }> {
    await this.verifyProperty(userId, id);
    await this.changeVisibility(id, true);
    return { message: 'Successful' };
  }

  async recoverProject(
    userId: string,
    id: number,
  ): Promise<{ message: string }> {
    await this.verifyProperty(userId, id);
    await this.changeVisibility(id, false);
    return { message: 'Successful' };
  }

  async removeProject(
    userId: string,
    id: number,
  ): Promise<{ message: string }> {
    try {
      await this.verifyProperty(userId, id);

      const project = await this.prisma.project.delete({
        where: { id },
      });
      if (project.imagesPath?.length) {
        await Promise.all(
          project.imagesPath.map((path) =>
            this.storageService.deleteFile(path),
          ),
        );
      }

      return { message: 'Successful' };
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Project reference not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not remove project reference',
      );
    }
  }

  async updateProject(
    userId: string,
    id: number,
    dto: UpdateProjectDto,
    files: Express.Multer.File[],
  ): Promise<{ message: string }> {
    await this.verifyProperty(userId, id);

    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const keepPaths = dto.imagesPath ?? [];

    const toDelete = project.imagesPath.filter(
      (path) => !keepPaths.includes(path),
    );

    if (toDelete.length) {
      await Promise.all(
        toDelete.map((path) => this.storageService.deleteFile(path)),
      );
    }

    const uploads = files?.length
      ? await Promise.all(
          files.map((file) =>
            this.storageService.uploadFile(
              userId,
              file,
              `${userId}/projects/${project.title}`,
            ),
          ),
        )
      : [];

    const newPaths = uploads.map((u) => u.path);
    const newUrls = uploads.map((u) => u.publicUrl);

    const finalPaths = [...keepPaths, ...newPaths];
    const finalUrls = [
      ...project.imagesUrl.filter((_, i) =>
        keepPaths.includes(project.imagesPath[i]),
      ),
      ...newUrls,
    ];

    await this.prisma.project.update({
      where: { id },
      data: {
        title: dto.title,
        subtitle: dto.subtitle,
        description: dto.description,
        repoUrl: dto.repoUrl,
        demoUrl: dto.demoUrl,
        techStack: dto.techStack,
        finishDate: dto.finishDate,
        imagesPath: finalPaths,
        imagesUrl: finalUrls,
        highlight: dto.highlight,
        role: dto.role
      },
    });

    return { message: 'Successful' };
  }

  async getOneById(id: number): Promise<Project> {
    const Data = await this.prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!Data) {
      throw new NotFoundException(
        'No existe una red social con el id especificado',
      );
    }
    return Data;
  }

    async getNames(userId: string) {
    return this.prisma.project.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
      },
    });
  }
}
