import React from "react";
import './Form.css';

const config = {
    login: {
        title: "Login",
        notTitle: "sign up",
        msg: "Welcome Back, ",
        switchText: "already a member? "
    },
    signUp: {
        title: "Sign Up",
        notTitle: "login",
        msg: "Join the club...",
        switchText: "not a member? "
    }
}

export default function Form(props){
    const {title, notTitle, msg, switchText} = config[props.type];
    return(
        <>
            <div>
                <form id={title} onSubmit={(event) => props.submitForm(event)}>
                    <label>{msg}</label><br/>
                    <input type="text" name="username" placeholder=" username" onChange={props.handleInputChange} required/>
                    <input type="password" name="password" placeholder=" password" onChange={props.handleInputChange} required/>
                    {props.type === "signUp" ? <input type="text" name="referral" placeholder="referral code" required/> : null}
                    <button type="submit" id="btn" />
                    <span className="switch-link">{switchText} <button type="button" onClick={props.changeFormType}>{notTitle}</button></span>
                </form>
            </div>
            </>
    );
};