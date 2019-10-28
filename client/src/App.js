import React from "react";
import { Router, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import Create from "./pages/Create/Create";
import './App.css';
import history from './history';
import Footer from './components/Footer/Footer';

class App extends React.Component {

  state = {
    currentUser: "",
    loggedIn: false,
    referral: false,
    referralCodes: [],
    status: "old"
  }

  toggleReferral = () => {
    if (this.state.referral){
      this.setState({referral:false})
    } else {
      this.getReferralCode(data => {
        const { status, codes } = data;
        console.log(codes);
        this.setState({ 
          referral: true, 
          referralCodes: codes, 
          status: status ? "new" : "old"
        });
      })
    }
  }

  getReferralCode = cb => {
    fetch(`/api/code`, {
      method: "GET"
    })
      .then(data => {
        console.log(data);
        return data.json();
      })
      .then(data => {
        cb(data);
      })
  }

  setUser = (username) => {
    this.setState({ 
      currentUser: username, 
      loggedIn: true 
    });
  }

  getLocation = (cb) => {
    navigator.geolocation.getCurrentPosition(function (position) {
      cb(position.coords);
    });
  }

  // get active user on initial loading
  componentDidMount() {
    fetch('/currentUser', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
      else {
        return;
      }
    }).then(data => {
      if (data) {
        this.setUser(data.userName);
      }
    })
  }

  // if user is logged in --> render all routes
  // if user is NOT logged in --> only render Home route
  renderRoutes = () => {
    if (this.state.loggedIn) {
      return (
        <div className="wrapper">
          <Route exact path="/" render={(props) => {
            return (
              <Events
                loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
                {...props}
              />
            )
          }}
          />
          <Route exact path="/events" render={(props) => {
            return (
              <Events
                loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
                {...props}
              />
            )
          }}
          />
          <Route path="/events/:id" render={(props) => {
            return (
              <>
                <Events
                  focusing={true} currentUser={this.state.currentUser}
                  {...props} 
                />
              </>
            )
          }}
          />
          <Route exact path="/create" render={(props) => {
            return (
              <Create
                loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
                {...props}
              />
            )
          }}
          />
        </div>
      );
    }
    else {
      return (
        <Route exact path="/" render={(props) => {
          return (
            <Home
              loggedIn={this.state.loggedIn} currentUser={this.state.currentUser}
              setUser={this.setUser} getLocation={this.getLocation} {...props}
            />
          )
        }}
        />
      );
    }
  }

  logout = () => {
    fetch(`/api/logout`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(resp => {
      if (resp.ok) {
        this.setState({ 
            currentUser: "", 
            loggedIn: false,
            referral: false
          }, () => {
          history.push('/');
        });
      }
      else {
        console.log('there was an issue logging out');
      }
    })
  }

  render() {
    return (
      <>
        <Router history={history}>
          {this.renderRoutes()}
          <Route path="*" >
            <Redirect to="/" />
          </Route>
        </Router>
        <Footer
          loggedIn={this.state.loggedIn}
          referral={this.state.referral}
          toggleReferral={this.toggleReferral}
          codes={this.state.referralCodes}
          logout={this.logout}
          status={this.state.status} />
      </>
    )
  }
}

export default App;
