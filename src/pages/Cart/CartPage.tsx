import React, { useEffect, useState } from "react";
import Translate from "../../components/Translate";
import { useCart } from "../../contexts/CartContext";
import { Link } from "react-router-dom";
import { Protected } from "../../components/Protected";
import { useBreadcrumbs } from "../../contexts/BreadcrumbContext";
import { tableService } from "../../services/TableService";

const CartPage: React.FC = () => {
    const { cart, menuItems, clearCart, updateCart, order, fetchMenuItems } = useCart();
    const [loading, setLoading] = useState(false);
    const [selectedTable, setSelectedTable] = useState<number|undefined>(1);
    const {setBreadcrumbs} = useBreadcrumbs();
    const [tables, setTables] = useState<number[]>([])

    const handleQuantityChange = (index: number, quantity: number) => {
        updateCart(cart.map((cartItem, i) => i === index ? { ...cartItem, quantity } : cartItem));
    };

    const handleAnnotationsChange = (index: number, annotations: string) => {
        updateCart(cart.map((cartItem, i) => i === index ? { ...cartItem, annotations } : cartItem));
    };

    const removeFromCart = (index: number) => {
        updateCart(cart.filter((_, i) => i !== index));
    };

    useEffect(() => {
        fetchMenuItems();
        setBreadcrumbs([]);
        tableService.allIds().then(data => {
            setTables(data)
        })
    }, [cart]);

    const handleOrder = async () => {
        setLoading(true);
        await order(selectedTable);
        setLoading(false);
    };

    const handleTableSelect = (table: number) => {
        setSelectedTable(table);
    };

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            <Protected privilege="PLACE_ORDER_TO_OTHERS">
                <div>
                    <select onChange={(e) => handleTableSelect(parseInt(e.target.value))}>
                        {tables.map(table => (
                            <option key={table} value={table}>
                                {table}
                            </option>
                        ))}
                    </select>
                    {selectedTable && <p>Selected Table: {selectedTable}</p>}
                </div>
            </Protected>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <ul className="cart-items">
                        {cart.sort((itemA, itemB) => itemA.id.localeCompare(itemB.id)).map((item, index) => (
                            <li key={item.id} className="cart-item">
                                <div className="item-details">
                                    <span className="item-name">
                                        <Translate translationKey="name" dataSet={menuItems[item.id]?.translations} />
                                    </span>
                                    <span className="item-price">{menuItems[item.id]?.price.toFixed(2)}€</span>
                                </div>
                                <div className="item-controls">
                                    <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                                    <input
                                        id={`quantity-${item.id}`}
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                    />
                                    <div>
                                        <label htmlFor={`annotations-${item.id}`}>Annotations:</label>
                                        <textarea
                                            id={`annotations-${item.id}`}
                                            value={item.annotations}
                                            onChange={(e) => handleAnnotationsChange(index, e.target.value)}
                                        />
                                    </div>
                                    <button onClick={() => removeFromCart(index)}>Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-actions">
                        <button onClick={() => clearCart()}>Clear Cart</button>
                        <button onClick={handleOrder} disabled={loading}>{loading ? 'Ordering...' : 'Order'}</button>
                    </div>
                </>
            )}

            <div className="cart-actions">
                <Link to="/order-history">Order History</Link>
            </div>
        </div>
    );
};

export default CartPage;