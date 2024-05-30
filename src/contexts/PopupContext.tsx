import React, { createContext, useState, useContext } from 'react';
import Popup from '../components/Popup/Popup';

export type PopupType = 'error' | 'success' | 'loading';

interface PopupContextType {
    createPopup: (type: PopupType, message: string, closingTime?: number) => void;
    closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};

interface Props {
    children?: React.ReactNode;
}


export const PopupProvider: React.FC<Props> = ({ children }) => {
    const [popup, setPopup] = useState<{ type: PopupType, message: string } | null>(null);
    const [show, setShow] = useState<boolean>(true);

    const createPopup = (type: PopupType, message: string, closingTime: number = 3000) => {
        setShow(true);
        setPopup({ type, message });
        setTimeout(closePopup, closingTime);
    };

    const closePopup = () => {
        setShow(false);
        setTimeout(() => setPopup(null), 250);
    }

    return (
        <PopupContext.Provider value={{ createPopup, closePopup }}>
            {children}
            {popup && <Popup type={popup.type} message={popup.message} show={show} />}
        </PopupContext.Provider>
    );
};
