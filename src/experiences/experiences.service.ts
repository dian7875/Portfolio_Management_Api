import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prismaConfig/prisma.service';
import { Experience, Prisma } from 'generated/prisma/client';
import { CreateExperienceDto } from './dto/createExperience.dto';
import { ExperienceFiltersDto } from './dto/experiencesFilters.dto';
import { UpdateExperienceDto } from './dto/updateExperience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  async createExperience(
    userId: string,
    data: CreateExperienceDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.experience.create({
        data: {
          ...data,
          user: {
            connect: { id: userId },
          },
        },
      });

      return { message: 'Successful' };
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('User not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not create experience reference',
      );
    }
  }

  async verifyProperty(userId: string, id: number): Promise<boolean> {
    const experience = await this.prisma.experience.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!experience) {
      throw new ForbiddenException(
        'You do not have access to this experience reference',
      );
    }

    return true;
  }

  async changeVisibility(id: number, value: boolean): Promise<void> {
    try {
      await this.prisma.experience.update({
        where: { id },
        data: {
          hidden: value,
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Experience reference not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not update experience visibility',
      );
    }
  }

  async updateExperience(
    userId: string,
    id: number,
    data: UpdateExperienceDto,
  ): Promise<{ message: string }> {
    try {
      await this.verifyProperty(userId, id);

      await this.prisma.experience.update({
        where: { id },
        data,
      });

      return { message: 'Successful' };
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Experience reference not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not update experience reference',
      );
    }
  }

  async hideExperience(
    userId: string,
    id: number,
  ): Promise<{ message: string }> {
    await this.verifyProperty(userId, id);
    await this.changeVisibility(id, true);
    return { message: 'Successful' };
  }

  async recoverExperience(
    userId: string,
    id: number,
  ): Promise<{ message: string }> {
    await this.verifyProperty(userId, id);
    await this.changeVisibility(id, false);
    return { message: 'Successful' };
  }

  async removeExperience(
    userId: string,
    id: number,
  ): Promise<{ message: string }> {
    try {
      await this.verifyProperty(userId, id);

      await this.prisma.experience.delete({
        where: { id },
      });

      return { message: 'Successful' };
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Experience reference not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not remove experience reference',
      );
    }
  }

  async getExperiences(userId: string, filters: ExperienceFiltersDto) {
    const { hidden, page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.ExperienceWhereInput = {
      userId,
      ...(hidden !== undefined && { hidden }),
    };

    const [data, total] = await Promise.all([
      this.prisma.experience.findMany({
        where,
        orderBy: {
          startDate: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.experience.count({ where }),
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

  async getOneById(id: number): Promise<Experience> {
    const experienceData = await this.prisma.experience.findUnique({
      where: {
        id,
      },
    });

    if (!experienceData) {
      throw new NotFoundException(
        'No existe una red social con el id especificado',
      );
    }
    return experienceData;
  }
}
