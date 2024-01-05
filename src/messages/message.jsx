// NewDayMessage.jsx
import React from "react";
import "./message.css";
import "../index.css";

export const NotYetMessage = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="message-overlay">
            <div className="message-box">
                <p>{message}</p>
                <button onClick={onClose} className="button">
                    OK
                </button>
            </div>
        </div>
    );
};

export const NewDayMessage = ({ isOpen, message, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="message-overlay">
            <div className="message-box">
                <p>{message}</p>
                <button onClick={onConfirm} className="button">
                    Yes
                </button>
                <button onClick={onClose} className="button">
                    No
                </button>
            </div>
        </div>
    );
};
