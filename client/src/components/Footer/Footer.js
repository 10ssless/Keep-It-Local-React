import React from "react";
import './Footer.css';

const config = {
    old: {
        text: "HERE ARE YOUR EXISTING CODES:"
    },
    new: {
        text: "HERE IS YOUR NEW CODE:"
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

            <div id="refer-box" onClick={props.toggleReferral} style={props.referral ? { "display": "block" } : { "display": "none" }}>
                <p>{text}</p>
                {codes.map(code => {
                    return (
                        <p key={code}>
                            {code}
                        </p>
                    );
                })}
            </div>

        </footer>
    )
}

Footer.defaultProps = {
    status: 0,
    codes: [],
    status: 'new'
}

export default Footer;