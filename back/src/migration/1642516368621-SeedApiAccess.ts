import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Role } from '../entity/role.entity';
import { Access } from '../entity/access.entity';
import { User } from '../entity/user.entity.';

export class SeedRole1642516368621 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const accesses = await getRepository(Access).save([
      {
        key: 'ACCESS_CRUD',
        description: 'Доступ к управлению Access',
      },
      {
        key: 'ROLE_CRUD',
        description: 'Доступ к управлению Role',
      },
      {
        key: 'USER_CRUD',
        description: 'Доступ к управлению User',
      },
    ]);

    const roles = await getRepository(Role).save([
      {
        key: 'AUTH_ADMIN',
        description: 'Администратор модуля auth',
        accesses,
      },
    ]);

    await getRepository(User).save([
      {
        name: 'Администратор',
        login: 'admin',
        password: await bcrypt.hash('admin', 5),
        roles,
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await getRepository(User).delete({ login: 'admin' });

    await getRepository(Role).delete({ key: 'AUTH_ADMIN' });

    await getRepository(Access).delete({ key: 'ACCESS_CRUD' });
    await getRepository(Access).delete({ key: 'ROLE_CRUD' });
    await getRepository(Access).delete({ key: 'USER_CRUD' });
  }
}
