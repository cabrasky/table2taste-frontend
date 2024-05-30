import React from 'react';
import { AppRoutes } from './components/AppRoutes';
import { LanguageProvider } from './contexts/LanguageContext';
import './app.css'
import { BreadcrumbsProvider } from './contexts/BreadcrumbContext';
import { PopupProvider } from './contexts/PopupContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AuthProvider>
                <BreadcrumbsProvider>
                    <CartProvider>
                        <PopupProvider>
                            <AppRoutes />
                        </PopupProvider>
                    </CartProvider>
                </BreadcrumbsProvider>
            </AuthProvider>
        </LanguageProvider>
    );
};

export default App;
