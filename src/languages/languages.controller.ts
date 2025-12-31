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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LanguagesService } from './languages.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LanguageFiltersDto } from './dto/languageFilters.dto';
import { CreateLanguageDto } from './dto/registerLanguaje.dto';
import { UpdateLanguageDto } from './dto/updateLanguale.dto';

@ApiTags('Languages')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateLanguageDto) {
    return this.languagesService.createLanguage(userId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('my')
  getMyLanguages(
    @CurrentUser('id') userId: string,
    @Query() filters: LanguageFiltersDto,
  ) {
    return this.languagesService.getLanguages(userId, filters);
  }

  @Get()
  findAll(@Query() filters: LanguageFiltersDto) {
    if (!filters.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.languagesService.getLanguages(filters.userId, filters);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLanguageDto,
  ) {
    return this.languagesService.updateLanguage(userId, id, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('hide/:id')
  hide(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.languagesService.hideLanguage(userId, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('recover/:id')
  recover(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.languagesService.recoverLanguage(userId, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.languagesService.removeLanguage(userId, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.languagesService.getOneById(id);
  }
}
