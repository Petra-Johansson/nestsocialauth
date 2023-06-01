import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

//making sure that connection between backend and frontend is working on requests
export const corsOptions: CorsOptions = {
  credentials: true,
  origin: 'http://localhost:3000',
  allowedHeaders:
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
