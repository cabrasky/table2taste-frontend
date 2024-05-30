import { ModificableCrudService } from './CRUDService';
import { User } from '../models/User';
import axios from 'axios';
import { API_HOST } from './conts';
import { getAxiosConfig } from '../utils/authUtils';

interface LoginToken {
    username: string,
    tokenType: string,
    accessToken: string
}

class UserService extends ModificableCrudService<User, string> {
    constructor() {
        super("users");
    }

    async userInfo(): Promise<User> {
        return await (await axios.get(`${API_HOST}/userInfo`, getAxiosConfig() )).data;
    }

    async login(username: string, password: string): Promise<LoginToken> {
        return await (await axios.post(`${API_HOST}/login`, {
            username,
            password
        })).data;
    }
}

export const userService = new UserService();
