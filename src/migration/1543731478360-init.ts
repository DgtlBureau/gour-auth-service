import {MigrationInterface, QueryRunner} from "typeorm";

export class init1543731478360 implements MigrationInterface {
    name = 'init1543731478360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_access" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "key" varchar NOT NULL, "description" varchar)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6a66515fcc6b585a69df6b5080" ON "api_access" ("key") `);
        await queryRunner.query(`CREATE TABLE "api_role" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "key" varchar NOT NULL, "description" varchar)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_84cd2b524a3927f57101efebeb" ON "api_role" ("key") `);
        await queryRunner.query(`CREATE TABLE "api_user" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "login" varchar NOT NULL, "password" varchar NOT NULL, "name" varchar, "isApproved" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE TABLE "api_role_accesses_api_access" ("apiRoleUuid" varchar NOT NULL, "apiAccessUuid" varchar NOT NULL, PRIMARY KEY ("apiRoleUuid", "apiAccessUuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8e20ebb34a925cdda061dd4320" ON "api_role_accesses_api_access" ("apiRoleUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_330f4cf813223dc9b5136283d3" ON "api_role_accesses_api_access" ("apiAccessUuid") `);
        await queryRunner.query(`CREATE TABLE "api_role_extends_api_role" ("apiRoleUuid_1" varchar NOT NULL, "apiRoleUuid_2" varchar NOT NULL, PRIMARY KEY ("apiRoleUuid_1", "apiRoleUuid_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0218c1915587592faa2f3197fa" ON "api_role_extends_api_role" ("apiRoleUuid_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_c288c9fb45f10c0b383b863d34" ON "api_role_extends_api_role" ("apiRoleUuid_2") `);
        await queryRunner.query(`CREATE TABLE "api_user_roles_api_role" ("apiUserUuid" varchar NOT NULL, "apiRoleUuid" varchar NOT NULL, PRIMARY KEY ("apiUserUuid", "apiRoleUuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6f9f637238a7364898f1b8a631" ON "api_user_roles_api_role" ("apiUserUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_71b47fdb4ff9b3b547ae5e0c36" ON "api_user_roles_api_role" ("apiRoleUuid") `);
        await queryRunner.query(`DROP INDEX "IDX_8e20ebb34a925cdda061dd4320"`);
        await queryRunner.query(`DROP INDEX "IDX_330f4cf813223dc9b5136283d3"`);
        await queryRunner.query(`CREATE TABLE "temporary_api_role_accesses_api_access" ("apiRoleUuid" varchar NOT NULL, "apiAccessUuid" varchar NOT NULL, CONSTRAINT "FK_8e20ebb34a925cdda061dd43202" FOREIGN KEY ("apiRoleUuid") REFERENCES "api_role" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_330f4cf813223dc9b5136283d34" FOREIGN KEY ("apiAccessUuid") REFERENCES "api_access" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("apiRoleUuid", "apiAccessUuid"))`);
        await queryRunner.query(`INSERT INTO "temporary_api_role_accesses_api_access"("apiRoleUuid", "apiAccessUuid") SELECT "apiRoleUuid", "apiAccessUuid" FROM "api_role_accesses_api_access"`);
        await queryRunner.query(`DROP TABLE "api_role_accesses_api_access"`);
        await queryRunner.query(`ALTER TABLE "temporary_api_role_accesses_api_access" RENAME TO "api_role_accesses_api_access"`);
        await queryRunner.query(`CREATE INDEX "IDX_8e20ebb34a925cdda061dd4320" ON "api_role_accesses_api_access" ("apiRoleUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_330f4cf813223dc9b5136283d3" ON "api_role_accesses_api_access" ("apiAccessUuid") `);
        await queryRunner.query(`DROP INDEX "IDX_0218c1915587592faa2f3197fa"`);
        await queryRunner.query(`DROP INDEX "IDX_c288c9fb45f10c0b383b863d34"`);
        await queryRunner.query(`CREATE TABLE "temporary_api_role_extends_api_role" ("apiRoleUuid_1" varchar NOT NULL, "apiRoleUuid_2" varchar NOT NULL, CONSTRAINT "FK_0218c1915587592faa2f3197fae" FOREIGN KEY ("apiRoleUuid_1") REFERENCES "api_role" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_c288c9fb45f10c0b383b863d342" FOREIGN KEY ("apiRoleUuid_2") REFERENCES "api_role" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("apiRoleUuid_1", "apiRoleUuid_2"))`);
        await queryRunner.query(`INSERT INTO "temporary_api_role_extends_api_role"("apiRoleUuid_1", "apiRoleUuid_2") SELECT "apiRoleUuid_1", "apiRoleUuid_2" FROM "api_role_extends_api_role"`);
        await queryRunner.query(`DROP TABLE "api_role_extends_api_role"`);
        await queryRunner.query(`ALTER TABLE "temporary_api_role_extends_api_role" RENAME TO "api_role_extends_api_role"`);
        await queryRunner.query(`CREATE INDEX "IDX_0218c1915587592faa2f3197fa" ON "api_role_extends_api_role" ("apiRoleUuid_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_c288c9fb45f10c0b383b863d34" ON "api_role_extends_api_role" ("apiRoleUuid_2") `);
        await queryRunner.query(`DROP INDEX "IDX_6f9f637238a7364898f1b8a631"`);
        await queryRunner.query(`DROP INDEX "IDX_71b47fdb4ff9b3b547ae5e0c36"`);
        await queryRunner.query(`CREATE TABLE "temporary_api_user_roles_api_role" ("apiUserUuid" varchar NOT NULL, "apiRoleUuid" varchar NOT NULL, CONSTRAINT "FK_6f9f637238a7364898f1b8a6316" FOREIGN KEY ("apiUserUuid") REFERENCES "api_user" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_71b47fdb4ff9b3b547ae5e0c367" FOREIGN KEY ("apiRoleUuid") REFERENCES "api_role" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("apiUserUuid", "apiRoleUuid"))`);
        await queryRunner.query(`INSERT INTO "temporary_api_user_roles_api_role"("apiUserUuid", "apiRoleUuid") SELECT "apiUserUuid", "apiRoleUuid" FROM "api_user_roles_api_role"`);
        await queryRunner.query(`DROP TABLE "api_user_roles_api_role"`);
        await queryRunner.query(`ALTER TABLE "temporary_api_user_roles_api_role" RENAME TO "api_user_roles_api_role"`);
        await queryRunner.query(`CREATE INDEX "IDX_6f9f637238a7364898f1b8a631" ON "api_user_roles_api_role" ("apiUserUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_71b47fdb4ff9b3b547ae5e0c36" ON "api_user_roles_api_role" ("apiRoleUuid") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_71b47fdb4ff9b3b547ae5e0c36"`);
        await queryRunner.query(`DROP INDEX "IDX_6f9f637238a7364898f1b8a631"`);
        await queryRunner.query(`ALTER TABLE "api_user_roles_api_role" RENAME TO "temporary_api_user_roles_api_role"`);
        await queryRunner.query(`CREATE TABLE "api_user_roles_api_role" ("apiUserUuid" varchar NOT NULL, "apiRoleUuid" varchar NOT NULL, PRIMARY KEY ("apiUserUuid", "apiRoleUuid"))`);
        await queryRunner.query(`INSERT INTO "api_user_roles_api_role"("apiUserUuid", "apiRoleUuid") SELECT "apiUserUuid", "apiRoleUuid" FROM "temporary_api_user_roles_api_role"`);
        await queryRunner.query(`DROP TABLE "temporary_api_user_roles_api_role"`);
        await queryRunner.query(`CREATE INDEX "IDX_71b47fdb4ff9b3b547ae5e0c36" ON "api_user_roles_api_role" ("apiRoleUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_6f9f637238a7364898f1b8a631" ON "api_user_roles_api_role" ("apiUserUuid") `);
        await queryRunner.query(`DROP INDEX "IDX_c288c9fb45f10c0b383b863d34"`);
        await queryRunner.query(`DROP INDEX "IDX_0218c1915587592faa2f3197fa"`);
        await queryRunner.query(`ALTER TABLE "api_role_extends_api_role" RENAME TO "temporary_api_role_extends_api_role"`);
        await queryRunner.query(`CREATE TABLE "api_role_extends_api_role" ("apiRoleUuid_1" varchar NOT NULL, "apiRoleUuid_2" varchar NOT NULL, PRIMARY KEY ("apiRoleUuid_1", "apiRoleUuid_2"))`);
        await queryRunner.query(`INSERT INTO "api_role_extends_api_role"("apiRoleUuid_1", "apiRoleUuid_2") SELECT "apiRoleUuid_1", "apiRoleUuid_2" FROM "temporary_api_role_extends_api_role"`);
        await queryRunner.query(`DROP TABLE "temporary_api_role_extends_api_role"`);
        await queryRunner.query(`CREATE INDEX "IDX_c288c9fb45f10c0b383b863d34" ON "api_role_extends_api_role" ("apiRoleUuid_2") `);
        await queryRunner.query(`CREATE INDEX "IDX_0218c1915587592faa2f3197fa" ON "api_role_extends_api_role" ("apiRoleUuid_1") `);
        await queryRunner.query(`DROP INDEX "IDX_330f4cf813223dc9b5136283d3"`);
        await queryRunner.query(`DROP INDEX "IDX_8e20ebb34a925cdda061dd4320"`);
        await queryRunner.query(`ALTER TABLE "api_role_accesses_api_access" RENAME TO "temporary_api_role_accesses_api_access"`);
        await queryRunner.query(`CREATE TABLE "api_role_accesses_api_access" ("apiRoleUuid" varchar NOT NULL, "apiAccessUuid" varchar NOT NULL, PRIMARY KEY ("apiRoleUuid", "apiAccessUuid"))`);
        await queryRunner.query(`INSERT INTO "api_role_accesses_api_access"("apiRoleUuid", "apiAccessUuid") SELECT "apiRoleUuid", "apiAccessUuid" FROM "temporary_api_role_accesses_api_access"`);
        await queryRunner.query(`DROP TABLE "temporary_api_role_accesses_api_access"`);
        await queryRunner.query(`CREATE INDEX "IDX_330f4cf813223dc9b5136283d3" ON "api_role_accesses_api_access" ("apiAccessUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_8e20ebb34a925cdda061dd4320" ON "api_role_accesses_api_access" ("apiRoleUuid") `);
        await queryRunner.query(`DROP INDEX "IDX_71b47fdb4ff9b3b547ae5e0c36"`);
        await queryRunner.query(`DROP INDEX "IDX_6f9f637238a7364898f1b8a631"`);
        await queryRunner.query(`DROP TABLE "api_user_roles_api_role"`);
        await queryRunner.query(`DROP INDEX "IDX_c288c9fb45f10c0b383b863d34"`);
        await queryRunner.query(`DROP INDEX "IDX_0218c1915587592faa2f3197fa"`);
        await queryRunner.query(`DROP TABLE "api_role_extends_api_role"`);
        await queryRunner.query(`DROP INDEX "IDX_330f4cf813223dc9b5136283d3"`);
        await queryRunner.query(`DROP INDEX "IDX_8e20ebb34a925cdda061dd4320"`);
        await queryRunner.query(`DROP TABLE "api_role_accesses_api_access"`);
        await queryRunner.query(`DROP TABLE "api_user"`);
        await queryRunner.query(`DROP INDEX "IDX_84cd2b524a3927f57101efebeb"`);
        await queryRunner.query(`DROP TABLE "api_role"`);
        await queryRunner.query(`DROP INDEX "IDX_6a66515fcc6b585a69df6b5080"`);
        await queryRunner.query(`DROP TABLE "api_access"`);
    }

}
