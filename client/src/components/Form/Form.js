import React from "react";
import { Link } from "react-router-dom";
import './Form.css';

const config = {
    login: {
        title: "login",
        notTitle: "sign up",
        msg: "welcome back, ",
        switchText: "already a member? "
    },
    signUp: {
        title: "sign up",
        notTitle: "login",
        msg: "join the club...",
        switchText: "not a member? "
    }
}

export default function Form(props){
    console.log(props.type);
    const {title, notTitle, msg, switchText} = config[props.type];
    return(
        <>
            {/* // // // // // // // // // // // // // // // // //  */}
            {}

            <div>
                <form id={title} onSubmit={(event) => props.submitForm(event)}>
                    <label>{msg}</label><br/>
                    <input type="text" name="username" placeholder=" username" onChange={props.handleInputChange} required/>
                    <input type="password" name="password" placeholder=" password" onChange={props.handleInputChange} required/>
                    {props.type == "signUp" ? <input type="text" name="referral" placeholder="referral code" required/> : null}
                    <button type="submit" id="login-btn">{title}</button> 
                    <span className="switch-link">{switchText} <button type="button" onClick={props.changeFormType}>{notTitle}</button></span>
                </form>
            </div>

            {/* // // // // // // // // // // // // // // // // //  */}

            {/* <div class="login">
                <form id="login-form">
                    <label>welcome back,</label><br/>
                    <input type="text" name="username" placeholder=" username"/>
                    <input type="password" name="password" placeholder=" password"/>
                    <button type="submit" id="login-btn">login</button> 
                    <span class="switch-link">not a member? <a href="/signup">sign up</a></span>
                </form>
            </div>


            <div class="signup">
                <form id="signup-form">
                    <label>join the network...</label><br/>
                    <input type="text" name="username" placeholder=" username" required/>
                    <input type="password" name="password" placeholder=" password" required/>
                    <input type="text" name="referral" placeholder="referral code" required/>
                    <button type="submit" id="signup-btn">sign up</button>
                
                    <span class="switch-link">already a member? <a href="/login">login</a></span>
                </form>
            </div>



            <div id="home-form">
                <h3>{props.title}</h3><br/>
                <form onSubmit={props.submitForm}>
                    <label>username</label><br/>
                    <input type="text" className="form-input" name="username" onChange={props.handleInputChange} placeholder="not your email" required/><br/>
                    <label>password</label><br/>
                    <input type="password" className="form-input" name="password" onChange={props.handleInputChange} placeholder="be creative" required/><br/>
                    <button type="submit" className="form-button">{props.title}</button>
                </form>
                <br/>
                <span className="switch-link">{props.text}<span className="arrows"> > > > </span><button onClick={props.changeFormType} className="form-button switch-button">{props.notTitle}</button></span>
            </div> */}
        </>
    )
};