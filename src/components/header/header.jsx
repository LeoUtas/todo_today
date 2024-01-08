import { useNavigate } from "react-router-dom";
import "../../index.css";
import "./header.css";
import "../auth/auth.css";

const Header = ({
    onNewDayClick,
    displayName,

    setUserAccessToken,
}) => {
    let navigate = useNavigate();

    function handleLogout() {
        setUserAccessToken(null);
        sessionStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div>
            <h1 className="header-title">
                <span>To do today</span>
                <span>
                    <button onClick={onNewDayClick} className="newday-btn btn">
                        New day
                    </button>
                </span>
                <div className="hello">
                    <span>Hello {displayName}</span>
                    <div className="auth-btn">
                        <button onClick={handleLogout}>Log out</button>
                    </div>
                </div>
            </h1>
        </div>
    );
};

export default Header;
