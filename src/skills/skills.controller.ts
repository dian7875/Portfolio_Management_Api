import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { SkillFiltersDto } from './dto/skill.filters.dto';
import { UpdateSkillDto } from './dto/updateSkill.dto';
import { RegisterSkillDto } from './dto/registerSkill.dto';
import { PortfolioOwner } from 'src/auth/portfolio-owner.decorator';
import { PortfolioOwnerGuard } from 'src/auth/protfolio-owner.guard';
@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: RegisterSkillDto) {
    return this.skillsService.create(userId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('my')
  getMySkills(
    @CurrentUser('id') userId: string,
    @Query() filters: SkillFiltersDto,
  ) {
    return this.skillsService.findAll(userId, filters);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('categories')
  getMySkillsCategories(@CurrentUser('id') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return this.skillsService.myCurrentSkillsCategory(userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('names')
  getMySkillsNames(@CurrentUser('id') userId: string) {
    if (!userId) {
      throw new BadRequestException('Id del usuario es requerido');
    }
    return this.skillsService.getNames(userId);
  }

  @ApiHeader({
    name: 'X-Portfolio-Owner',
    description: 'UUID del propietario del portfolio',
    required: true,
    example: '6f1c3a2e-8b1f-4f6a-9a4e-2e3b9c7a91d4',
  })
  @UseGuards(PortfolioOwnerGuard)
  @Get()
  findByUser(
    @Query() filters: SkillFiltersDto,
    @PortfolioOwner() ownerId: string,
  ) {
    return this.skillsService.findAll(ownerId, filters);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSkillDto,
  ) {
    return this.skillsService.update(userId, id, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('hide/:id')
  hide(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.skillsService.hide(userId, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('recover/:id')
  recover(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.skillsService.recover(userId, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.skillsService.remove(userId, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.getOneById(id);
  }
}
