import "../index.css";
import "./header.css";

const Header = ({ onNewDayClick }) => {
    return (
        <div>
            <h1 className="header-title">
                <span>To do today</span>
                <span>
                    <button onClick={onNewDayClick} className="newday-btn btn">
                        New day
                    </button>
                </span>
            </h1>
        </div>
    );
};

export default Header;
