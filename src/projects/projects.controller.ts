import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { CreateProjectDto } from './dto/createProject.dto';
import { ProjectFiltersDto } from './dto/projects.filters.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        subtitle: { type: 'string' },
        description: { type: 'string' },
        repoUrl: { type: 'string' },
        demoUrl: { type: 'string' },
        finishDate: {
          type: 'string',
          format: 'date',
        },
        techStack: {
          type: 'array',
          items: { type: 'string' },
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['title', 'techStack', 'images'],
    },
  })
  @UseInterceptors(FilesInterceptor('images', 10))
  addProject(
    @CurrentUser('id') userId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.addProject(userId, dto, files);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('my')
  getMyProjects(
    @CurrentUser('id') userId: string,
    @Query() filters: ProjectFiltersDto,
  ) {
    return this.projectsService.getProjects(userId, filters);
  }

  @Get()
  getProjects(@Query() filters: ProjectFiltersDto) {
    if (!filters.userId) {
      throw new BadRequestException('userId is required');
    }

    return this.projectsService.getProjects(filters.userId, filters);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('hide/:id')
  hideProject(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.projectsService.hideProject(userId, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('recover/:id')
  recoverProject(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.projectsService.recoverProject(userId, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Delete(':id')
  removeProject(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.projectsService.removeProject(userId, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        subtitle: { type: 'string' },
        description: { type: 'string' },
        repoUrl: { type: 'string' },
        demoUrl: { type: 'string' },
        finishDate: { type: 'string', format: 'date' },
        techStack: {
          type: 'string',
          example: 'NestJS,Prisma',
        },
        keepImagesPath: {
          type: 'string',
          example: 'projects/userId/img1.png,projects/userId/img2.png',
        },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['title', 'techStack'],
    },
  })
  @UseInterceptors(FilesInterceptor('images', 10))
  updateProject(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(userId, id, dto, files);
  }

    @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getOneById(id);
  }
}
