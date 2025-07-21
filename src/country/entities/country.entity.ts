import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  code!: string;

  @Column()
  dial_code!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  update_at!: Date;
}
