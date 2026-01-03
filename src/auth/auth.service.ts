import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prismaConfig/prisma.service';
import { CreateUserDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { Prisma, User } from 'generated/prisma/client';
import { LoginDto } from './dto/login.dto';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserResponse } from './interfaces/user.response';
import { envs } from 'src/config/envs.conf';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto): Promise<{ message: string }> {
    const { password, ...userInfo } = data;
    const passwordHash = await argon2.hash(password);
    try {
      await this.prisma.user.create({
        data: {
          ...userInfo,
          passwordHash,
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`User already exists`);
        }
      }
    }
    return { message: 'Succesfull' };
  }

  async login(data: LoginDto): Promise<UserResponse> {
    const { identifier, password } = data;

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: identifier }, { phone: identifier }],
        },
        select: {
          passwordHash: true,
          name: true,
          id: true,
          email: true,
          phone: true,
          photoUrl: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isPasswordValid = await argon2.verify(user.passwordHash, password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { passwordHash: _, ...userSafe } = user;

      return {
        user: userSafe,
        acces_token: await this.singJwt({
          name: userSafe.name,
          identifier,
          id: userSafe.id,
        }),
      };
    } catch (error) {
      console.error(error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Login failed');
    }
  }

  private async singJwt(payload: {
    name: string;
    identifier: string;
    id: string;
  }): Promise<string> {
    const jwt = await this.jwtService.signAsync(payload);
    return jwt;
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: envs.jwt_secrets,
    });
  }
}
