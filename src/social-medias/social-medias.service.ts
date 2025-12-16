import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prismaConfig/prisma.service';
import { CreateSocialMediaDto } from './dto/createRef.dto';
import { UpdateSocialMediaDto } from './dto/updateRef.dto';
import { Prisma } from 'generated/prisma/client';
import { SocialMediaFiltersDto } from './dto/ref.filter.dto';

@Injectable()
export class SocialMediasService {
  constructor(private readonly prisma: PrismaService) {}

  async createRef(
    userId: string,
    data: CreateSocialMediaDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.socialMedia.create({
        data: {
          ...data,
          user: {
            connect: { id: userId },
          },
        },
      });

      return { message: 'Successful' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2003') {
          throw new NotFoundException('User not found');
        }
      }
      console.log(error);
      throw new InternalServerErrorException(
        'Could not create social media reference',
      );
    }
  }

  async changeRefVisibility(id: number, value: boolean): Promise<void> {
    try {
      await this.prisma.socialMedia.update({
        where: { id },
        data: {
          hidden: value,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Social media reference not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not update social media visibility',
      );
    }
  }

  async verifyProperty(userId: string, id: number): Promise<boolean> {
    const ref = await this.prisma.socialMedia.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!ref) {
      throw new ForbiddenException(
        'You do not have access to this social media reference',
      );
    }

    return !!ref;
  }

  async updateRef(
    userId: string,
    id: number,
    data: UpdateSocialMediaDto,
  ): Promise<{ message: string }> {
    try {
      await this.verifyProperty(userId, id);

      await this.prisma.socialMedia.update({
        where: { id },
        data,
      });

      return { message: 'Successful' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Social media reference not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not update social media reference',
      );
    }
  }

  async hideRef(userId: string, id: number): Promise<{ message: string }> {
    await this.verifyProperty(userId, id);
    await this.changeRefVisibility(id, true);
    return { message: 'Successful' };
  }

  async recoverRef(userId: string, id: number): Promise<{ message: string }> {
    await this.verifyProperty(userId, id);
    await this.changeRefVisibility(id, false);
    return { message: 'Successful' };
  }

  async removeRef(userId: string, id: number): Promise<{ message: string }> {
    try {
      await this.verifyProperty(userId, id);

      await this.prisma.socialMedia.delete({
        where: { id },
      });

      return { message: 'Successful' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Social media reference not found');
        }
      }

      throw new InternalServerErrorException(
        'Could not remove social media reference',
      );
    }
  }

  async getSocialMediaRefs(userId: string, filters: SocialMediaFiltersDto) {
    const { hidden, page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.SocialMediaWhereInput = {
      userId,
      ...(hidden !== undefined && { hidden }),
    };

    const [data, total] = await Promise.all([
      this.prisma.socialMedia.findMany({
        where,
        orderBy: {
          id: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.socialMedia.count({ where }),
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
}
