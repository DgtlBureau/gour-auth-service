import { Entity, Column, ManyToMany, JoinTable, Index } from 'typeorm';
import { AppEntity } from './Entity';
import { Access } from './Access';

@Entity()
export class Role extends AppEntity {
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

  // @ManyToMany(() => Role)
  // @JoinTable()
  // extends: Role[];
}
