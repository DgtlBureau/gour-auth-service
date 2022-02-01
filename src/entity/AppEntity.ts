import {
    BeforeInsert,
    BeforeUpdate, Column,
    CreateDateColumn, Generated, Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

export class AppEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    updateDateCreation() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @BeforeUpdate()
    updateDateUpdate() {
        this.updatedAt = new Date();
    }
}