import React, {Component} from "react";
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import LoginPage from "./pages/login";
import StudentPage from "./pages/student";
import RegisterPage from "./pages/register";
import SuccessRegistrationPage from "./pages/successRegistration";
import SuccessPasswordRepairPage from "./pages/successPasswordRepair";
import RecoveryPasswordPage from "./pages/recovery";
import NotFoundErrorPage from "./pages/404";
import ServerErrorPage from "./pages/500";
import './App.css';

class App extends Component {

    render() {
        return <Router>
            <Switch>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/student" component={StudentPage}/>
                <Route exact path="/register" component={RegisterPage}/>
                <Route exact path="/register/success" component={SuccessRegistrationPage}/>
                <Route exact path="/recovery/success" component={SuccessPasswordRepairPage}/>
                <Route exact path="/recovery" component={RecoveryPasswordPage}/>
                <Route exact path="/404" component={NotFoundErrorPage}/>
                <Route exact path="/500" component={ServerErrorPage}/>
                <Redirect exact from="/" to="/login"/>
                <Redirect to="/404"/>
            </Switch>
        </Router>
    }
}

export default App;
