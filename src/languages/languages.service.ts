import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prismaConfig/prisma.service';
import { Language, Prisma } from 'generated/prisma/client';
import { LanguageFiltersDto } from './dto/languageFilters.dto';
import { CreateLanguageDto } from './dto/registerLanguaje.dto';
import { UpdateLanguageDto } from './dto/updateLanguale.dto';

@Injectable()
export class LanguagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createLanguage(
    userId: string,
    data: CreateLanguageDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.language.create({
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
        'Could not create language reference',
      );
    }
  }

  async verifyProperty(userId: string, id: number): Promise<boolean> {
    const language = await this.prisma.language.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!language) {
      throw new ForbiddenException(
        'You do not have access to this language reference',
      );
    }

    return true;
  }

  async changeVisibility(id: number, value: boolean): Promise<void> {
    try {
      await this.prisma.language.update({
        where: { id },
        data: {
          hidden: value,
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Language reference not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not update language visibility',
      );
    }
  }

  async updateLanguage(
    userId: string,
    id: number,
    data: UpdateLanguageDto,
  ): Promise<{ message: string }> {
    try {
      await this.verifyProperty(userId, id);

      await this.prisma.language.update({
        where: { id },
        data,
      });

      return { message: 'Successful' };
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Language reference not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not update language reference',
      );
    }
  }

  async hideLanguage(userId: string, id: number): Promise<{ message: string }> {
    await this.verifyProperty(userId, id);
    await this.changeVisibility(id, true);
    return { message: 'Successful' };
  }

  async recoverLanguage(
    userId: string,
    id: number,
  ): Promise<{ message: string }> {
    await this.verifyProperty(userId, id);
    await this.changeVisibility(id, false);
    return { message: 'Successful' };
  }

  async removeLanguage(
    userId: string,
    id: number,
  ): Promise<{ message: string }> {
    try {
      await this.verifyProperty(userId, id);

      await this.prisma.language.delete({
        where: { id },
      });

      return { message: 'Successful' };
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Language reference not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not remove language reference',
      );
    }
  }

  async getLanguages(userId: string, filters: LanguageFiltersDto) {
    const { hidden, page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.LanguageWhereInput = {
      userId,
      ...(hidden !== undefined && { hidden }),
    };

    const [data, total] = await Promise.all([
      this.prisma.language.findMany({
        where,
        orderBy: {
          id: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.language.count({ where }),
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

  async getOneById(id: number): Promise<Language> {
    const languageData = await this.prisma.language.findUnique({
      where: {
        id,
      },
    });

    if (!languageData) {
      throw new NotFoundException(
        'No existe un lenguage con el id especificado',
      );
    }

    return languageData;
  }
}
