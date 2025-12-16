import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prismaConfig/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { CreateDegreeDto, EducationFiltersDto, UpdateDegreeDto } from './dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async addDegree(
    data: CreateDegreeDto,
    userId: string,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.education.create({
        data: {
          ...data,
          user: {
            connect: { id: userId },
          },
        },
      });
      return { message: 'Succesfull' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2003':
            throw new NotFoundException('User not found');

          case 'P2002':
            throw new ConflictException('Education Degree already exists');

          case 'P2025':
            throw new NotFoundException('Related Degree not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not create education Degree.',
      );
    }
  }

  async updateDegree(
    userId: string,
    id: number,
    data: UpdateDegreeDto,
  ): Promise<{ message: string }> {
    try {
      await this.verifyProperty(userId, id);

      await this.prisma.education.update({
        where: { id },
        data,
      });

      return { message: 'Successful' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Education Degree not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not update education Degree.',
      );
    }
  }

  async verifyProperty(userId: string, DegreeId: number): Promise<boolean> {
    const Degree = await this.prisma.education.findFirst({
      where: {
        id: DegreeId,
        userId,
      },
    });

    if (!Degree) {
      throw new ForbiddenException(
        'You do not have access to this education Degree',
      );
    }

    return !!Degree;
  }

  async changeDegreeVisibility(DegreeId: number, status: boolean) {
    try {
      await this.prisma.education.update({
        where: {
          id: DegreeId,
        },
        data: {
          hidden: status,
        },
      });
      return;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Education Degree not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not update education Degree.',
      );
    }
  }

  async hideDegree(
    userId: string,
    DegreeId: number,
  ): Promise<{ message: string }> {
    await this.verifyProperty(userId, DegreeId);
    await this.changeDegreeVisibility(DegreeId, true);
    return { message: 'Successful' };
  }
  async restoreDegree(
    userId: string,
    DegreeId: number,
  ): Promise<{ message: string }> {
    await this.verifyProperty(userId, DegreeId);
    await this.changeDegreeVisibility(DegreeId, false);
    return { message: 'Successful' };
  }

  async removeDegree(
    userId: string,
    DegreeId: number,
  ): Promise<{ message: string }> {
    try {
      await this.verifyProperty(userId, DegreeId);
      await this.prisma.education.delete({ where: { id: DegreeId } });
      return { message: 'Successful' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Education Degree not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not update education Degree.',
      );
    }
  }

  async getEducationDegreesByUser({
    page = 1,
    limit = 10,
    hidden,
    finished,
    userId,
  }: EducationFiltersDto) {
    const skip = (page - 1) * limit;
    const where: Prisma.EducationWhereInput = {
      userId,
      ...(hidden !== undefined && { hidden }),
      ...(finished !== undefined && { finished }),
    };

    const data = await this.prisma.education.findMany({
      where,
      orderBy: {
        startDate: 'desc',
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.education.count({ where });

    return {
      data,
      meta: {
        page,
        limit,
        hasNext: skip + data.length < total,
        hasPrev: page > 1,
      },
    };
  }
}
