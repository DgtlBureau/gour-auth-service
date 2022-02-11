import axios from "axios";

export type ApiAccess= {
    uuid: string;
    key: string;
    description: string;
}

export const accessApi = {
    async getAll(): Promise<ApiAccess[]> {
        const {data: accesss} = await axios.get('/apiAccess')

        return accesss;
    },
    async getOne(uuid: string): Promise<ApiAccess> {
        const {data: access} = await axios.get('/apiAccess/' + uuid)

        return access;
    },
    async update(access: Partial<ApiAccess> & {uuid: string}): Promise<ApiAccess> {
        const {data: result} = await axios.put('/apiAccess/' + access.uuid, access)

        return result;
    },
    async create(access: Partial<ApiAccess>): Promise<ApiAccess> {
        const {data: result} = await axios.post('/apiAccess', access)

        return result;
    },
    async remove(accessUuid: string) {
        await axios.delete('/apiAccess/' + accessUuid)
    }
}