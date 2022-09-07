import axios from "axios";
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
        const {data: roles} = await axios.get('/role')

        return roles;
    },
    async getOne(id: number): Promise<Role> {
        const {data: role} = await axios.get('/role/' + id)

        return role;
    },
    async update(role: Partial<Role> & {id: number}): Promise<Role> {
        const { accesses, ...dto } = role;
        const body: Partial<RoleDto> = dto;

        if (role.accesses) {
            body.accessIds = role.accesses.map(i => i.id);
        }
        const {data: result} = await axios.put('/role/' + role.id, body);

        return result;
    },
    async create(role: Partial<Role>): Promise<Role> {
        const {data: result} = await axios.post('/role', role)

        return result;
    },
    async remove(roleId: number) {
        await axios.delete('/role/' + roleId)
    }
}