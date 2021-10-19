import React, { Component } from "react";

import "../assets/css/App.css";

//router
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

//global timer
import Global from "./globalTimer/globalTimer.js";

//views
import Home from "./Home.js";
import StoryTelling from "./newSession/storyTelling.js";

// main app method
class App extends Component {
  state = {
    start: false,
  };
  handleStart = (val) => {
    this.setState({
      start: val,
    });
  };



  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <Home onStart={this.handleStart} {...props} />}
          />
          <Route
            path="/storyTelling"
            render={(props) => (
              <StoryTelling onStart={this.handleStart} {...props} />
            )}
            exact
          ></Route>
          <Redirect to="/" />
        </Switch>
        <Global start={this.state.start} />
      </Router>
    );
  }
}

export default App;
