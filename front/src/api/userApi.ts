import $api from '../services/http';
import {Role} from "./roleApi";

export type User = {
    id: number
    login: string;
    password: string;
    name: string;
    roles: Role[];
}

type UserDto = {
    id: number;
    login: string;
    password: string;
    name: string;
    roleIds: number[];
};

export const userApi = {
    async getAll(): Promise<User[]> {
        const {data: users} = await $api.get('/users')

        return users;
    },
    async getOne(id: number): Promise<User> {
        const {data: user} = await $api.get('/users/' + id)

        return user;
    },
    async update(user: Partial<User> & {id: number}): Promise<User> {
        const { roles, login, ...dto } = user;
        const body: Partial<UserDto> = dto;

        if (user.roles) {
            body.roleIds = user.roles.map(i => i.id);
        }
        const {data: result} = await $api.put('/users/' + user.id, body);

        return result;
    },
    async create(user: Partial<User>): Promise<User> {
        const {data: result} = await $api.post('/users', user)

        return result;
    },
    async remove(userId: number) {
        await $api.delete('/users/' + userId)
    }
}