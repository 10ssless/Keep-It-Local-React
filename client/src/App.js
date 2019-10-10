import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home/Home"
import Events from "./pages/Events/Events"
import Focus from "./pages/Focus/Focus"
import Create from "./pages/Create/Create"
import './App.css';

class App extends React.Component {

  state = {
    currentUser: "",
    loggedIn: false,
    referal: false
  }

  toggleReferal = () => {
    let toggle = this.state.referal ? false : true;
    this.setState({ referal: toggle });
  }

  setUser = (username) => {
    this.setState({ currentUser: username, loggedIn: true });
  }

  getLocation = (cb) => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position.coords);
      cb(position.coords);
    });
  }

  componentDidMount() {
    fetch('/currentUser', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((resp) => {
      if(resp.ok) {
        return resp.json();
      }
      else{
        console.log('user not signed in');
        return;
      }
    }).then(data => {
      if(data){
        this.setUser(data.userName);
      }
    })
  }

  renderRoutes = () => {
    if (this.state.loggedIn) {
      return (
        <div className="wrapper">
          <Route exact path="/" render={() => {
            return (
              <Events
                loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
                toggleReferal={this.toggleReferal} referalState={this.state.referal}
                getLocation={this.getLocation}
              />
            )
          }}
          />
          <Route path="/events" render={() => {
            return (
              <Events
                loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
                toggleReferal={this.toggleReferal} referalState={this.state.referal}
              />
            )
          }}
          />
          <Route exact path="/events/:id" render={() => {
            return (
              <Focus currentUser={this.state.currentUser}/>
            )
          }}
          />
          <Route exact path="/create" render={() => {
            return (
              <Create
                loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
                toggleReferal={this.toggleReferal} referalState={this.state.referal}
              />
            )
          }}
          />
        </div>
      );
    }
    else {
      return (
        <Route exact path="/" render={() => {
          return (
            <Home
              loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
              setUser={this.setUser} getLocation={this.getLocation}
            />
          )
        }}
        />
      );
    }
  }

  render() {
    return (
      <>
        <Router>
          {this.renderRoutes()}
        </Router>
      </>
    )
  }
}

export default App;
