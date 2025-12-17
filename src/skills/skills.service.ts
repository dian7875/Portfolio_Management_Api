import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prismaConfig/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { RegisterSkillDto } from './dto/registerSkill.dto';
import { UpdateSkillDto } from './dto/updateSkill.dto';
import { SkillFiltersDto } from './dto/skill.filters.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: RegisterSkillDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.skill.create({
        data: {
          ...dto,
          userId,
        },
      });

      return { message: 'Successful' };
    } catch (error) {
      throw new InternalServerErrorException('Could not create skill');
    }
  }

  async verifyOwnership(userId: string, id: number) {
    const skill = await this.prisma.skill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new ForbiddenException('You do not have access to this skill');
    }

    return skill;
  }

  async update(
    userId: string,
    id: number,
    dto: UpdateSkillDto,
  ): Promise<{ message: string }> {
    await this.verifyOwnership(userId, id);

    try {
      await this.prisma.skill.update({
        where: { id },
        data: dto,
      });

      return { message: 'Successful' };
    } catch {
      throw new InternalServerErrorException('Could not update skill');
    }
  }

  async changeVisibility(id: number, hidden: boolean) {
    try {
      await this.prisma.skill.update({
        where: { id },
        data: { hidden },
      });
    } catch {
      throw new NotFoundException('Skill not found');
    }
  }

  async hide(userId: string, id: number) {
    await this.verifyOwnership(userId, id);
    await this.changeVisibility(id, true);
    return { message: 'Successful' };
  }

  async recover(userId: string, id: number): Promise<{ message: string }> {
    await this.verifyOwnership(userId, id);
    await this.changeVisibility(id, false);
    return { message: 'Successful' };
  }

  async remove(userId: string, id: number): Promise<{ message: string }> {
    await this.verifyOwnership(userId, id);

    try {
      await this.prisma.skill.delete({
        where: { id },
      });

      return { message: 'Successful' };
    } catch {
      throw new InternalServerErrorException('Could not remove skill');
    }
  }

  async findAll(userId: string, filters: SkillFiltersDto) {
    const { hidden, category, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.SkillWhereInput = {
      userId,
      ...(hidden !== undefined && { hidden }),
      ...(category && { category }),
    };

    const [data, total] = await Promise.all([
      this.prisma.skill.findMany({
        where,
        orderBy: {
          id: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.skill.count({ where }),
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

  async myCurrentSkillsCategory(userId: string) {
    const data = await this.prisma.skill.findMany({
      where: { userId },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
      select: {
        category: true,
      },
    });
    return data.map(item => item.category);
  }

}
