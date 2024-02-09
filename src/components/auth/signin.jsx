import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import "../header/header.css";
import "./auth.css";

const SignIn = ({ setUserAccessToken, setUserId, setDisplayName }) => {
    let navigate = useNavigate();

    const [signinFormData, setSigninFormData] = useState({
        displayName: "",
        email: "",
        password: "",
    });

    function handleChange(event) {
        setSigninFormData((prevFormData) => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value,
            };
        });
    }

    async function handleSigninSubmit(event) {
        event.preventDefault();

        try {
            let { data, error } = await supabase.auth.signInWithPassword({
                displayName: signinFormData.displayName,
                email: signinFormData.email,
                password: signinFormData.password,
            });

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (error) throw error;

            setUserAccessToken(data.session.access_token);
            setUserId(user.id);
            setDisplayName(user.user_metadata.displayName);

            navigate("/mainapp");
        } catch (error) {
            // alert(error);
            alert(
                "Oops, either your password is incorrect, or your account doesn't exits!"
            );
        }
    }

    return (
        <div>
            <h1 className="header-title">
                <span>To do today</span>
            </h1>

            <div className="auth-form">
                <h3>Log in</h3>
                <form onSubmit={handleSigninSubmit}>
                    {/* <input
                        placeholder="User Name"
                        name="name"
                        onChange={handleChange}
                    /> */}

                    <input
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                    />

                    <input
                        placeholder="Password"
                        name="password"
                        type="password"
                        onChange={handleChange}
                    />

                    <div className="auth-btn">
                        <button type="submit">Login</button>
                        <button type="submit">
                            <Link to="/requestreset">Reset</Link>
                        </button>
                    </div>
                </form>
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    );
};

export default SignIn;
