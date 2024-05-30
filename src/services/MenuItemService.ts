import { ModificableCrudService } from './CRUDService';
import { MenuItem } from '../models/MenuItem';
import { Category } from '../models/Category';
import axios from 'axios';
import { getAxiosConfig } from '../utils/authUtils';

class MenuItemCrudService extends ModificableCrudService<MenuItem, string> {
    constructor() {
        super("menuItems")
    }

    async getAncestors(id: string, ): Promise<Category[]> {
        return (await axios.get(`${this.baseUrl}/ancestors`, {
            params: {
                id: id
            },
            ...getAxiosConfig()
        })).data;
    }
}

export const menuItemService = new MenuItemCrudService();