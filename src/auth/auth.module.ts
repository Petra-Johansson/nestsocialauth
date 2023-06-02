import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JWTConfigModule } from 'src/config/jwt-config/jwt.config.module';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfigService } from 'src/config/jwt-config/jwt.config.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JWTConfigModule,
    JwtModule.registerAsync({
      imports: [JWTConfigModule],
      useFactory: async (jwtConfigService: JWTConfigService) => {
        return {
          secret: jwtConfigService.jwtSecret,
          signOptions: { expiresIn: '1h' },
        };
      },
      inject: [JWTConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
