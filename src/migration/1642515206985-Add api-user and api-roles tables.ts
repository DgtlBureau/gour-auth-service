import {MigrationInterface, QueryRunner} from "typeorm";

export class AddApiUserAndApiRolesTables1642515206985 implements MigrationInterface {
    name = 'AddApiUserAndApiRolesTables1642515206985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_api_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "login" varchar NOT NULL, "password" varchar NOT NULL, "name" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_api_user"("id", "createdAt", "updatedAt", "login", "password", "name") SELECT "id", "createdAt", "updatedAt", "login", "password", "name" FROM "api_user"`);
        await queryRunner.query(`DROP TABLE "api_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_api_user" RENAME TO "api_user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_user" RENAME TO "temporary_api_user"`);
        await queryRunner.query(`CREATE TABLE "api_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "login" varchar NOT NULL, "password" varchar NOT NULL, "name" varchar, "userUuid" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "api_user"("id", "createdAt", "updatedAt", "login", "password", "name") SELECT "id", "createdAt", "updatedAt", "login", "password", "name" FROM "temporary_api_user"`);
        await queryRunner.query(`DROP TABLE "temporary_api_user"`);
    }

}
