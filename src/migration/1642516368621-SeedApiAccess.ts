import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {ApiRole} from "../entity/ApiRole";
import {ApiAccess} from "../entity/ApiAccess";
import {ApiUser} from "../entity/ApiUser";
import * as bcrypt from "bcryptjs";

export class SeedApiRole1642516368621 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const apiAccess = await getRepository(ApiAccess).save(
            [
                {
                    key: 'API_ACCESS_CRUD',
                    description: 'Доступ к управлению ApiAccess'
                },
                {
                    key: 'API_ROLE_CRUD',
                    description: 'Доступ к управлению ApiRole'
                },
                {
                    key: 'API_USER_CRUD',
                    description: 'Доступ к управлению ApiUser'
                },
            ]
        );

        const roles = await getRepository(ApiRole).save(
            [
                {
                    key: 'AUTH_API_ADMIN',
                    accesses: apiAccess,
                    description: 'Администратор модуля auth'
                }
            ]
        );

        await getRepository(ApiUser).save(
            [
                {
                    name: 'Администратор',
                    login: 'admin',
                    password: await bcrypt.hash('admin', 5),
                    roles
                }
            ]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await getRepository(ApiUser).delete({login: 'admin'})

        await getRepository(ApiRole).delete({key: 'AUTH_API_ADMIN'})

        await getRepository(ApiAccess).delete({key: 'API_ACCESS_CRUD'})
        await getRepository(ApiAccess).delete({key: 'API_ROLE_CRUD'})
        await getRepository(ApiAccess).delete({key: 'API_USER_CRUD'})
    }

}
