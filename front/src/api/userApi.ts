import axios from "axios";
import {ApiAccess} from "./accessApi";
import {Role} from "./roleApi";

export type User = {
    uuid: string
    login: string;
    password: string;
    name: string;
    roles: Role[]
}

export const userApi = {
    async getAll(): Promise<User[]> {
        const {data: users} = await axios.get('/apiUsers')

        return users;
    },
    async getOne(uuid: string): Promise<User> {
        const {data: user} = await axios.get('/apiUsers/' + uuid)

        return user;
    },
    async update(user: Partial<User> & {uuid: string}): Promise<User> {
        const {data: result} = await axios.put('/apiUsers/' + user.uuid, user)

        return result;
    },
    async create(user: Partial<User>): Promise<User> {
        const {data: result} = await axios.post('/apiUsers', user)

        return result;
    },
    async remove(userUuid: string) {
        await axios.delete('/apiUsers/' + userUuid)
    }
}