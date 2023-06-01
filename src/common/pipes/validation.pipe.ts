import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  ValidationError,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length === 0) {
      return value;
    }
    throw new HttpException(
      { errors: this.formattingErrors(errors) },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  formattingErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      acc[error.property] = [
        ...(acc[error.property] || []),
        ...Object.values(error.constraints),
      ];
      return acc;
    }, {});
  }
}
