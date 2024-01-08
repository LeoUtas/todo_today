import "../../index.css";
import "./footer.css";
import { useState, useEffect } from "react";
import Logo from "../../assets/logo.png";

const Footer = ({ onClickViewStats, buttonLabel }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const formatTime = (time) => {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;

        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    };

    const getOrdinalSuffix = (date) => {
        const j = date % 10,
            k = date % 100;
        if (j === 1 && k !== 11) {
            return date + "st";
        }
        if (j === 2 && k !== 12) {
            return date + "nd";
        }
        if (j === 3 && k !== 13) {
            return date + "rd";
        }
        return date + "th";
    };

    return (
        <footer>
            <a
                href="https://leoutas.github.io/react_portfolio/"
                target="_blank"
                rel="noreferrer"
            >
                <img src={process.env.PUBLIC_URL + Logo} alt="Logo" />
            </a>
            <div className="timer">
                <span>{time.getFullYear()}</span>:
                <span>{months[time.getMonth()]}</span>:
                <span>{getOrdinalSuffix(time.getDate())}</span>:
                <span>{formatTime(time)}</span>
            </div>
            <div className="stats">
                <button onClick={onClickViewStats}>{buttonLabel}</button>
            </div>
        </footer>
    );
};

export default Footer;
