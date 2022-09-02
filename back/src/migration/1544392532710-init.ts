import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1544392532710 implements MigrationInterface {
  name = 'init1544392532710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "api_access" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_e7a69e8255c84bc9c29fa5f380a" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6a66515fcc6b585a69df6b5080" ON "api_access" ("key") `);
    await queryRunner.query(
      `CREATE TABLE "api_role" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_b436ec5f54034abae23058c8dd5" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_84cd2b524a3927f57101efebeb" ON "api_role" ("key") `);
    await queryRunner.query(
      `CREATE TABLE "api_user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "login" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "isApproved" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d602d607f393ba0b041bfe2516b" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "api_role_accesses_api_access" ("apiRoleUuid" uuid NOT NULL, "apiAccessUuid" uuid NOT NULL, CONSTRAINT "PK_7ddaac5a5bbdacb94f705fc8aa0" PRIMARY KEY ("apiRoleUuid", "apiAccessUuid"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e20ebb34a925cdda061dd4320" ON "api_role_accesses_api_access" ("apiRoleUuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_330f4cf813223dc9b5136283d3" ON "api_role_accesses_api_access" ("apiAccessUuid") `,
    );
    await queryRunner.query(
      `CREATE TABLE "api_role_extends_api_role" ("apiRoleUuid_1" uuid NOT NULL, "apiRoleUuid_2" uuid NOT NULL, CONSTRAINT "PK_e6752f90f3d61ebe8b5e4a9416d" PRIMARY KEY ("apiRoleUuid_1", "apiRoleUuid_2"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0218c1915587592faa2f3197fa" ON "api_role_extends_api_role" ("apiRoleUuid_1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c288c9fb45f10c0b383b863d34" ON "api_role_extends_api_role" ("apiRoleUuid_2") `,
    );
    await queryRunner.query(
      `CREATE TABLE "api_user_roles_api_role" ("apiUserUuid" uuid NOT NULL, "apiRoleUuid" uuid NOT NULL, CONSTRAINT "PK_ed80d11385d6bc488de3910eb26" PRIMARY KEY ("apiUserUuid", "apiRoleUuid"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f9f637238a7364898f1b8a631" ON "api_user_roles_api_role" ("apiUserUuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_71b47fdb4ff9b3b547ae5e0c36" ON "api_user_roles_api_role" ("apiRoleUuid") `,
    );
    await queryRunner.query(
      `ALTER TABLE "api_role_accesses_api_access" ADD CONSTRAINT "FK_8e20ebb34a925cdda061dd43202" FOREIGN KEY ("apiRoleUuid") REFERENCES "api_role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_role_accesses_api_access" ADD CONSTRAINT "FK_330f4cf813223dc9b5136283d34" FOREIGN KEY ("apiAccessUuid") REFERENCES "api_access"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_role_extends_api_role" ADD CONSTRAINT "FK_0218c1915587592faa2f3197fae" FOREIGN KEY ("apiRoleUuid_1") REFERENCES "api_role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_role_extends_api_role" ADD CONSTRAINT "FK_c288c9fb45f10c0b383b863d342" FOREIGN KEY ("apiRoleUuid_2") REFERENCES "api_role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_user_roles_api_role" ADD CONSTRAINT "FK_6f9f637238a7364898f1b8a6316" FOREIGN KEY ("apiUserUuid") REFERENCES "api_user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_user_roles_api_role" ADD CONSTRAINT "FK_71b47fdb4ff9b3b547ae5e0c367" FOREIGN KEY ("apiRoleUuid") REFERENCES "api_role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "api_user_roles_api_role" DROP CONSTRAINT "FK_71b47fdb4ff9b3b547ae5e0c367"`);
    await queryRunner.query(`ALTER TABLE "api_user_roles_api_role" DROP CONSTRAINT "FK_6f9f637238a7364898f1b8a6316"`);
    await queryRunner.query(`ALTER TABLE "api_role_extends_api_role" DROP CONSTRAINT "FK_c288c9fb45f10c0b383b863d342"`);
    await queryRunner.query(`ALTER TABLE "api_role_extends_api_role" DROP CONSTRAINT "FK_0218c1915587592faa2f3197fae"`);
    await queryRunner.query(
      `ALTER TABLE "api_role_accesses_api_access" DROP CONSTRAINT "FK_330f4cf813223dc9b5136283d34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_role_accesses_api_access" DROP CONSTRAINT "FK_8e20ebb34a925cdda061dd43202"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_71b47fdb4ff9b3b547ae5e0c36"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6f9f637238a7364898f1b8a631"`);
    await queryRunner.query(`DROP TABLE "api_user_roles_api_role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c288c9fb45f10c0b383b863d34"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0218c1915587592faa2f3197fa"`);
    await queryRunner.query(`DROP TABLE "api_role_extends_api_role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_330f4cf813223dc9b5136283d3"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8e20ebb34a925cdda061dd4320"`);
    await queryRunner.query(`DROP TABLE "api_role_accesses_api_access"`);
    await queryRunner.query(`DROP TABLE "api_user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_84cd2b524a3927f57101efebeb"`);
    await queryRunner.query(`DROP TABLE "api_role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6a66515fcc6b585a69df6b5080"`);
    await queryRunner.query(`DROP TABLE "api_access"`);
  }
}
