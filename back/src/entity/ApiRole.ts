import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { AppEntity } from './AppEntity';
import { ApiAccess } from './ApiAccess';

@Entity()
export class ApiRole extends AppEntity {
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

  // @ManyToMany(() => ApiRole)
  // @JoinTable()
  // extends: ApiRole[];
}
