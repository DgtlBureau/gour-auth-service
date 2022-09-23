import $api from '../services/http';
import {ApiAccess} from "./accessApi";

export type Role = {
    id: number;
    key: string;
    description: string;
    accesses: ApiAccess[];
}

type RoleDto = {
    id: Role['id'];
    key: Role['key'];
    description: Role['description'];
    accessIds: number[];
}

export const roleApi = {
    async getAll(): Promise<Role[]> {
        const {data: roles} = await $api.get('/roles')

        return roles;
    },
    async getOne(id: number): Promise<Role> {
        const {data: role} = await $api.get('/roles/' + id)

        return role;
    },
    async update(role: Partial<Role> & {id: number}): Promise<Role> {
        const { accesses, ...dto } = role;
        const body: Partial<RoleDto> = dto;

        if (role.accesses) {
            body.accessIds = role.accesses.map(i => i.id);
        }
        const {data: result} = await $api.put('/roles/' + role.id, body);

        return result;
    },
    async create(role: Partial<Role>): Promise<Role> {
        const {data: result} = await $api.post('/roles', role)

        return result;
    },
    async remove(roleId: number) {
        await $api.delete('/roles/' + roleId)
    }
}