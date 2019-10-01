import React from "react";
// import { Link } from "react-router-dom";
import './Footer.css';

function Footer(){
    return(
        <footer className="footer">
            <button id="refer-link">REFER A FRIEND</button>
            KEEP IT LOCAL®
            <span id="logout"><a href="/logout" id="logout-link">LOGOUT</a></span>
        </footer>
    )
}



export default Footer;