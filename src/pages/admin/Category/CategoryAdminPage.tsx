import { useParams } from "react-router-dom";
import MenuItemForm from "../../../components/MenuItem/MenuItemForm";
import MenuList from "../../../components/Menu/MenuList";

export const CategoryAdminPage: React.FC = () => {
    const {id} = useParams();
    return (
        <MenuList categoryId={id || "" } admin/>
    )
}