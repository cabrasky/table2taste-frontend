import { MenuItem } from "./MenuItem";

export interface Order {
    id: number;
    userId: number; // Assuming there's a corresponding userId property in the User class
    serviceId: number; // Assuming there's a corresponding id property in the Service class
    createdOn: string; // You can convert the Timestamp to a string or use a Date object
    orderItemQuantities: OrderItemQuantity[];
}

export interface OrderItemQuantity {
    id: number
    orderItem: OrderItem,
    quantity: number
}

export interface OrderItem {
    id: number;
    menuItem: MenuItem;
    annotations: string | null;
    price: number;
    quantity: number;
}