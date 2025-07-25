import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UserHasRole } from '../user_has_role/entities/user_has_role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserHasRole])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
