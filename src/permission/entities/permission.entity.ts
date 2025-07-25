import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleHasPermission } from '../../role_has_permission/entities/role_has_permission.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(
    () => RoleHasPermission,
    (rolepermission) => rolepermission.permission,
  )
  role!: RoleHasPermission;

  @Column()
  guard_name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @CreateDateColumn()
  updated_at!: Date;
}
