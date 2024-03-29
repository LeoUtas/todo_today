import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignUp, SignIn } from "./components/auth/auth";
import MainApp from "./components/MainApp";
import RequestResetPassword from "./components/auth/requestresetpassword";
import ResetPassword from "./components/auth/resetpassword";
import BlankPage from "./components/auth/blankpage";

const App = () => {
    const [userId, setUserId] = useState(null);
    const [userAccessToken, setUserAccessToken] = useState(null);
    const [displayName, setDisplayName] = useState(null);

    // Retrieve session details from sessionStorage on initial load
    useEffect(() => {
        const storedUserAccessToken = sessionStorage.getItem("token");
        const storedUserId = sessionStorage.getItem("userId");
        const storedDisplayName = sessionStorage.getItem("displayName");

        if (storedUserAccessToken) {
            setUserAccessToken(JSON.parse(storedUserAccessToken));
        }
        if (storedUserId) {
            setUserId(JSON.parse(storedUserId));
        }
        if (storedDisplayName) {
            setDisplayName(storedDisplayName);
        }
    }, []);

    // Update session storage when state changes
    useEffect(() => {
        if (userAccessToken) {
            sessionStorage.setItem("token", JSON.stringify(userAccessToken));
        } else {
            sessionStorage.removeItem("token");
        }

        if (userId) {
            sessionStorage.setItem("userId", JSON.stringify(userId));
        } else {
            sessionStorage.removeItem("userId");
        }

        if (displayName) {
            sessionStorage.setItem("displayName", displayName);
        } else {
            sessionStorage.removeItem("displayName");
        }
    }, [userAccessToken, userId, displayName]);

    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    element={
                        !userAccessToken ? (
                            <SignIn
                                setUserAccessToken={setUserAccessToken}
                                setUserId={setUserId}
                                setDisplayName={setDisplayName}
                            />
                        ) : (
                            <Navigate to="/mainapp" />
                        )
                    }
                />

                <Route
                    path="/requestreset"
                    element={<RequestResetPassword />}
                />

                <Route path="/resetpassword" element={<ResetPassword />} />

                <Route path="/signup" element={<SignUp />} />

                <Route path="/blank" element={<BlankPage />} />

                <Route
                    path="/mainapp"
                    element={
                        userId ? (
                            <MainApp
                                userId={userId}
                                displayName={displayName}
                                setUserAccessToken={setUserAccessToken}
                            />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
