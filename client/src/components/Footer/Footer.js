import React from "react";
import './Footer.css';

function Footer(props) {
    const { codes } = props;
    console.log(props);
    return (
        <footer className="footer">
            {props.loggedIn ? <button id="refer-link" onClick={props.toggleReferal}>REFER A FRIEND</button> : null}
            KEEP IT LOCAL®
            {props.loggedIn ? <span id="logout" onClick={props.logout}>LOGOUT</span> : null}
            <div id="refer-box" onClick={props.toggleReferal} style={props.referal ? { "display": "block" } : { "display": "none" }}>
                <p>HERE ARE YOUR EXISTING CODES:</p>
                {codes ? codes.map(code => {
                    return (
                        <p key={code}>
                            {code}
                        </p>
                    );
                }) : null}
            </div>
        </footer>
    )
}



export default Footer;