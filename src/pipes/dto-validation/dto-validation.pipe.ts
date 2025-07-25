import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Optional,
  PipeTransform,
  ValidationPipeOptions,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';

@Injectable()
export class DtoValidation implements PipeTransform<any> {
  protected validatorOptions: ValidatorOptions;

  constructor(@Optional() options?: ValidationPipeOptions) {
    options = options || {};
    const { ...validatorOptions } = options;

    this.validatorOptions = { forbidUnknownValues: false, ...validatorOptions };
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value as typeof metatype;
    }

    const object = plainToInstance<typeof metatype, any>(metatype, value);
    const errors = await validate(object, this.validatorOptions);

    if (errors.length > 0) {
      const formatted = errors
        .map((err) => Object.values(err.constraints || {}).join(', '))
        .join('; ');
      console.error(formatted);
      throw new BadRequestException(formatted);
    }

    return object;
  }

  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types: Array<new (...args: any[]) => any> = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }
}
