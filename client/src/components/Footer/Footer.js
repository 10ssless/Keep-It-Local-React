import React from "react";
// import { Link } from "react-router-dom";
import './Footer.css';

function Footer(props){
    return(
        <footer className="footer">
            {props.loggedIn ? <button id="refer-link">REFER A FRIEND</button> : null}
            KEEP IT LOCAL®
            {props.loggedIn ? <span id="logout"><a href="/logout" id="logout-link">LOGOUT</a></span> : null}
        </footer>
    )
}



export default Footer;