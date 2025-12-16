import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponse } from './interfaces/user.response';
import { CurrentUser } from './currentUser.decorator';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: CreateUserDto): Promise<{ message: string }> {
    return this.authService.register(data);
  }
  @Post('login')
  login(@Body() data: LoginDto): Promise<UserResponse> {
    return this.authService.login(data);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('Test')
  test(@CurrentUser('id') userId: string) {
    return userId;
  }
}
