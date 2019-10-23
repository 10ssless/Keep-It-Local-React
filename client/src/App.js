import React from "react";
import { Router, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home/Home"
import Events from "./pages/Events/Events"
import Create from "./pages/Create/Create"
import './App.css';
import history from './history';
import Footer from './components/Footer/Footer'

class App extends React.Component {

  state = {
    currentUser: "",
    loggedIn: false,
    referal: false,
    referalCodes: [],
    status: "old"
  }

  toggleReferal = () => {
    let toggle = this.state.referal ? false : true;
    this.getReferralCode(data => {
      const { status, codes } = data;
      console.log(codes);
      this.setState({ referal: toggle, referalCodes: codes, status: status ? "new" : "old"});
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
    this.setState({ currentUser: username, loggedIn: true });
  }

  getLocation = (cb) => {
    navigator.geolocation.getCurrentPosition(function (position) {
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

  renderRoutes = () => {
    if (this.state.loggedIn) {
      return (
        <div className="wrapper">
          <Route exact path="/" render={(props) => {
            return (
              <Events
                {...props}
              />
            )
          }}
          />
          <Route exact path="/events" render={(props) => {
            return (
              <Events
                {...props}
              />
            )
          }}
          />
          <Route path="/events/:id" render={(props) => {
            return (
              <>
                <Events
                  {...props} focusing={true}
                  currentUser={this.state.currentUser}
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
        <Footer
          loggedIn={this.state.loggedIn}
          referal={this.state.referal}
          toggleReferal={this.toggleReferal}
          codes={this.state.referalCodes}
          logout={this.logout}
          status={this.state.status} />
      </>
    )
  }
}

export default App;
