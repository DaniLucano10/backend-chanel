import { Injectable } from '@nestjs/common';
import { CreateUserHasRoleDto } from './dto/create-user_has_role.dto';
import { UpdateUserHasRoleDto } from './dto/update-user_has_role.dto';

@Injectable()
export class UserHasRoleService {
  create(createUserHasRoleDto: CreateUserHasRoleDto) {
    return 'This action adds a new userHasRole';
  }

  findAll() {
    return `This action returns all userHasRole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userHasRole`;
  }

  update(id: number, updateUserHasRoleDto: UpdateUserHasRoleDto) {
    return `This action updates a #${id} userHasRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} userHasRole`;
  }
}
