import React from "react";
import './Footer.css';

function Footer(props){
    return(
        <footer className="footer">
            {props.loggedIn ? <button id="refer-link" onClick={props.toggleReferral}>REFER A FRIEND</button> : null}
            KEEP IT LOCAL®
            {props.loggedIn ? <span id="logout" onClick={props.logout}>LOGOUT</span> : null}
        </footer>
    )
}



export default Footer;