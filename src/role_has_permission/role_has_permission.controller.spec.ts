import { Test, TestingModule } from '@nestjs/testing';
import { RoleHasPermissionController } from './role_has_permission.controller';
import { RoleHasPermissionService } from './role_has_permission.service';

describe('RoleHasPermissionController', () => {
  let controller: RoleHasPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleHasPermissionController],
      providers: [RoleHasPermissionService],
    }).compile();

    controller = module.get<RoleHasPermissionController>(RoleHasPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
