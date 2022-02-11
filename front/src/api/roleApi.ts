import axios from "axios";
import {ApiAccess} from "./accessApi";

export type Role = {
    uuid: string;
    key: string;
    description: string;
    accesses: ApiAccess[];
}

export const roleApi = {
    async getAll(): Promise<Role[]> {
        const {data: roles} = await axios.get('/apiRoles')

        return roles;
    },
    async getOne(uuid: string): Promise<Role> {
        const {data: role} = await axios.get('/apiRoles/' + uuid)

        return role;
    },
    async update(role: Partial<Role> & {uuid: string}): Promise<Role> {
        const {data: result} = await axios.put('/apiRoles/' + role.uuid, role)

        return result;
    },
    async create(role: Partial<Role>): Promise<Role> {
        const {data: result} = await axios.post('/apiRoles', role)

        return result;
    },
    async remove(roleUuid: string) {
        await axios.delete('/apiRoles/' + roleUuid)
    }
}