import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been authenticated and logged in.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res() res: Response) {
    const jwt = await this.authService.login(req.user);
    res.cookie('jwt', jwt.access_token, { httpOnly: true });
    res.cookie('refreshToken', jwt.refresh_token, { httpOnly: true });
    //console.log('res:', res, 'req:', req);
    return res.send('Logged in!');
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 201,
    description: 'The refreshToken has been refreshed.',
  })
  @Post('refresh')
  async refresh(@Request() req, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken']; // Get the refresh token from the request
    const jwt = await this.authService.refreshToken(refreshToken);
    res.cookie('jwt', jwt.access_token, { httpOnly: true }); // Set the cookie here
    res.cookie('refreshToken', jwt.refresh_token, { httpOnly: true });
    return res.send('Token refreshed!');
  }

  @ApiOperation({ summary: 'Log out a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been logged out and tokens removed.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req, @Res() res: Response) {
    // set tokens in the cookie to empty string

    /*  use this to blacklist used tokens 
    const jwtToken = req.cookies['jwt'];
  const refreshToken = req.cookies['refreshToken'];
  
  this.tokenService.blacklist(jwtToken);
  this.tokenService.blacklist(refreshToken);
    */
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
    res.json({ message: 'Logged out successfully' });
  }
}
