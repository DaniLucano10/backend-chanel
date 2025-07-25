import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../role/entities/role.entity';

@Entity()
export class UserHasRole {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @ManyToOne(() => User, (user) => user.roles)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty()
  user!: User;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  @ApiProperty()
  role!: Role;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
