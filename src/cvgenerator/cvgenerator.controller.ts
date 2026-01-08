import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CvgeneratorService } from './cvgenerator.service';
import { GenerateCvDto } from './dto/GenerateCvDto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import express from 'express';

@Controller('cvgenerator')
export class CvgeneratorController {
  constructor(private readonly cvgeneratorService: CvgeneratorService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post()
  async generateCv(
    @Body() dto: GenerateCvDto,
    @CurrentUser('id') userId: string,
    @Res() res: express.Response,
  ) {
    dto.userId = userId;
    const { pdf, fileName } = await this.cvgeneratorService.generateCv(dto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.send(pdf);
  }
}
