import { PartialType } from '@nestjs/swagger';
import { CreateUserHasRoleDto } from './create-user_has_role.dto';

export class UpdateUserHasRoleDto extends PartialType(CreateUserHasRoleDto) {}
