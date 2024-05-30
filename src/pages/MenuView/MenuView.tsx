import { useEffect, useState } from "react"
import Translate from "../../components/Translate"
import { useBreadcrumbs } from "../../contexts/BreadcrumbContext"
import { useParams } from "react-router-dom"
import MenuList from "../../components/Menu/MenuList"
import { categoryService } from "../../services/CategoryService"
import TreeMenu from "../../components/TreeMenu/TreeMenu"
import { Category } from "../../models/Category"
import "./style.css"

interface Props {
    admin?: boolean
}

export const MenuView: React.FC<Props> = ({ admin = false }) => {
    const { setBreadcrumbs } = useBreadcrumbs();
    const [rootCategories, setRootCategories] = useState<Category[]>([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchAncestors = async () => {
            const categoryAncestors = await categoryService.getAncestors(id || "")
            setBreadcrumbs([{
                url: admin ? "/admin/" : "/",
                label: <Translate translationKey={admin ? "gui.menu.admin" : "gui.menu"} />
            },
            ...categoryAncestors.reverse().map(categoryAncestor => {
                return ({
                    url: `${admin ? "admin" : ""}/category/${categoryAncestor.id}`,
                    label: <Translate translationKey="name" dataSet={categoryAncestor.translations} />
                })
            })
            ])
        }

        const fetchRootCategories = async () => {
            setRootCategories(await categoryService.getAll({
                parentCategoryId: ""
            }))
        }

        async function fetchData() {
            await Promise.all([fetchAncestors(), fetchRootCategories()]);
        }
        fetchData();
    }, [id, admin, setBreadcrumbs]);

    return (
        <div className="menu-view">
            <TreeMenu categories={rootCategories} admin={admin} selectedCategoryId={id} />
            <MenuList categoryId={id || undefined} admin={admin} />
        </div>
    )
}