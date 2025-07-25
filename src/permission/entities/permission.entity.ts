import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  role!: string;

  @Column()
  guard_name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @CreateDateColumn()
  updated_at!: Date;
}
