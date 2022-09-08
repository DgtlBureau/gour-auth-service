import axios from "axios";

export type ApiAccess= {
    id: number;
    key: string;
    description: string;
}

export const accessApi = {
    async getAll(): Promise<ApiAccess[]> {
        const {data: accesss} = await axios.get('/access')

        return accesss;
    },
    async getOne(id: number): Promise<ApiAccess> {
        const {data: access} = await axios.get('/access/' + id)

        return access;
    },
    async update(access: Partial<ApiAccess> & {id: number}): Promise<ApiAccess> {
        const {data: result} = await axios.put('/access/' + access.id, access)

        return result;
    },
    async create(access: Partial<ApiAccess>): Promise<ApiAccess> {
        const {data: result} = await axios.post('/access', access)

        return result;
    },
    async remove(accessId: number) {
        await axios.delete('/access/' + accessId)
    }
}