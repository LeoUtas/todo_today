import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { CheckEmailMessage } from "../messages/message";
import "../header/header.css";
import "./auth.css";

const SignUp = () => {
    let navigate = useNavigate();

    const [signupFormData, setSignupFormData] = useState({
        displayName: "",
        email: "",
        password: "",
    });

    const [showCheckEmailMessage, setShowCheckEmailMessage] = useState(false);

    function handleChange(event) {
        setSignupFormData((prevSignupFormData) => {
            return {
                ...prevSignupFormData,
                [event.target.name]: event.target.value,
            };
        });
    }

    async function handleSignupSubmit(event) {
        event.preventDefault();

        try {
            // let { data, error } = await supabase.auth.signUp({
            //     email: signupFormData.email,
            //     password: signupFormData.password,
            //     options: {
            //         data: {
            //             displayName: signupFormData.displayName,
            //         },
            //     },
            // });

            let { error } = await supabase.auth.signUp({
                email: signupFormData.email,
                password: signupFormData.password,
                options: {
                    data: {
                        displayName: signupFormData.displayName,
                    },
                },
            });

            if (error) throw error;
            setShowCheckEmailMessage(true);
            alert("Hi, check your email for verification, please.");

            navigate("/");
        } catch (error) {
            alert(error);
            console.error("Signup error:", error.message);
        }
    }

    return (
        <div>
            <h1 className="header-title">
                <span>To do today</span>
            </h1>

            <div className="auth-form">
                <h3>Sign Up</h3>
                <form onSubmit={handleSignupSubmit}>
                    <input
                        placeholder="Name"
                        name="displayName"
                        onChange={handleChange}
                    />

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
                        <button type="submit">Submit</button>
                    </div>
                </form>
                Already have an account?<Link to="/">Login</Link>
            </div>

            <CheckEmailMessage
                isOpen={showCheckEmailMessage}
                message="mmm."
                onClose={() => setShowCheckEmailMessage(false)}
            />
        </div>
    );
};

export default SignUp;
