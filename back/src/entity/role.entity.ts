import { Entity, Column, ManyToMany, JoinTable, Index } from 'typeorm';
import { Base } from './base.entity';
import { ApiAccess } from './access.entity';

@Entity()
export class ApiRole extends Base {
  @Column()
  @Index({
    unique: true,
  })
  key: string;

  @Column({
    nullable: true,
  })
  description: string;

  @ManyToMany(() => ApiAccess, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  accesses: ApiAccess[];

  @ManyToMany(() => ApiRole)
  @JoinTable()
  extends: ApiRole[];
}
