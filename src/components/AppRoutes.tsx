import React, { useEffect, useState } from "react";
import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";
import { MenuView } from "../pages/MenuView/MenuView";
import { MenuItemFormPage } from "../pages/admin/MenuItem/MenuItemFormPage";
import { CategoryFormPage } from "../pages/admin/Category/CagetoryFormPage";
import { MainPageLayout } from "../pages/MainPageLayout";
import CartPage from "../pages/Cart/CartPage";
import LoginForm from "./login/LoginForm";
import { useAuth } from "../contexts/AuthContext";
import ErrorPage from "../pages/ErrorPage";
import { MenuItemPage } from "../pages/MenuItemView/MenuViewPage";

export const AppRoutes: React.FC = () => {
  const [routes, setRoutes] = useState<RouteObject[]>([
    {
      path: "/",
      element: <MainPageLayout />,
      children: [
        { index: true, element: <MenuView /> },
        { path: "login", element: <LoginForm /> },
        { path: "category/:id", element: <MenuView /> },
        { path: "menuItem/:id", element: <MenuItemPage /> },
        { path: "cart", element: <CartPage /> }, {
          path: "admin/*",
          element: <ErrorPage requiredGroup="admin" />,
        },
      ],
    },
  ]);

  const { user } = useAuth();
  const isAdmin = user?.groups.some((group) => group.id === "admin");

  useEffect(() => {
    const adminRoutes: RouteObject[] = isAdmin
      ? [
        {
          path: "admin",
          children: [
            { index: true, element: <MenuView admin /> },
            {
              path: "category",
              children: [{
                index: true,
                element: <MenuView admin/>
              },
              {
                path: ":id",
                children: [
                  { index: true, element: <MenuView admin /> },
                  { path: "edit", element: <CategoryFormPage /> },
                ],
              },
              { path: "add", element: <CategoryFormPage /> },
              ],
            },
            {
              path: "menuItem",
              children: [
                { path: ":id/edit", element: <MenuItemFormPage /> },
                { path: "add", element: <MenuItemFormPage /> },
              ],
            },
          ],
        },
      ]
      : [
        {
          path: "admin/*",
          element: <ErrorPage requiredGroup="admin" />,
        },
      ];

    setRoutes([
      {
        path: "/",
        element: <MainPageLayout />,
        children: [
          { index: true, element: <MenuView /> },
          { path: "login", element: <LoginForm /> },
          { path: "category/:id", element: <MenuView /> },
          { path: "menuItem/:id", element: <MenuItemPage /> },
          ...adminRoutes,
          { path: "cart", element: <CartPage /> },
        ],
      },
    ]);
  }, [user, isAdmin]);

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
