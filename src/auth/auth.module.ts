import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs.conf';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService],
    imports: [
    JwtModule.register({
      global: true,
      secret: envs.jwt_secrets,
      signOptions: { expiresIn: '1w' },
    }),
  ],
  exports:[AuthService]
})
export class AuthModule {}
