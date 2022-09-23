import { Entity, Column, Index } from 'typeorm';
import { AppEntity } from './Entity';

@Entity()
export class Access extends AppEntity {
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
