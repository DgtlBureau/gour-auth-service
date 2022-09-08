import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1662621440615 implements MigrationInterface {
  name = 'Init1662621440615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "access" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_e386259e6046c45ab06811584ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_87b52b98f24c652bbc3ba57077" ON "access" ("key") `);
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_128d7c8c9af53479d0b9e00eb5" ON "role" ("key") `);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "login" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "isApproved" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_accesses_access" ("roleId" integer NOT NULL, "accessId" integer NOT NULL, CONSTRAINT "PK_deed5aca71e8f5d6acbdbfcef45" PRIMARY KEY ("roleId", "accessId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_9ff787dad07d47363576d5fb9b" ON "role_accesses_access" ("roleId") `);
    await queryRunner.query(`CREATE INDEX "IDX_d6e843cf738eed733886acb343" ON "role_accesses_access" ("accessId") `);
    await queryRunner.query(
      `CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `);
    await queryRunner.query(`CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `);
    await queryRunner.query(
      `ALTER TABLE "role_accesses_access" ADD CONSTRAINT "FK_9ff787dad07d47363576d5fb9b7" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_accesses_access" ADD CONSTRAINT "FK_d6e843cf738eed733886acb343c" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`);
    await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`);
    await queryRunner.query(`ALTER TABLE "role_accesses_access" DROP CONSTRAINT "FK_d6e843cf738eed733886acb343c"`);
    await queryRunner.query(`ALTER TABLE "role_accesses_access" DROP CONSTRAINT "FK_9ff787dad07d47363576d5fb9b7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4be2f7adf862634f5f803d246b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5f9286e6c25594c6b88c108db7"`);
    await queryRunner.query(`DROP TABLE "user_roles_role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d6e843cf738eed733886acb343"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9ff787dad07d47363576d5fb9b"`);
    await queryRunner.query(`DROP TABLE "role_accesses_access"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_128d7c8c9af53479d0b9e00eb5"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_87b52b98f24c652bbc3ba57077"`);
    await queryRunner.query(`DROP TABLE "access"`);
  }
}
