import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateDegreeDto, EducationFiltersDto, UpdateDegreeDto } from './dto';
import { PortfolioOwner } from 'src/auth/portfolio-owner.decorator';
import { PortfolioOwnerGuard } from 'src/auth/protfolio-owner.guard';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post()
  addRecord(
    @Body() data: CreateDegreeDto,
    @CurrentUser('id', new ParseUUIDPipe()) userId: string,
  ): Promise<{ message: string }> {
    return this.educationService.addDegree(data, userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('hide/:id')
  hideDegree(
    @CurrentUser('id', new ParseUUIDPipe()) userId: string,
    @Param('id', new ParseIntPipe()) DegreeId: number,
  ): Promise<{ message: string }> {
    return this.educationService.hideDegree(userId, DegreeId);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('restore/:id')
  restoreDegree(
    @CurrentUser('id', new ParseUUIDPipe()) userId: string,
    @Param('id', new ParseIntPipe()) DegreeId: number,
  ): Promise<{ message: string }> {
    return this.educationService.restoreDegree(userId, DegreeId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('/:id')
  updateDegree(
    @Body() data: UpdateDegreeDto,
    @CurrentUser('id', new ParseUUIDPipe()) userId: string,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<{ message: string }> {
    return this.educationService.updateDegree(userId, id, data);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Delete('/:id')
  removeDegree(
    @CurrentUser('id', new ParseUUIDPipe()) userId: string,
    @Param('id', new ParseIntPipe()) DegreeId: number,
  ): Promise<{ message: string }> {
    return this.educationService.removeDegree(userId, DegreeId);
  }

  @ApiHeader({
    name: 'X-Portfolio-Owner',
    description: 'UUID del propietario del portfolio',
    required: true,
    example: '6f1c3a2e-8b1f-4f6a-9a4e-2e3b9c7a91d4',
  })
  @UseGuards(PortfolioOwnerGuard)
  @Get('by-user')
  getEducationByUserId(
    @Query() filters: EducationFiltersDto,
    @PortfolioOwner() ownerId: string,
  ) {
    filters.userId = ownerId;

    return this.educationService.getEducationDegreesByUser({
      ...filters,
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get()
  getMyEducation(
    @Query() filters: EducationFiltersDto,
    @CurrentUser('id', new ParseUUIDPipe()) userId: string,
  ) {
    return this.educationService.getEducationDegreesByUser({
      ...filters,
      userId,
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.educationService.getOneById(id);
  }
}
