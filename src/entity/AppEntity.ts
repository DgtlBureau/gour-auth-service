import {
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

export class AppEntity {
    @PrimaryGeneratedColumn()
    id: number;

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