import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prismaConfig/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { UpdateBasicInfoDto } from './dto/updateBasicInfo.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async updateBasicInfo(
    userId: string,
    dto: UpdateBasicInfoDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: dto,
      });

      return { message: 'Successful' };
    } catch (error) {  
console.error(error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
        if (error.code === 'P2002') {
          const fields = (error.meta?.target as string[]) || [];
          if (fields.includes('email')) {
            throw new ConflictException('Email already in use');
          }
          if (fields.includes('phone')) {
            throw new ConflictException('Phone already in use');
          }

          throw new ConflictException('Unique constraint violation');
        }
      }
      throw new InternalServerErrorException(
        'Could not update basic user information',
      );
    }
  }

  async updateCv(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ message: string }> {
    if (!file) {
      throw new BadRequestException('CV file is required');
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.cvPath) {
        await this.storageService.deleteFile(user.cvPath);
      }

      const upload = await this.storageService.uploadFile(
        userId,
        file,
        `${userId}/cv`,
      );

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          cvUrl: upload.publicUrl,
          cvPath: upload.path,
        },
      });

      return {
        message: 'Successful',
      };
    } catch (error) {  
console.error(error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }

      throw new InternalServerErrorException('Could not update user CV');
    }
  }

  async updatePhoto(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ message: string }> {
    if (!file) {
      throw new BadRequestException('Photo is required');
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.photoPath) {
        await this.storageService.deleteFile(user.photoPath);
      }

      const upload = await this.storageService.uploadFile(
        userId,
        file,
        `${userId}/avatar/`,
      );

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          photoUrl: upload.publicUrl,
          photoPath: upload.path,
        },
      });

      return {
        message: 'Successful',
      };
    } catch (error) {  
console.error(error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }

      throw new InternalServerErrorException('Could not update user photo');
    }
  }

  async getInfo(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      omit: { passwordHash: true },
    });
  }

  async getPublicInfo(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      omit: {
        id: true,
        passwordHash: true,
        photoPath: true,
        cvPath: true,
        hostUrl: true,
      },
    });
  }

  async getSummary(userId: string) {
    const [
      experiencesCount,
      educationCount,
      skillsCount,
      projectsCount,
      languagesCount,
      socialMediasCount,
    ] = await Promise.all([
      this.prisma.experience.count({ where: { userId } }),
      this.prisma.education.count({ where: { userId } }),
      this.prisma.skill.count({ where: { userId } }),
      this.prisma.project.count({ where: { userId } }),
      this.prisma.language.count({ where: { userId } }),
      this.prisma.socialMedia.count({ where: { userId } }),
    ]);
    return {
      experiences: experiencesCount,
      education: educationCount,
      skills: skillsCount,
      projects: projectsCount,
      languages: languagesCount,
      socialMedias: socialMediasCount,
    };
  }
}
