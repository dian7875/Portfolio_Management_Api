import {
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
import { SocialMediasService } from './social-medias.service';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { CreateSocialMediaDto } from './dto/createRef.dto';
import { SocialMediaFiltersDto } from './dto/ref.filter.dto';
import { UpdateSocialMediaDto } from './dto/updateRef.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('social-medias')
export class SocialMediasController {
  constructor(private readonly socialMediasService: SocialMediasService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateSocialMediaDto) {
    console.log(userId,dto)
    return this.socialMediasService.createRef(userId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('my')
  getMySocialMedia(
    @CurrentUser('id') userId: string,
    @Query() filters: SocialMediaFiltersDto,
  ) {
    return this.socialMediasService.getSocialMediaRefs(userId, filters);
  }

  @Get()
  findAll(
    @Query() filters: SocialMediaFiltersDto,
  ) {
    return this.socialMediasService.getSocialMediaRefs(filters.userId!!, filters);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSocialMediaDto,
  ) {
    return this.socialMediasService.updateRef(userId, id, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('hide/:id')
  hide(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.socialMediasService.hideRef(userId, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('recover/:id')
  recover(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.socialMediasService.recoverRef(userId, id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.socialMediasService.removeRef(userId, id);
  }
}
