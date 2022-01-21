import {MigrationInterface, QueryRunner} from "typeorm";

export class AddApiUserAndApiRolesTables1642514969279 implements MigrationInterface {
    name = 'AddApiUserAndApiRolesTables1642514969279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "accesses" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "api_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "login" varchar NOT NULL, "password" varchar NOT NULL, "name" varchar NOT NULL, "userUuid" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "api_user"`);
        await queryRunner.query(`DROP TABLE "api_role"`);
    }

}
