import React, { useEffect, useState } from "react";
import "./style.css";
import { menuItemService } from "../../services/MenuItemService";
import MenuItemListedElement from "../MenuItem/MenuItemListedElement";
import { Link } from "react-router-dom";
import { MenuItem } from "../../models/MenuItem";

interface Props {
    categoryId?: string;
    admin?: boolean;
}

const MenuList: React.FC<Props> = ({ categoryId = "", admin = false }) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedMenuItems = await menuItemService.getAll({ categoryId });
                setMenuItems(fetchedMenuItems);
                setLoading(false);
            } catch (error) {
                setError("Error fetching data.");
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId]);

    return (
        <div className="menu-list">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="menu-item-list">
                    {menuItems.map((menuItem, index) => (
                        <div key={index}>
                            <Link to={`${admin ? "/admin" : ""}/menuItem/${menuItem.id}${admin ? "/edit" : ""}`}>
                                <MenuItemListedElement menuItem={menuItem}/>
                            </Link>
                        </div>
                    ))}
                    {admin && <Link to={`/admin/menuItem/add?categoryId=${categoryId}`}>Add Menu Item</Link>}
                </div>
            )}
        </div>
    );
};

export default MenuList;
