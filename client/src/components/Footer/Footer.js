import React from "react";
import './Footer.css';

const config = {
    old: {
        text: "Here are your active Referral Codes:"
    },
    new: {
        text: "New members must wait 3 days before generating Referral Codes."
    }
}

function Footer(props) {
    const { codes, status } = props;
    const { text } = config[status];
    console.log(text);
    console.log(props);
    return (
        <footer className="footer">
            
            {props.loggedIn ? <button id="refer-link" onClick={props.toggleReferral}>REFER A FRIEND</button> : null}
            
            KEEP IT LOCAL®

            {props.loggedIn ? <span id="logout-link" onClick={props.logout}>LOGOUT</span> : null}

            <div id="refer-box" onDoubleClick={props.toggleReferral} style={props.referral ? { "display": "block" } : { "display": "none" }}>
                <p>{text}</p>
                {codes.map(code => {
                    return (
                        <p key={code} className="referral-code">
                            {code}
                        </p>);
                })}
            </div>

        </footer>
    )
}

Footer.defaultProps = {
    codes: [],
    status: 'new'
}

export default Footer;