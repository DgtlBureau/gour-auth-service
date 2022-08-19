import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Base } from './base.entity';
import { Role } from './role.entity';

@Entity()
export class User extends Base {
  @Column()
  login: string;

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
