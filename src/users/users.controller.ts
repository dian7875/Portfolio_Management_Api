import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { UpdateBasicInfoDto } from './dto/updateBasicInfo.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { PortfolioOwner } from 'src/auth/portfolio-owner.decorator';
import { PortfolioOwnerGuard } from 'src/auth/protfolio-owner.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('me/basic-info')
  updateBasicInfo(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateBasicInfoDto,
  ) {
    return this.usersService.updateBasicInfo(userId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('me/photo')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  updatePhoto(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updatePhoto(userId, file);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('me/cv')
  @UseInterceptors(FileInterceptor('cv'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cv: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  updateCv(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateCv(userId, file);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('me/info')
  getMyBasicInfo(@CurrentUser('id') userId: string) {
    return this.usersService.getInfo(userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('me/summary')
  getMySummary(@CurrentUser('id') userId: string) {
    return this.usersService.getSummary(userId);
  }

  @ApiHeader({
    name: 'X-Portfolio-Owner',
    description: 'UUID del propietario del portfolio',
    required: true,
    example: '6f1c3a2e-8b1f-4f6a-9a4e-2e3b9c7a91d4',
  })
  @UseGuards(PortfolioOwnerGuard)
  @Get()
  getUserInfo(@PortfolioOwner() ownerId: string) {
    return this.usersService.getPublicInfo(ownerId);
  }
  @Get(':id')
  getBasicInfo(@Param('id') userId: string) {
    return this.usersService.getPublicInfo(userId);
  }
}
