import $api from '../services/http';

export type ApiAccess= {
    id: number;
    key: string;
    description: string;
}

export const accessApi = {
    async getAll(): Promise<ApiAccess[]> {
        const {data: accesss} = await $api.get('/accesses')

        return accesss;
    },
    async getOne(id: number): Promise<ApiAccess> {
        const {data: access} = await $api.get('/accesses/' + id)

        return access;
    },
    async update(access: Partial<ApiAccess> & {id: number}): Promise<ApiAccess> {
        const {data: result} = await $api.put('/accesses/' + access.id, access)

        return result;
    },
    async create(access: Partial<ApiAccess>): Promise<ApiAccess> {
        const {data: result} = await $api.post('/accesses', access)

        return result;
    },
    async remove(accessId: number) {
        await $api.delete('/accesses/' + accessId)
    }
}