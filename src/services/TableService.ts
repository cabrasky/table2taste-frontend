import axios from "axios";
import { API_HOST } from "./conts";
import { CartItem } from "../models/CartItem";
import { getAxiosConfig } from "../utils/authUtils";
import { ErrorMessage } from "../utils/popupUtils";
import { Order } from "../models/Order";

class TableService {
    protected baseUrl = `${API_HOST}/table`;

    async allIds(): Promise<number[]> {
        try {
            const response = await axios.get<number[]>(this.baseUrl, getAxiosConfig());
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage: ErrorMessage = error.response.data;
                console.error('Error fetching tables:', errorMessage);
                throw new Error(errorMessage.message);
            } else {
                console.error('Unexpected error:', error);
                throw new Error('Unexpected error occurred');
            }
        }
    }

}

export const tableService = new TableService();