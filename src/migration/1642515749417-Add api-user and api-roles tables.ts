import {MigrationInterface, QueryRunner} from "typeorm";

export class AddApiUserAndApiRolesTables1642515749417 implements MigrationInterface {
    name = 'AddApiUserAndApiRolesTables1642515749417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_user_roles_api_role" ("apiUserId" integer NOT NULL, "apiRoleId" integer NOT NULL, PRIMARY KEY ("apiUserId", "apiRoleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3a8e26eba4f136ed858ffd4c5c" ON "api_user_roles_api_role" ("apiUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8e8af423cccc0c05997336b95b" ON "api_user_roles_api_role" ("apiRoleId") `);
        await queryRunner.query(`DROP INDEX "IDX_3a8e26eba4f136ed858ffd4c5c"`);
        await queryRunner.query(`DROP INDEX "IDX_8e8af423cccc0c05997336b95b"`);
        await queryRunner.query(`CREATE TABLE "temporary_api_user_roles_api_role" ("apiUserId" integer NOT NULL, "apiRoleId" integer NOT NULL, CONSTRAINT "FK_3a8e26eba4f136ed858ffd4c5c8" FOREIGN KEY ("apiUserId") REFERENCES "api_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_8e8af423cccc0c05997336b95bc" FOREIGN KEY ("apiRoleId") REFERENCES "api_role" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("apiUserId", "apiRoleId"))`);
        await queryRunner.query(`INSERT INTO "temporary_api_user_roles_api_role"("apiUserId", "apiRoleId") SELECT "apiUserId", "apiRoleId" FROM "api_user_roles_api_role"`);
        await queryRunner.query(`DROP TABLE "api_user_roles_api_role"`);
        await queryRunner.query(`ALTER TABLE "temporary_api_user_roles_api_role" RENAME TO "api_user_roles_api_role"`);
        await queryRunner.query(`CREATE INDEX "IDX_3a8e26eba4f136ed858ffd4c5c" ON "api_user_roles_api_role" ("apiUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8e8af423cccc0c05997336b95b" ON "api_user_roles_api_role" ("apiRoleId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_8e8af423cccc0c05997336b95b"`);
        await queryRunner.query(`DROP INDEX "IDX_3a8e26eba4f136ed858ffd4c5c"`);
        await queryRunner.query(`ALTER TABLE "api_user_roles_api_role" RENAME TO "temporary_api_user_roles_api_role"`);
        await queryRunner.query(`CREATE TABLE "api_user_roles_api_role" ("apiUserId" integer NOT NULL, "apiRoleId" integer NOT NULL, PRIMARY KEY ("apiUserId", "apiRoleId"))`);
        await queryRunner.query(`INSERT INTO "api_user_roles_api_role"("apiUserId", "apiRoleId") SELECT "apiUserId", "apiRoleId" FROM "temporary_api_user_roles_api_role"`);
        await queryRunner.query(`DROP TABLE "temporary_api_user_roles_api_role"`);
        await queryRunner.query(`CREATE INDEX "IDX_8e8af423cccc0c05997336b95b" ON "api_user_roles_api_role" ("apiRoleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3a8e26eba4f136ed858ffd4c5c" ON "api_user_roles_api_role" ("apiUserId") `);
        await queryRunner.query(`DROP INDEX "IDX_8e8af423cccc0c05997336b95b"`);
        await queryRunner.query(`DROP INDEX "IDX_3a8e26eba4f136ed858ffd4c5c"`);
        await queryRunner.query(`DROP TABLE "api_user_roles_api_role"`);
    }

}
