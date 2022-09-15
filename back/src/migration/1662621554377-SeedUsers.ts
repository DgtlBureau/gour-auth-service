import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../entity/Role';
import { Access } from '../entity/Access';
import { User } from '../entity/User';
import * as bcrypt from 'bcryptjs';

export class SeedUsers1662621554377 implements MigrationInterface {
  name = 'SeedUsers1662621554377';

  public async up(_queryRunner: QueryRunner): Promise<void> {
    const access = await getRepository(Access).save([
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

    const roles = await getRepository(Role).save([
      {
        key: 'AUTH_API_ADMIN',
        accesses: access,
        description: 'Администратор модуля auth',
      },
    ]);

    await getRepository(User).save([
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
