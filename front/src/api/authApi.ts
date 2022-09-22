import $api from '../services/http'

export const authApi = {
    async signin(params: {login: string; password: string}): Promise<{token: string}> {
        return $api.post('/signin', params);
    },
    async signout(): Promise<{token: string}> {
        return $api.post('/signout');
    }
}