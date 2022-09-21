import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../entity/Role';
import { Access } from '../entity/Access';
import { User } from '../entity/User';
import * as bcrypt from 'bcryptjs';

export class SeedUsers2662621554377 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    const access = await _queryRunner.manager.save(Access, [
      {
        key: 'API_ACCESS_CRUD',
        description: 'Доступ к управлению Access',
      },
      {
        key: 'API_ROLE_CRUD',
        description: 'Доступ к управлению Role',
      },
      {
        key: 'API_USER_CRUD',
        description: 'Доступ к управлению User',
      },
    ]);

    const roles = await _queryRunner.manager.save(Role, [
      {
        key: 'AUTH_API_ADMIN',
        accesses: access,
        description: 'Администратор модуля auth',
      },
    ]);

    await _queryRunner.manager.save(User, [
      {
        name: 'Администратор',
        login: 'admin@admin.com',
        password: await bcrypt.hash('admin', 5),
        roles,
      },
    ]);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await getRepository(User).delete({ login: 'admin' });

    await getRepository(Role).delete({ key: 'AUTH_API_ADMIN' });

    await getRepository(Access).delete({ key: 'API_ACCESS_CRUD' });
    await getRepository(Access).delete({ key: 'API_ROLE_CRUD' });
    await getRepository(Access).delete({ key: 'API_USER_CRUD' });
  }
}
