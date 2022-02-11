import axios from "axios";


export const authApi = {
    async signin(params: {login: string; password: string}): Promise<{token: string}> {
        return axios.post('/signin', params);
    },
    async signout(): Promise<{token: string}> {
        return axios.post('/signout');
    }
}