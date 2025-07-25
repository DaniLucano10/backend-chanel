import { Module } from '@nestjs/common';
import { UserHasRoleService } from './user_has_role.service';
import { UserHasRoleController } from './user_has_role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHasRole } from './entities/user_has_role.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserHasRole, User, Role])],
  controllers: [UserHasRoleController],
  providers: [UserHasRoleService],
})
export class UserHasRoleModule {}
