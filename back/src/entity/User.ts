import { Exclude } from 'class-transformer';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';

import { AppEntity } from './Entity';
import { Role } from './Role';

@Entity()
export class User extends AppEntity {
  @Column()
  login: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  name: string;

  @ManyToMany(() => Role, {
    eager: true,
  })
  @JoinTable()
  roles: Role[];

  @Column({
    default: false,
  })
  isApproved: boolean;
}
