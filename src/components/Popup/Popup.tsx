import React from 'react';
import './Popup.css'; 
import { PopupType } from '../../contexts/PopupContext';

interface PopupProps {
  type: PopupType;
  message: string;
  show?: boolean;
}

const Popup: React.FC<PopupProps> = ({ type, message, show }) => {
  return (
    <div className={`popup ${type} ${show && "show"}`}>
      <div className="popup-content">
        <div className="message">{message}</div>
      </div>
    </div>
  );
};

export default Popup;
