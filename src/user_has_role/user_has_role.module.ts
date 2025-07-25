import { Module } from '@nestjs/common';
import { UserHasRoleService } from './user_has_role.service';
import { UserHasRoleController } from './user_has_role.controller';

@Module({
  controllers: [UserHasRoleController],
  providers: [UserHasRoleService],
})
export class UserHasRoleModule {}
