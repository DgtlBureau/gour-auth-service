import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1662591569767 implements MigrationInterface {
  name = 'Init1662591569767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "api_access" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_4a6b1fc23cba77fb9bd18833220" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6a66515fcc6b585a69df6b5080" ON "api_access" ("key") `);
    await queryRunner.query(
      `CREATE TABLE "api_role" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_fbbe0776114be7960e795158d3f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_84cd2b524a3927f57101efebeb" ON "api_role" ("key") `);
    await queryRunner.query(
      `CREATE TABLE "api_user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "login" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "isApproved" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_8eb953e69be312b10c2d8e060c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "api_role_accesses_api_access" ("apiRoleId" integer NOT NULL, "apiAccessId" integer NOT NULL, CONSTRAINT "PK_23867b68ef86cefcdadd9602e7c" PRIMARY KEY ("apiRoleId", "apiAccessId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e978192586e242c403d89fcff9" ON "api_role_accesses_api_access" ("apiRoleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17b639fb5514fa530ae0e0fbee" ON "api_role_accesses_api_access" ("apiAccessId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "api_user_roles_api_role" ("apiUserId" integer NOT NULL, "apiRoleId" integer NOT NULL, CONSTRAINT "PK_bf1faecb80ef0e0533b7ea93db0" PRIMARY KEY ("apiUserId", "apiRoleId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3a8e26eba4f136ed858ffd4c5c" ON "api_user_roles_api_role" ("apiUserId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e8af423cccc0c05997336b95b" ON "api_user_roles_api_role" ("apiRoleId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "api_role_accesses_api_access" ADD CONSTRAINT "FK_e978192586e242c403d89fcff97" FOREIGN KEY ("apiRoleId") REFERENCES "api_role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_role_accesses_api_access" ADD CONSTRAINT "FK_17b639fb5514fa530ae0e0fbee7" FOREIGN KEY ("apiAccessId") REFERENCES "api_access"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_user_roles_api_role" ADD CONSTRAINT "FK_3a8e26eba4f136ed858ffd4c5c8" FOREIGN KEY ("apiUserId") REFERENCES "api_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_user_roles_api_role" ADD CONSTRAINT "FK_8e8af423cccc0c05997336b95bc" FOREIGN KEY ("apiRoleId") REFERENCES "api_role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "api_user_roles_api_role" DROP CONSTRAINT "FK_8e8af423cccc0c05997336b95bc"`);
    await queryRunner.query(`ALTER TABLE "api_user_roles_api_role" DROP CONSTRAINT "FK_3a8e26eba4f136ed858ffd4c5c8"`);
    await queryRunner.query(
      `ALTER TABLE "api_role_accesses_api_access" DROP CONSTRAINT "FK_17b639fb5514fa530ae0e0fbee7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_role_accesses_api_access" DROP CONSTRAINT "FK_e978192586e242c403d89fcff97"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_8e8af423cccc0c05997336b95b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3a8e26eba4f136ed858ffd4c5c"`);
    await queryRunner.query(`DROP TABLE "api_user_roles_api_role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_17b639fb5514fa530ae0e0fbee"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e978192586e242c403d89fcff9"`);
    await queryRunner.query(`DROP TABLE "api_role_accesses_api_access"`);
    await queryRunner.query(`DROP TABLE "api_user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_84cd2b524a3927f57101efebeb"`);
    await queryRunner.query(`DROP TABLE "api_role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6a66515fcc6b585a69df6b5080"`);
    await queryRunner.query(`DROP TABLE "api_access"`);
  }
}
