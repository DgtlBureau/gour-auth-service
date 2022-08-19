import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { ApiRole } from '../entity/role.entity';
import { ApiAccess } from '../entity/access.entity';
import { ApiUser } from '../entity/user.entity.';

export class SeedRole1642516368621 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const accesses = await getRepository(ApiAccess).save([
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

    const roles = await getRepository(ApiRole).save([
      {
        key: 'AUTH_ADMIN',
        description: 'Администратор модуля auth',
        accesses,
      },
    ]);

    await getRepository(ApiUser).save([
      {
        name: 'Администратор',
        login: 'admin',
        password: await bcrypt.hash('admin', 5),
        roles,
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await getRepository(ApiUser).delete({ login: 'admin' });

    await getRepository(ApiRole).delete({ key: 'AUTH_ADMIN' });

    await getRepository(ApiAccess).delete({ key: 'API_ACCESS_CRUD' });
    await getRepository(ApiAccess).delete({ key: 'API_ROLE_CRUD' });
    await getRepository(ApiAccess).delete({ key: 'API_USER_CRUD' });
  }
}
