import {
  ArgumentMetadata,
  BadGatewayException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParsePositivePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val) || val <= 0) {
      throw new BadGatewayException(
        `El parametro '${metadata.data}' debe ser un número positivo`,
      );
    }
    return val;
  }
}
