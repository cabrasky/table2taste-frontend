import { ModificableCrudService } from './CRUDService';
import { Category } from '../models/Category';
import axios from 'axios';

class CategoryCrudService extends ModificableCrudService<Category, string> {
    constructor() {
        super("categories")
    }
    async getAncestors(id: string): Promise<Category[]> {
        return (await axios.get(`${this.baseUrl}/ancestors`, {
            params: {
                id: id
            }
        })).data;
    }
}

export const categoryService = new CategoryCrudService();

