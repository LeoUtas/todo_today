import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import "../header/header.css";
import "./auth.css";

const ResetPassword = ({ setUserAccessToken, setUserId, setDisplayName }) => {
    let navigate = useNavigate();

    const [resetFormData, setResetFormData] = useState({
        email: "",
    });

    function handleChange(event) {
        setResetFormData((prevFormData) => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value,
            };
        });
    }

    async function handleResetPasswordSubmit(event) {
        event.preventDefault();

        try {
            let { data, error } = await supabase.auth.resetPasswordForEmail(
                resetFormData.email
            );
            console.log("reset email: ", resetFormData.email);

            if (error) throw error;

            navigate("/todo_today");
        } catch (error) {
            console.log("resetpassword error: ", error.message);
            alert("Oops, account doesn't exits in our database!");
        }
    }

    return (
        <div>
            <h1 className="header-title">
                <span>To do today</span>
            </h1>

            <div className="auth-form">
                <h3>Log in</h3>
                <form onSubmit={handleResetPasswordSubmit}>
                    <input
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                    />

                    <div className="auth-btn">
                        <button type="submit">Reset</button>
                        <button type="submit">
                            <Link to="/todo_today">Login</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
