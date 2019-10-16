import React from "react";
import { Link } from "react-router-dom";
import './Bubble.css';

function Bubble(){
    return(
        <div id="bubble">
        <img src={__dirname + "header2.gif"} id="header-logo" alt="header gif"/>

            <hgroup className="speech-bubble">
                <h1>WHAT'S<br/>HAPPENIN' TN?</h1>
            </hgroup>
            <hgroup className="speech-bubble-2">
                <h1><Link to="/events" id="home">#KEEPITLOCAL</Link></h1>
            </hgroup>
            
        </div>
    )
}


export default Bubble;