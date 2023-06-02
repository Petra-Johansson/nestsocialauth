import { registerAs } from '@nestjs/config';

export default registerAs('jwt-secret', () => ({
  global: true,
  jwtSecret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '2000s' },
}));
