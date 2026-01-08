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
import { SocialMediasService } from './social-medias.service';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { CreateSocialMediaDto } from './dto/createRef.dto';
import {
  GetOneSocialMediaFilter,
  SocialMediaFiltersDto,
} from './dto/ref.filter.dto';
import { UpdateSocialMediaDto } from './dto/updateRef.dto';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { PortfolioOwner } from 'src/auth/portfolio-owner.decorator';
import { PortfolioOwnerGuard } from 'src/auth/protfolio-owner.guard';

@Controller('social-medias')
export class SocialMediasController {
  constructor(private readonly socialMediasService: SocialMediasService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateSocialMediaDto) {
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
  @ApiHeader({
    name: 'X-Portfolio-Owner',
    description: 'UUID del propietario del portfolio',
    required: true,
    example: '6f1c3a2e-8b1f-4f6a-9a4e-2e3b9c7a91d4',
  })
  @UseGuards(PortfolioOwnerGuard)
  @Get('/by-name')
  findByUserAndName(
    @Query() filters: GetOneSocialMediaFilter,
    @PortfolioOwner() ownerId: string,
  ) {
    filters.userId = ownerId;
    return this.socialMediasService.getOneByUserIdAndName(filters);
  }

  @ApiHeader({
    name: 'X-Portfolio-Owner',
    description: 'UUID del propietario del portfolio',
    required: true,
    example: '6f1c3a2e-8b1f-4f6a-9a4e-2e3b9c7a91d4',
  })
  @UseGuards(PortfolioOwnerGuard)
  @Get()
  findAll(
    @Query() filters: SocialMediaFiltersDto,
    @PortfolioOwner() ownerId: string,
  ) {
    return this.socialMediasService.getSocialMediaRefs(ownerId, filters);
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

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.socialMediasService.getOneById(id);
  }
}
