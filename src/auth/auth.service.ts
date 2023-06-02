import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user.entity';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   *
   * @param email
   * @param password
   * @returns
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<UserEntity>> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('No account with this email exists');
    }
    const passwordsMatch = await this.compareHash(password, user.password);

    if (!passwordsMatch) {
      throw new UnauthorizedException('Wrong password');
    }

    const { password: userPassword, ...result } = user;
    return result;
  }

  /**
   *
   * @param user
   * @returns
   */
  async login(
    user: UserEntity,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    await this.refreshTokenRepository.save({
      token: refreshToken,
      user: user,
      expiryDate: expiryDate,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async generateRefreshToken(user: UserEntity) {
    const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });
    return token;
  }

  async refreshToken(refreshToken: string) {
    try {
      this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOneByRefreshToken(refreshToken);
      return this.login(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async compareHash(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
