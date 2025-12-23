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
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

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

  @Get(':id')
  getBasicInfo(@Param('id') userId: string) {
    return this.usersService.getPublicInfo(userId);
  }

}
