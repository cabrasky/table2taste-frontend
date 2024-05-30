import axios from "axios";
import { API_HOST } from "./conts";
import { CartItem } from "../models/CartItem";
import { getAxiosConfig } from "../utils/authUtils";

class OrderService{
    protected baseUrl = `${API_HOST}/order`;

    async order(data: CartItem[], ): Promise<void> {
        return (await axios.post(`${this.baseUrl}`, {
            orderItems: data
        }, getAxiosConfig())).data;
    }
}

export const orderService = new OrderService();