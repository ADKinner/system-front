import React, {Component} from "react";
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import LoginPage from "./pages/login";
import StudentPage from "./pages/student";
import TeacherPage from "./pages/teacher";
import AdminPage from "./pages/admin";
import ProfilePage from "./pages/profile";
import RegisterPage from "./pages/register";
import SuccessRegistrationPage from "./pages/successRegistration";
import SuccessPasswordRepairPage from "./pages/successPasswordRepair";
import RecoveryPasswordPage from "./pages/recovery";
import ChangePasswordPage from "./pages/changePassword";
import NotFoundErrorPage from "./pages/404";
import ServerErrorPage from "./pages/500";
import './App.css';

class App extends Component {

    render() {
        return <Router>
            <Switch>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/student" component={StudentPage}/>
                <Route exact path="/teacher" component={TeacherPage}/>
                <Route exact path="/admin" component={AdminPage}/>
                <Route exact path="/student/profile" component={ProfilePage}/>
                <Route exact path="/teacher/profile" component={ProfilePage}/>
                <Route exact path="/admin/profile" component={ProfilePage}/>
                <Route exact path="/register" component={RegisterPage}/>
                <Route exact path="/register/success" component={SuccessRegistrationPage}/>
                <Route exact path="/recovery/success" component={SuccessPasswordRepairPage}/>
                <Route exact path="/recovery" component={RecoveryPasswordPage}/>
                <Route exact path="/change/password" component={ChangePasswordPage}/>
                <Route exact path="/404" component={NotFoundErrorPage}/>
                <Route exact path="/500" component={ServerErrorPage}/>
                <Redirect exact from="/" to="/login"/>
                <Redirect to="/404"/>
            </Switch>
        </Router>
    }
}

export default App;
