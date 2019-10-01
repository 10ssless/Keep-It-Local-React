import React from "react";
import Bubble from "./../../components/Bubble/Bubble";
import Footer from "./../../components/Footer/Footer";
import Form from "./../../components/Form/Form";
import './Home.css';

class Home extends React.Component{

    state = {
        formType:"",
        username:"",
        password:""
    }

    componentDidMount(){
        this.setState({formType:"login"})
    }

    handleInputChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });
    }

    changeFormType = () => {
        let newType = this.state.formType === "login" ? "sign up" : "login";
        this.setState({formType: newType});
    }

    formRender = () => {
        if(this.state.formType === "sign up"){
            return (
                <>
                    <Form 
                        title={this.state.formType}
                        notTitle={"login"}
                        msg={"join the club..."}
                        switchText={"already a member? "} 
                        submitForm={this.newUser}
                        handleInputChange={this.handleInputChange}
                        changeFormType={this.changeFormType}
                    ></Form>
                </>
            )
        }
        else{
            return (
                <>
                    <Form 
                        title={this.state.formType} 
                        notTitle={"sign up"} 
                        msg={"welcome back,"}
                        switchText={"not a member? "} 
                        submitForm={this.oldUser}
                        handleInputChange={this.handleInputChange}
                        changeFormType={this.changeFormType}
                    ></Form>
                </>
            )      
        }
        
    }

    render(){
        console.log(this.state.formType)
        return (
            <>
                {/* NEEDS PROPS FOR CONDITIONAL RENDER */}
                <Bubble/>
                

                {/* MAKE COMPONENT */}
                <div id="dark-panel">
                    <br/><br/><br/><br/><br/><br/>
                    <div id="quote">
                        <h1>find out about<br/> events near you.</h1>
                    </div>
                    <br/><br/><br/><br/><br/>
                    
                    {/* MAKE COMPONENT */}
                    {this.formRender()}

                </div>

                {/* NEEDS PROPS FOR CONDITIONAL RENDER */}
                <Footer/>

            </>
        )
    }

}


export default Home;