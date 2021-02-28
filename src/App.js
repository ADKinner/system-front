import React, {Component} from "react";
import './App.css';

import {BrowserRouter as Router, Route, Switch, Link, Redirect} from "react-router-dom";

import LoginPage from "./pages/login"
import StudentPage from "./pages/student"
import RegisterPage from "./pages/register"
import NotFoundPage from "./pages/404"

class App extends Component {

    render() {
        return <Router>
            <Switch>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/student" component={StudentPage}/>
                <Route exact path="/register" component={RegisterPage}/>
                <Route exact path="/404" component={NotFoundPage}/>
                <Redirect exact from="/" to="/login"/>
                <Redirect to="/404"/>
            </Switch>
        </Router>
    }
}

export default App;
