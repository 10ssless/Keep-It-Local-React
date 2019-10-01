import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home/Home"
import Events from "./pages/Events/Events"
import Focus from "./pages/Focus/Focus"
import Create from "./pages/Create/Create"
import './App.css';

function App() {
  return (
    <>
      <Router>
        <div className="wrapper">
          <Route exact path="/" component={Home}/>
          <Route path="/events" component={Events}/>
          <Route exact path="/events/:id" component={Focus}/>
          <Route exact path="/create" component={Create}/>
        </div>
      </Router>
    </>
  );
}

export default App;
