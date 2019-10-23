import React from "react";
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
    const {title, notTitle, msg, switchText} = config[props.type];
    return(
        <>
            <div>
                <form id={title} onSubmit={(event) => props.submitForm(event)}>
                    <label>{msg}</label><br/>
                    <input type="text" name="username" placeholder=" username" onChange={props.handleInputChange} required/>
                    <input type="password" name="password" placeholder=" password" onChange={props.handleInputChange} required/>
<<<<<<< HEAD
                    {props.type == "signUp" ? <input type="text" name="referral" placeholder="referral code" required/> : null}
                    <button type="submit" id="login-btn">{title}</button> 
=======
                    {props.type === "signUp" ? <input type="text" name="referral" placeholder="referral code" required/> : null}
                    <button type="submit" id="btn" />
>>>>>>> 440f07747a94fe322d922edc33b9484ce635d691
                    <span className="switch-link">{switchText} <button type="button" onClick={props.changeFormType}>{notTitle}</button></span>
                </form>
            </div>
            </>
    );
};