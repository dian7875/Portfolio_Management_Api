import {
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
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateDegreeDto, EducationFiltersDto, UpdateDegreeDto } from './dto';

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

  @Get('by-user')
  getEducationByUserId(@Query() filters: EducationFiltersDto) {
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
}
