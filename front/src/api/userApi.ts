import axios from "axios";
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
        const {data: users} = await axios.get('/user')

        return users;
    },
    async getOne(id: number): Promise<User> {
        const {data: user} = await axios.get('/user/' + id)

        return user;
    },
    async update(user: Partial<User> & {id: number}): Promise<User> {
        const { roles, login, ...dto } = user;
        const body: Partial<UserDto> = dto;

        if (user.roles) {
            body.roleIds = user.roles.map(i => i.id);
        }
        const {data: result} = await axios.put('/user/' + user.id, body);

        return result;
    },
    async create(user: Partial<User>): Promise<User> {
        const {data: result} = await axios.post('/user', user)

        return result;
    },
    async remove(userId: number) {
        await axios.delete('/user/' + userId)
    }
}