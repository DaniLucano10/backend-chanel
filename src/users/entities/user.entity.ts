import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: false })
  @ApiProperty()
  fullname: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @ApiProperty()
  email: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty()
  password: string;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at: Date;
}
