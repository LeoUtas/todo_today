import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import "../header/header.css";
import "./auth.css";

const ResetPassword = () => {
    let navigate = useNavigate();

    const [resetFormData, setResetFormData] = useState({
        email: "",
        newPassword: "",
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
            const { data, error } = await supabase.auth.updateUser({
                email: resetFormData.email,
                password: resetFormData.newPassword,
            });

            if (data) {
                console.log("successfully updated");
            }

            if (error) throw error;

            alert("Password updated successfully");

            navigate("/");
        } catch (error) {
            console.log("reset password error: ", error.message);
        }
    }

    return (
        <div>
            <h1 className="header-title">
                <span>To do today</span>
            </h1>

            <div className="auth-form">
                <h3>Password recovery</h3>
                <form onSubmit={handleResetPasswordSubmit}>
                    <input
                        placeholder="Enter your email ..."
                        name="email"
                        value={resetFormData.email}
                        onChange={handleChange}
                    />

                    <input
                        placeholder="Enter your new password ..."
                        name="newPassword"
                        type="password"
                        value={resetFormData.newPassword}
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

export default ResetPassword;
