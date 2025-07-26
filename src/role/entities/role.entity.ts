import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleHasPermission } from '../../role_has_permission/entities/role_has_permission.entity';
import { UserHasRole } from '../../user_has_role/entities/user_has_role.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => UserHasRole, (userrole) => userrole.role)
  users!: UserHasRole[];

  @OneToMany(() => RoleHasPermission, (rolepermission) => rolepermission.role)
  permissions!: RoleHasPermission[];
}
