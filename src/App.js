import React from "react";
import { Switch, Route } from "react-router";
import "rsuite/dist/rsuite.min.css";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { ProfileProvider } from "./context/profile.context";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import LandingPage from "./pages/LandingPage";
import "./styles/main.scss";

function App() {
  return (
    <ProfileProvider>
      <Switch>
        <PublicRoute path="/signin">
          <SignIn />
        </PublicRoute>

        <Route exact path="/">
          <LandingPage />
        </Route>

        <PrivateRoute path="/chat">
          <Home />
        </PrivateRoute>
      </Switch>
    </ProfileProvider>
  );
}

export default App;
