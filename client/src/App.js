import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import Bookings from "./pages/Bookings";
import Events from "./pages/Events";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/auth' component={Auth} />
        <Route path='/events' component={Events} />
        <Route path='/bookings' component={Bookings} />
        <Redirect to='/auth' />
      </Switch>
    </Router>
  );
};

export default App;
