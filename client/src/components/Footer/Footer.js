import React from "react";
// import { Link } from "react-router-dom";
import './Footer.css';

function Footer(props){
    return(
        <footer className="footer">
            {props.loggedIn ? <button id="refer-link" onClick={props.toggleReferal}>REFER A FRIEND</button> : null}
            KEEP IT LOCAL®
            {props.loggedIn ? <span id="logout" onClick={props.logout}>LOGOUT</span> : null}
        </footer>
    )
}



export default Footer;