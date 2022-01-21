import {MigrationInterface, QueryRunner} from "typeorm";

export class addApiAccess1642516235299 implements MigrationInterface {
    name = 'addApiAccess1642516235299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_access" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "key" varchar NOT NULL, "description" varchar)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6a66515fcc6b585a69df6b5080" ON "api_access" ("key") `);
        await queryRunner.query(`CREATE TABLE "api_role_accesses_api_access" ("apiRoleId" integer NOT NULL, "apiAccessId" integer NOT NULL, PRIMARY KEY ("apiRoleId", "apiAccessId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e978192586e242c403d89fcff9" ON "api_role_accesses_api_access" ("apiRoleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_17b639fb5514fa530ae0e0fbee" ON "api_role_accesses_api_access" ("apiAccessId") `);
        await queryRunner.query(`CREATE TABLE "api_role_extends_api_role" ("apiRoleId_1" integer NOT NULL, "apiRoleId_2" integer NOT NULL, PRIMARY KEY ("apiRoleId_1", "apiRoleId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c5260028920467c71f49e083f1" ON "api_role_extends_api_role" ("apiRoleId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_97d7bb4d8af2f02979e8decf9d" ON "api_role_extends_api_role" ("apiRoleId_2") `);
        await queryRunner.query(`CREATE TABLE "temporary_api_role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_api_role"("id", "createdAt", "updatedAt") SELECT "id", "createdAt", "updatedAt" FROM "api_role"`);
        await queryRunner.query(`DROP TABLE "api_role"`);
        await queryRunner.query(`ALTER TABLE "temporary_api_role" RENAME TO "api_role"`);
        await queryRunner.query(`CREATE TABLE "temporary_api_role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "key" varchar NOT NULL, "description" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_api_role"("id", "createdAt", "updatedAt") SELECT "id", "createdAt", "updatedAt" FROM "api_role"`);
        await queryRunner.query(`DROP TABLE "api_role"`);
        await queryRunner.query(`ALTER TABLE "temporary_api_role" RENAME TO "api_role"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_84cd2b524a3927f57101efebeb" ON "api_role" ("key") `);
        await queryRunner.query(`DROP INDEX "IDX_e978192586e242c403d89fcff9"`);
        await queryRunner.query(`DROP INDEX "IDX_17b639fb5514fa530ae0e0fbee"`);
        await queryRunner.query(`CREATE TABLE "temporary_api_role_accesses_api_access" ("apiRoleId" integer NOT NULL, "apiAccessId" integer NOT NULL, CONSTRAINT "FK_e978192586e242c403d89fcff97" FOREIGN KEY ("apiRoleId") REFERENCES "api_role" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_17b639fb5514fa530ae0e0fbee7" FOREIGN KEY ("apiAccessId") REFERENCES "api_access" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("apiRoleId", "apiAccessId"))`);
        await queryRunner.query(`INSERT INTO "temporary_api_role_accesses_api_access"("apiRoleId", "apiAccessId") SELECT "apiRoleId", "apiAccessId" FROM "api_role_accesses_api_access"`);
        await queryRunner.query(`DROP TABLE "api_role_accesses_api_access"`);
        await queryRunner.query(`ALTER TABLE "temporary_api_role_accesses_api_access" RENAME TO "api_role_accesses_api_access"`);
        await queryRunner.query(`CREATE INDEX "IDX_e978192586e242c403d89fcff9" ON "api_role_accesses_api_access" ("apiRoleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_17b639fb5514fa530ae0e0fbee" ON "api_role_accesses_api_access" ("apiAccessId") `);
        await queryRunner.query(`DROP INDEX "IDX_c5260028920467c71f49e083f1"`);
        await queryRunner.query(`DROP INDEX "IDX_97d7bb4d8af2f02979e8decf9d"`);
        await queryRunner.query(`CREATE TABLE "temporary_api_role_extends_api_role" ("apiRoleId_1" integer NOT NULL, "apiRoleId_2" integer NOT NULL, CONSTRAINT "FK_c5260028920467c71f49e083f11" FOREIGN KEY ("apiRoleId_1") REFERENCES "api_role" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_97d7bb4d8af2f02979e8decf9d4" FOREIGN KEY ("apiRoleId_2") REFERENCES "api_role" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("apiRoleId_1", "apiRoleId_2"))`);
        await queryRunner.query(`INSERT INTO "temporary_api_role_extends_api_role"("apiRoleId_1", "apiRoleId_2") SELECT "apiRoleId_1", "apiRoleId_2" FROM "api_role_extends_api_role"`);
        await queryRunner.query(`DROP TABLE "api_role_extends_api_role"`);
        await queryRunner.query(`ALTER TABLE "temporary_api_role_extends_api_role" RENAME TO "api_role_extends_api_role"`);
        await queryRunner.query(`CREATE INDEX "IDX_c5260028920467c71f49e083f1" ON "api_role_extends_api_role" ("apiRoleId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_97d7bb4d8af2f02979e8decf9d" ON "api_role_extends_api_role" ("apiRoleId_2") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_97d7bb4d8af2f02979e8decf9d"`);
        await queryRunner.query(`DROP INDEX "IDX_c5260028920467c71f49e083f1"`);
        await queryRunner.query(`ALTER TABLE "api_role_extends_api_role" RENAME TO "temporary_api_role_extends_api_role"`);
        await queryRunner.query(`CREATE TABLE "api_role_extends_api_role" ("apiRoleId_1" integer NOT NULL, "apiRoleId_2" integer NOT NULL, PRIMARY KEY ("apiRoleId_1", "apiRoleId_2"))`);
        await queryRunner.query(`INSERT INTO "api_role_extends_api_role"("apiRoleId_1", "apiRoleId_2") SELECT "apiRoleId_1", "apiRoleId_2" FROM "temporary_api_role_extends_api_role"`);
        await queryRunner.query(`DROP TABLE "temporary_api_role_extends_api_role"`);
        await queryRunner.query(`CREATE INDEX "IDX_97d7bb4d8af2f02979e8decf9d" ON "api_role_extends_api_role" ("apiRoleId_2") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5260028920467c71f49e083f1" ON "api_role_extends_api_role" ("apiRoleId_1") `);
        await queryRunner.query(`DROP INDEX "IDX_17b639fb5514fa530ae0e0fbee"`);
        await queryRunner.query(`DROP INDEX "IDX_e978192586e242c403d89fcff9"`);
        await queryRunner.query(`ALTER TABLE "api_role_accesses_api_access" RENAME TO "temporary_api_role_accesses_api_access"`);
        await queryRunner.query(`CREATE TABLE "api_role_accesses_api_access" ("apiRoleId" integer NOT NULL, "apiAccessId" integer NOT NULL, PRIMARY KEY ("apiRoleId", "apiAccessId"))`);
        await queryRunner.query(`INSERT INTO "api_role_accesses_api_access"("apiRoleId", "apiAccessId") SELECT "apiRoleId", "apiAccessId" FROM "temporary_api_role_accesses_api_access"`);
        await queryRunner.query(`DROP TABLE "temporary_api_role_accesses_api_access"`);
        await queryRunner.query(`CREATE INDEX "IDX_17b639fb5514fa530ae0e0fbee" ON "api_role_accesses_api_access" ("apiAccessId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e978192586e242c403d89fcff9" ON "api_role_accesses_api_access" ("apiRoleId") `);
        await queryRunner.query(`DROP INDEX "IDX_84cd2b524a3927f57101efebeb"`);
        await queryRunner.query(`ALTER TABLE "api_role" RENAME TO "temporary_api_role"`);
        await queryRunner.query(`CREATE TABLE "api_role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "api_role"("id", "createdAt", "updatedAt") SELECT "id", "createdAt", "updatedAt" FROM "temporary_api_role"`);
        await queryRunner.query(`DROP TABLE "temporary_api_role"`);
        await queryRunner.query(`ALTER TABLE "api_role" RENAME TO "temporary_api_role"`);
        await queryRunner.query(`CREATE TABLE "api_role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "accesses" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "api_role"("id", "createdAt", "updatedAt") SELECT "id", "createdAt", "updatedAt" FROM "temporary_api_role"`);
        await queryRunner.query(`DROP TABLE "temporary_api_role"`);
        await queryRunner.query(`DROP INDEX "IDX_97d7bb4d8af2f02979e8decf9d"`);
        await queryRunner.query(`DROP INDEX "IDX_c5260028920467c71f49e083f1"`);
        await queryRunner.query(`DROP TABLE "api_role_extends_api_role"`);
        await queryRunner.query(`DROP INDEX "IDX_17b639fb5514fa530ae0e0fbee"`);
        await queryRunner.query(`DROP INDEX "IDX_e978192586e242c403d89fcff9"`);
        await queryRunner.query(`DROP TABLE "api_role_accesses_api_access"`);
        await queryRunner.query(`DROP INDEX "IDX_6a66515fcc6b585a69df6b5080"`);
        await queryRunner.query(`DROP TABLE "api_access"`);
    }

}
