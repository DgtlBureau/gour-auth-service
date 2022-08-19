import axios from 'axios';

import { ApiAccess } from './accessApi';

export type Role = {
  uuid: string;
  key: string;
  description: string;
  accesses: ApiAccess[];
};

export const roleApi = {
  async getAll(): Promise<Role[]> {
    const { data: roles } = await axios.get('/roles');

    return roles;
  },
  async getOne(uuid: string): Promise<Role> {
    const { data: role } = await axios.get('/roles/' + uuid);

    return role;
  },
  async update(role: Partial<Role> & { uuid: string }): Promise<Role> {
    const { data: result } = await axios.put('/roles/' + role.uuid, role);

    return result;
  },
  async create(role: Partial<Role>): Promise<Role> {
    const { data: result } = await axios.post('/roles', role);

    return result;
  },
  async remove(roleUuid: string) {
    await axios.delete('/roles/' + roleUuid);
  },
};
