import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import "../header/header.css";
import "./auth.css";

const RequestResetPassword = () => {
    let navigate = useNavigate();

    const [requestFormData, setRequestFormData] = useState({
        email: "",
    });

    function handleChange(event) {
        setRequestFormData((prevFormData) => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value,
            };
        });
    }

    async function handleRequestResetPasswordSubmit(event) {
        event.preventDefault();

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                requestFormData.email
            );

            navigate("/blank");

            if (error) throw error;
        } catch (error) {
            console.log("request reset password error: ", error.message);
            alert("Oops, account doesn't exits in our database!");
        }
    }

    return (
        <div>
            <h1 className="header-title">
                <span>To do today</span>
            </h1>

            <div className="auth-form">
                <h3>Password recovery</h3>
                <form onSubmit={handleRequestResetPasswordSubmit}>
                    <input
                        placeholder="Enter your email ..."
                        name="email"
                        onChange={handleChange}
                    />

                    <div className="auth-btn">
                        <button type="submit">Submit</button>
                        <button type="submit">
                            <Link to="/">Login</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestResetPassword;
