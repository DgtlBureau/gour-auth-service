import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1660835202520 implements MigrationInterface {
    name = 'Init1660835202520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "access" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_72d3c58531c0327349c33370f0c" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_87b52b98f24c652bbc3ba57077" ON "access" ("key") `);
        await queryRunner.query(`CREATE TABLE "role" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_16fc336b9576146aa1f03fdc7c5" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_128d7c8c9af53479d0b9e00eb5" ON "role" ("key") `);
        await queryRunner.query(`CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "login" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "isApproved" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "role_accesses_access" ("roleUuid" uuid NOT NULL, "accessUuid" uuid NOT NULL, CONSTRAINT "PK_bbe67b677e0dbd9ad96efee9c7d" PRIMARY KEY ("roleUuid", "accessUuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a8d67359111b12042f48490a93" ON "role_accesses_access" ("roleUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd586ef8a15c673309efdb3dd1" ON "role_accesses_access" ("accessUuid") `);
        await queryRunner.query(`CREATE TABLE "role_extends_role" ("roleUuid_1" uuid NOT NULL, "roleUuid_2" uuid NOT NULL, CONSTRAINT "PK_c8a610adfe236c0f7d8b1b59e5c" PRIMARY KEY ("roleUuid_1", "roleUuid_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bdc6062f3d340dce1687a3f193" ON "role_extends_role" ("roleUuid_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_20fe0e77ce1cd2b9042409661f" ON "role_extends_role" ("roleUuid_2") `);
        await queryRunner.query(`CREATE TABLE "user_roles_role" ("userUuid" uuid NOT NULL, "roleUuid" uuid NOT NULL, CONSTRAINT "PK_0a82b94535d8d854f68e7275086" PRIMARY KEY ("userUuid", "roleUuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cb4b662488d0ac6eabe79094b2" ON "user_roles_role" ("userUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_75992747142330886c45087fc4" ON "user_roles_role" ("roleUuid") `);
        await queryRunner.query(`ALTER TABLE "role_accesses_access" ADD CONSTRAINT "FK_a8d67359111b12042f48490a93a" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_accesses_access" ADD CONSTRAINT "FK_fd586ef8a15c673309efdb3dd1b" FOREIGN KEY ("accessUuid") REFERENCES "access"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_extends_role" ADD CONSTRAINT "FK_bdc6062f3d340dce1687a3f1934" FOREIGN KEY ("roleUuid_1") REFERENCES "role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_extends_role" ADD CONSTRAINT "FK_20fe0e77ce1cd2b9042409661ff" FOREIGN KEY ("roleUuid_2") REFERENCES "role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_cb4b662488d0ac6eabe79094b2e" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_75992747142330886c45087fc42" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_75992747142330886c45087fc42"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_cb4b662488d0ac6eabe79094b2e"`);
        await queryRunner.query(`ALTER TABLE "role_extends_role" DROP CONSTRAINT "FK_20fe0e77ce1cd2b9042409661ff"`);
        await queryRunner.query(`ALTER TABLE "role_extends_role" DROP CONSTRAINT "FK_bdc6062f3d340dce1687a3f1934"`);
        await queryRunner.query(`ALTER TABLE "role_accesses_access" DROP CONSTRAINT "FK_fd586ef8a15c673309efdb3dd1b"`);
        await queryRunner.query(`ALTER TABLE "role_accesses_access" DROP CONSTRAINT "FK_a8d67359111b12042f48490a93a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75992747142330886c45087fc4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb4b662488d0ac6eabe79094b2"`);
        await queryRunner.query(`DROP TABLE "user_roles_role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20fe0e77ce1cd2b9042409661f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bdc6062f3d340dce1687a3f193"`);
        await queryRunner.query(`DROP TABLE "role_extends_role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd586ef8a15c673309efdb3dd1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a8d67359111b12042f48490a93"`);
        await queryRunner.query(`DROP TABLE "role_accesses_access"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_128d7c8c9af53479d0b9e00eb5"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b52b98f24c652bbc3ba57077"`);
        await queryRunner.query(`DROP TABLE "access"`);
    }

}
