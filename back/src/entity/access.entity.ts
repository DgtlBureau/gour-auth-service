import { Entity, Column, Index } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Access extends Base {
  @Index({
    unique: true,
  })
  @Column()
  key: string;

  @Column({
    nullable: true,
  })
  description: string;
}
