import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home/Home"
import Events from "./pages/Events/Events"
import Focus from "./pages/Focus/Focus"
import Create from "./pages/Create/Create"
import './App.css';

class App extends React.Component {

  state={
    currentUser: null,
    loggedIn: false,
    referal: false
  }

  toggleReferal = () => {
    let toggle = this.state.referal ? false : true;
    this.setState({referal: toggle});
  }

  setUser = (username) => {
    this.setState({currentUser: username, loggedIn: true});
  }

  render(){
    return (
      <>
        <Router>
          <div className="wrapper">
            <Route exact path="/" render={()=>{
              return(
                <Home loggedIn={this.state.loggedIn} currentUser={this.state.currentUser} setUser={this.setUser}/>
              )
            }}
            />
            <Route path="/events" render={()=>{
              return(
                <Events 
                  loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
                  toggleReferal={this.toggleReferal} referalState={this.state.referal}
                />
              )
            }}
            />
            <Route exact path="/events/:id" render={()=>{
              return(
                <Focus />
              )
            }}
            />
            <Route exact path="/create" render={()=>{
              return(
                <Create 
                  loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
                  toggleReferal={this.toggleReferal} referalState={this.state.referal}
                />
              )
            }}
            />
          </div>
        </Router>
      </>
    )
  }
}

export default App;
