import React from "react";
import { Link } from "react-router-dom";
import './Bubble.css';



function Bubble(props){
    return(
        <div id="bubble">
            <Link to={props.loggedIn ? "/events" : "/"}>
                <img src={__dirname + "header2.gif"} id="header-logo" alt="header gif"/>
            </Link>
            <div style={props.focus ? {"display":"none"} : {"display":"block"}}>
                <hgroup className="speech-bubble">
                    <h1>WHAT'S<br/>HAPPENIN' TN?</h1>
                </hgroup>
                <hgroup className="speech-bubble-2">
                    <h1><Link to={props.loggedIn ? "/events" : "/"} id="home">#KEEPITLOCAL</Link></h1>
                </hgroup>
            </div>
            
        </div>
    )
}


export default Bubble;