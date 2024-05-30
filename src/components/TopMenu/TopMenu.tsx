import "./style.css";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import Breadcrumb from "../Breadcrumb";
import { useCart } from "../../contexts/CartContext";
import { Link } from "react-router-dom";
import { Icon } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { Protected } from "../Protected";

export const TopMenu: React.FC = () => {
    const { cart } = useCart();
    const { user } = useAuth()
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="top-menu">
            <div className="restaurant-name">
                <Link to={"/"}>Table2Taste</Link>
            </div>
            <div className="nav">
                <Breadcrumb />
                <div className="language-selector">
                    <LanguageSelector />
                </div>
                <div className="user">
                    {user !== null ? (
                        <>{user.name}</>
                    ) : (
                        <Link to='/login'>
                            Login
                        </Link>

                    )}
                </div>
                <Protected privilege="PLACE_ORDER">
                    <div className="cart">
                        <Link to='/cart'>
                            <Icon component={ShoppingCart} />{totalItems}
                        </Link>
                    </div></Protected>
            </div>
        </header >
    );
};
