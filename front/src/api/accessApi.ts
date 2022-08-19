import axios from 'axios';

export type ApiAccess = {
  uuid: string;
  key: string;
  description: string;
};

export const accessApi = {
  async getAll(): Promise<ApiAccess[]> {
    const { data: access } = await axios.get('/access');

    return access;
  },
  async getOne(uuid: string): Promise<ApiAccess> {
    const { data: access } = await axios.get('/access/' + uuid);

    return access;
  },
  async update(access: Partial<ApiAccess> & { uuid: string }): Promise<ApiAccess> {
    const { data: result } = await axios.put('/access/' + access.uuid, access);

    return result;
  },
  async create(access: Partial<ApiAccess>): Promise<ApiAccess> {
    const { data: result } = await axios.post('/access', access);

    return result;
  },
  async remove(accessUuid: string) {
    await axios.delete('/access/' + accessUuid);
  },
};
