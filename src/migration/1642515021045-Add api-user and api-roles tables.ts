import {MigrationInterface, QueryRunner} from "typeorm";

export class AddApiUserAndApiRolesTables1642515021045 implements MigrationInterface {
    name = 'AddApiUserAndApiRolesTables1642515021045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_api_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "login" varchar NOT NULL, "password" varchar NOT NULL, "name" varchar NOT NULL, "userUuid" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_api_user"("id", "createdAt", "updatedAt", "login", "password", "name", "userUuid") SELECT "id", "createdAt", "updatedAt", "login", "password", "name", "userUuid" FROM "api_user"`);
        await queryRunner.query(`DROP TABLE "api_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_api_user" RENAME TO "api_user"`);
        await queryRunner.query(`CREATE TABLE "temporary_api_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "login" varchar NOT NULL, "password" varchar NOT NULL, "name" varchar, "userUuid" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_api_user"("id", "createdAt", "updatedAt", "login", "password", "name", "userUuid") SELECT "id", "createdAt", "updatedAt", "login", "password", "name", "userUuid" FROM "api_user"`);
        await queryRunner.query(`DROP TABLE "api_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_api_user" RENAME TO "api_user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_user" RENAME TO "temporary_api_user"`);
        await queryRunner.query(`CREATE TABLE "api_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "login" varchar NOT NULL, "password" varchar NOT NULL, "name" varchar NOT NULL, "userUuid" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "api_user"("id", "createdAt", "updatedAt", "login", "password", "name", "userUuid") SELECT "id", "createdAt", "updatedAt", "login", "password", "name", "userUuid" FROM "temporary_api_user"`);
        await queryRunner.query(`DROP TABLE "temporary_api_user"`);
        await queryRunner.query(`ALTER TABLE "api_user" RENAME TO "temporary_api_user"`);
        await queryRunner.query(`CREATE TABLE "api_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "login" varchar NOT NULL, "password" varchar NOT NULL, "name" varchar NOT NULL, "userUuid" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "api_user"("id", "createdAt", "updatedAt", "login", "password", "name", "userUuid") SELECT "id", "createdAt", "updatedAt", "login", "password", "name", "userUuid" FROM "temporary_api_user"`);
        await queryRunner.query(`DROP TABLE "temporary_api_user"`);
    }

}
