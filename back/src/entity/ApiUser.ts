import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable
} from "typeorm";
import {AppEntity} from "./AppEntity";
import {ApiRole} from "./ApiRole";

@Entity()
export class ApiUser extends AppEntity {
    @Column()
    login: string;

    @Column()
    password: string;

    @Column({
        nullable: true
    })
    name: string;

    @ManyToMany(() => ApiRole, {
        eager: true
    })
    @JoinTable()
    roles: ApiRole[];

    @Column({
        default: false,
    })
    isApproved: boolean;
}