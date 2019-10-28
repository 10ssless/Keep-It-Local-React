import React from "react";
import { Router, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import Create from "./pages/Create/Create";
import './App.css';
import history from './history';
import Footer from './components/Footer/Footer';
import AuthenticationAlert from "../src/components/Alert/Alert.js"

class App extends React.Component {

  state = {
    currentUser: "",
    loggedIn: false,
    referral: false,
    referralCodes: [],
    status: "old",
    error: false,
    success: false
  }

  toggleReferral = () => {
    let toggle = this.state.referral ? false : true;
    this.getReferralCode(data => {
      const { status, codes } = data;
      console.log(codes);
      this.setState({ referral: toggle, referralCodes: codes, status: status ? "new" : "old" });
    })
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
    this.setState({ currentUser: username, loggedIn: true, success: true });
  }

  getLocation = (cb) => {
    navigator.geolocation.getCurrentPosition(function (position) {
      cb(position.coords);
    });
  }

  setError = () => {
    this.setState({ error: true });
  }

  renderAlert = () => {
    const { success, error } = this.state;
    if (success || error) {
      if (success) {
        return (
          <AuthenticationAlert
            type="success"
            closeAlert={this.closeAlert}
          />
        );
      }
      else {
        return (
          <AuthenticationAlert
            type="danger"
            closeAlert={this.closeAlert}
          />);
      }
    }
  }

  closeAlert = () => {
    this.setState({ success: false, error: false })
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
              setError={this.setError}
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
        this.setState({ currentUser: "", loggedIn: false }, () => {
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
        {this.renderAlert()}
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
