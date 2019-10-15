import React from "react";
import Bubble from "./../../components/Bubble/Bubble";
import Footer from "./../../components/Footer/Footer";
import Form from "./../../components/Form/Form";
import './Home.css';

class Home extends React.Component {

    state = {
        formType: "login",
        username: "",
        password: "",
        referralCode: ""
    }

    componentDidMount() {
        this.setState({ formType: "login" })
    }

    newUser = event => {
        event.preventDefault();
        this.props.getLocation((loc) => {
            if (loc) {
                const data = {
                    "username": this.state.username,
                    "password": this.state.password,
                    "location": `${loc.latitude}, ${loc.longitude}`,
                    "referral": this.state.referralCode
                }
                try {
                    fetch(`/api/signup`, {
                        method: 'POST', // or 'PUT'
                        body: JSON.stringify(data), // data can be `string` or {object}!
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(resp => {
                            console.log(resp);
                            if (resp.ok) {
                                this.props.setUser(this.state.username);
                            }
                            else {
                                console.log(`there was an issue logging in `);
                            }
                        })
                    // .then(json => {
                    //     console.log(json)
                    // });
                } catch (error) {
                    console.error('Error:', error);
                }
                return false;
            }
            else {
                console.log("something went wrong getting location probably");
                return false;
            }
        });
    }

    oldUser = (event) => {
        event.preventDefault();
        this.props.getLocation((loc) => {
            if (loc) {
                const url = "/api/login";
                const data = {
                    "username": this.state.username,
                    "password": this.state.password,
                    "location": `${loc.latitude}, ${loc.longitude}`
                }
                try {
                    fetch(url, {
                        method: 'PUT', // or 'PUT'
                        body: JSON.stringify(data), // data can be `string` or {object}!
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(resp => {
                            console.log(resp);
                            if (resp.ok) {
                                this.props.setUser(this.state.username);
                            }
                            else {
                                console.log(`there was an issue logging in `);
                            }
                        })
                    // .then(json => {
                    //     console.log(json)
                    // });
                } catch (error) {
                    console.error('Error:', error);
                }
                return false;
            }
            else {
                console.log("something went wrong getting location probably");
                return false;
            }
        });
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    changeFormType = () => {
        console.log("switched");
        let newType = this.state.formType === "login" ? "signUp" : "login";
        this.setState({ formType: newType, username: "", password: "", referralCode: "" });
    }

    formRender = () => {
        console.log(this.state.formType);
        console.log()
         return (
         <Form
            type={this.state.formType}
            switchText={this.switchText}
            submitForm={this.state.formType === "login" ? this.oldUser : this.newUser}
            handleInputChange={this.handleInputChange}
            changeFormType={this.changeFormType}
        ></Form>
         );

    }

    render() {
        console.log(this.state.formType)
        return (
            <>
                {/* NEEDS PROPS FOR CONDITIONAL RENDER */}
                <Bubble />


                {/* MAKE COMPONENT */}
                <div id="dark-panel">
                    <br /><br /><br /><br /><br /><br />
                    <div id="quote">
                        <h1>find out about<br /> events near you.</h1>
                    </div>
                    <br /><br /><br /><br /><br />

                    {/* MAKE COMPONENT */}
                    {this.formRender()}

                </div>

                {/* NEEDS PROPS FOR CONDITIONAL RENDER */}
                <Footer loggedIn={false} />

            </>
        )
    }

}


export default Home;