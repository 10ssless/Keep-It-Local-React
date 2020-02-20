import React from "react";
import Bubble from "./../../components/Bubble/Bubble";
import Form from "./../../components/Form/Form";
import './Home.css';
import Loading from "./../../components/Loading/Loading.js";

class Home extends React.Component {

    state = {
        formType: "login",
        username: "",
        password: "",
        referralCode: "",
        loading: false,
    }

    componentDidMount() {
        this.setState({ formType: "login" })
    }

    newUser = event => {
        event.preventDefault();
        this.setState({ loading: true });
        this.props.getLocation((loc) => {
            if (loc) {
                const data = {
                    "username": this.state.username,
                    "password": this.state.password,
                    "location": `${loc.latitude}, ${loc.longitude}`,
                    "referral": this.state.referralCode
                }
                fetch(`/user/signup`, {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(data), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(resp => {
                        if (resp.ok) {
                            this.props.setUser(this.state.username);
                        }
                        else {
                            this.props.setError();
                            //display something because of an error
                        }
                        this.setState({ loading: true })
                    })
            }
            else {
                console.log("something went wrong getting location probably");
                return false;
            }
        });
    }

    oldUser = event => {
        event.preventDefault();
        this.setState({ loading: true })
        this.props.getLocation((loc) => {
            if (loc) {
                const url = "/user/login";
                const data = {
                    "username": this.state.username,
                    "password": this.state.password,
                    "location": `${loc.latitude}, ${loc.longitude}`
                }
                fetch(url, {
                    method: 'PUT', // or 'PUT'
                    body: JSON.stringify(data), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(resp => {
                        if (resp.ok) {
                            this.props.setUser(this.state.username);
                        }
                        else {
                            console.log(`there was an issue logging in `);
                            this.props.setError();
                        }
                        this.setState({ loading: false });
                    })
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
        let newType = this.state.formType === "login" ? "signUp" : "login";
        this.setState({ formType: newType, username: "", password: "", referralCode: "" });
    }

    formRender = () => {
        return (
            <Form
                type={this.state.formType}
                switchText={this.switchText}
                submitForm={this.state.formType === "login" ? this.oldUser : this.newUser}
                handleInputChange={this.handleInputChange}
                changeFormType={this.changeFormType}
            >
            </Form>
        );

    }

    render() {
        return (
            <>
                <Loading visible={this.state.loading} text='locating events near you...'/>
                {/* NEEDS PROPS FOR CONDITIONAL RENDER */}
                <Bubble loggedIn={this.props.loggedIn} focus={null}/>


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

            </>
        )
    }

}


export default Home;