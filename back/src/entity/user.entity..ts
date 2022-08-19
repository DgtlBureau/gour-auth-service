import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Base } from './base.entity';
import { ApiRole } from './role.entity';

@Entity()
export class ApiUser extends Base {
  @Column()
  login: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  name: string;

  @ManyToMany(() => ApiRole, {
    eager: true,
  })
  @JoinTable()
  roles: ApiRole[];

  @Column({
    default: false,
  })
  isApproved: boolean;
}
