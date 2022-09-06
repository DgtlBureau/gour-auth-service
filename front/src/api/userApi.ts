import axios from "axios";
import {ApiAccess} from "./accessApi";
import {Role} from "./roleApi";

export type User = {
    uuid: string
    login: string;
    password: string;
    name: string;
    roles: Role[];
}

type UserDto = {
    uuid: string;
    login: string;
    password: string;
    name: string;
    roleIds: string[];
};

export const userApi = {
    async getAll(): Promise<User[]> {
        const {data: users} = await axios.get('/user')

        return users;
    },
    async getOne(uuid: string): Promise<User> {
        const {data: user} = await axios.get('/user/' + uuid)

        return user;
    },
    async update(user: Partial<User> & {uuid: string}): Promise<User> {
        const { roles, login, ...dto } = user;
        const body: Partial<UserDto> = dto;

        if (user.roles) {
            body.roleIds = user.roles.map(i => i.uuid);
        }
        const {data: result} = await axios.put('/user/' + user.uuid, body);

        return result;
    },
    async create(user: Partial<User>): Promise<User> {
        const {data: result} = await axios.post('/user', user)

        return result;
    },
    async remove(userUuid: string) {
        await axios.delete('/user/' + userUuid)
    }
}