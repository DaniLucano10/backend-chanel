import {
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleHasPermission } from '../../role_has_permission/entities/role_has_permission.entity';

export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  users: string[];

  @OneToMany(() => RoleHasPermission, (rolepermission) => rolepermission.role)
  permissions: RoleHasPermission[];
}
