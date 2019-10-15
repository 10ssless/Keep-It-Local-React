import React from "react";
import { Router, Route } from "react-router-dom";
import Home from "./pages/Home/Home"
import Events from "./pages/Events/Events"
import Focus from "./pages/Focus/Focus"
import Create from "./pages/Create/Create"
import './App.css';
import history from './history';
import Footer from './components/Footer/Footer'

class App extends React.Component {

  state = {
    currentUser: "",
    loggedIn: false,
    referral: false
  }

  toggleReferral = () => {
    let toggle = this.state.referral ? false : true;
    this.setState({ referral: toggle });
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
          <Route exact path="/" render={(props) => {
            return (
              <Events
                loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
                toggleReferral={this.toggleReferral} referralState={this.state.referral}
                getLocation={this.getLocation} currentUser={this.state.currentUser}
                {...props}
              />
            )
          }}
          />
          <Route exact path="/events" render={(props) => {
            return (
              <Events
                loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
                toggleReferral={this.toggleReferral} referralState={this.state.referral}
                {...props}
              />
            )
          }}
          />
          <Route path="/events/:id" render={(props) => {
            return (
              <>
              <Events
                loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
                toggleReferral={this.toggleReferral} referralState={this.state.referral}
                {...props}
              />
              <Focus currentUser={this.state.currentUser} {...props}/>
              </>
            )
          }}
          />
          <Route exact path="/create" render={() => {
            return (
              <Create
                loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
                toggleReferral={this.toggleReferral} referralState={this.state.referral}
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

  logout = () => {
    console.log(`logging out`);
    fetch(`/logout`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
    }
    }).then(resp => {
      console.log(resp);
      console.log(`resp.ok === ${resp.ok}`);
      if(resp.ok){
        this.setState({currentUser: "", loggedIn: false});
      }
      else{
        console.log('there was an issue logging out');
      } 
    })
  }

  render() {
    return (
      <>
        <Router history={history}>
          {this.renderRoutes()}
        </Router>
        <Footer loggedIn={this.state.loggedIn} toggleReferral={this.toggleReferral} logout={this.logout}/>
      </>
    )
  }
}

export default App;
