import { Entity, Column, ManyToMany, JoinTable, Index } from 'typeorm';
import { Base } from './base.entity';
import { Access } from './access.entity';

@Entity()
export class Role extends Base {
  @Column()
  @Index({
    unique: true,
  })
  key: string;

  @Column({
    nullable: true,
  })
  description: string;

  @ManyToMany(() => Access, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  accesses: Access[];

  @ManyToMany(() => Role)
  @JoinTable()
  extends: Role[];
}
