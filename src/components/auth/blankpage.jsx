import React from "react";
import "../header/header.css";
import "./auth.css";

const BlankPage = () => {
    return (
        <div>
            <h1 className="header-title">
                <span>To do today</span>
            </h1>
            <h3>Please check your email for password recovery</h3>
        </div>
    );
};

export default BlankPage;
