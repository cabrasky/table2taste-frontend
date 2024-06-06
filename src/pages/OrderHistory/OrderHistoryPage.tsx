import React, { useEffect, useState } from "react";
import { orderService } from "../../services/OrderService";
import { Order } from "../../models/Order";
import Translate from "../../components/Translate";

const OrderHistoryPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const orderHistory = await orderService.getOrderHistory();
                setOrders(orderHistory);
            } catch (error) {
                console.error("Error fetching order history:", error);
            }
        };
        fetchOrderHistory();
    }, []);

    return (
        <div className="order-history-page">
            <h1>Order History</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className="order-list">
                    {orders.map((order) => (
                        <li key={order.id} className="order-item">
                            <div className="order-details">
                                <span className="order-id">Order ID: {order.id}</span>
                                <span className="order-date">Date: {new Date(order.createdOn).toLocaleString()}</span>
                            </div>
                            <div className="order-items">
                                <h3>Items</h3>
                                <ul>
                                    {order.orderItemQuantities.map((orderItemQuantity) => (
                                        <li key={orderItemQuantity.id} className="order-item-details">
                                            <span className="item-name">
                                                <Translate dataSet={orderItemQuantity.orderItem.menuItem.translations} translationKey="name" />
                                            </span>
                                            <span className="item-quantity">Quantity: {orderItemQuantity.quantity}</span>
                                            <span className="item-annotations">
                                                Annotations: {orderItemQuantity.orderItem.annotations || "N/A"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderHistoryPage;
