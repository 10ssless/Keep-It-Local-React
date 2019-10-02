import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home/Home"
import Events from "./pages/Events/Events"
import Focus from "./pages/Focus/Focus"
import Create from "./pages/Create/Create"
import './App.css';

class App extends React.Component {

  state={
    currentUser: "jeff",
    loggedIn: true
  }

  render(){
    return (
      <>
        <Router>
          <div className="wrapper">
            <Route exact path="/" render={()=>{
              return(
                <Home loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}/>
              )
            }}
            />
            <Route path="/events" render={()=>{
              return(
                <Events loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}/>
              )
            }}
            />
            <Route exact path="/events/:id" render={()=>{
              return(
                <Focus loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}/>
              )
            }}
            />
            <Route exact path="/create" render={()=>{
              return(
                <Create loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}/>
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
