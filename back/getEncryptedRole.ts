import { createConnection, getRepository } from 'typeorm';

import { encodeRoleKey } from './src/services/jwt.service';
import { Role } from './src/entity/role.entity';

const args = process.argv.slice(2);

if (!args[0]) {
  throw new Error('Role key must be provided');
}

createConnection()
  .then(() => {
    return getRepository(Role);
  })
  .then(roleRepository => {
    return roleRepository.findOne({
      key: args[0],
    });
  })
  .then(role => {
    if (!role) {
      throw new Error('Role with this key was not found');
    }

    console.log(encodeRoleKey(role.uuid, role.key));
  })
  .catch(e => {
    throw new Error(e);
  });
