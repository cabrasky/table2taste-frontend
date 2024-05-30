import { useEffect, useState } from "react";
import Translate from "../../components/Translate";
import { useCart } from "../../contexts/CartContext";
import { menuItemService } from "../../services/MenuItemService";
import { MenuItem } from "../../models/MenuItem";

const CartPage: React.FC = () => {
    const { cart, clearCart, updateCart, order } = useCart();
    const [menuItems, setMenuItems] = useState<{ [key: string]: MenuItem }>({});

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
        const fetchData = async () => {
            const menuItemsData: { [key: string]: MenuItem } = {};
            await Promise.all(
                cart.map(async (cartItem) => {
                    const data = await menuItemService.get(cartItem.id);
                    menuItemsData[cartItem.id] = data;
                })
            );
            setMenuItems(menuItemsData);
        };

        fetchData();
    }, [cart]);

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
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
                        <button onClick={() => {
                            order();
                        }}>Order</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
