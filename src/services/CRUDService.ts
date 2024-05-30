import axios from "axios";
import { API_HOST } from "./conts";
import { getAxiosConfig } from "../utils/authUtils";

export class CrudService<T, I> {
    protected baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = `${API_HOST}/${baseUrl}`
    }

    async get(id: I, ): Promise<T> {
        return (await axios.get(`${this.baseUrl}`, {
            params: {
                id: id
            },
            ...getAxiosConfig()
        })).data;
    }

    async getAll(params?: Partial<T>, ): Promise<T[]> {      
        return await (await axios.get(this.baseUrl, {
            params,
            ...getAxiosConfig()
        })).data
    }
}

export class ModificableCrudService<T, I> extends CrudService<T, I> {
    async create(data: T, ): Promise<T> {
        
        return (await axios.post(`${this.baseUrl}`, data, getAxiosConfig())).data;
    }

    async update(id: I, data: Partial<T>, ): Promise<T> {
        return (await axios.put(`${this.baseUrl}?id=${id}`, data, getAxiosConfig())).data;
    }

    async delete(id: I, ): Promise<void> {
        return (await axios.delete(`${this.baseUrl}?id=${id}`, getAxiosConfig())).data;
    }
}