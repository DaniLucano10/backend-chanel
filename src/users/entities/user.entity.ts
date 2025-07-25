import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Country } from '../../country/entities/country.entity';
import { UserHasRole } from '../../user_has_role/entities/user_has_role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ unique: false })
  @ApiProperty()
  fullname!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @ApiProperty()
  email!: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty()
  password!: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  status!: boolean;

  @Column({ type: 'integer', nullable: true })
  country_id!: number;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  @ApiProperty({ type: () => Country })
  country!: Country;

  @CreateDateColumn()
  @ApiProperty()
  created_at!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at!: Date;

  @OneToMany(() => UserHasRole, (userrole) => userrole.user)
  @ApiProperty()
  roles!: UserHasRole[];
}
