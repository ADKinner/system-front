import React, {Component} from "react";
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import LoginPage from "./pages/login";
import StudentMainPage from "./pages/student/main";
import StudentGroupPage from "./pages/student/group";
import StudentTeacherPage from "./pages/student/teacher";
import TeacherMainPage from "./pages/teacher/main";
import TeacherLessonPage from "./pages/teacher/lesson";
import TeacherInfoPage from "./pages/teacher/info";
import AdminPage from "./pages/admin/admin";
import ProfilePage from "./pages/profile";
import RegisterPage from "./pages/register";
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
                <Route exact path="/student" component={StudentMainPage}/>
                <Route exact path="/teacher" component={TeacherMainPage}/>
                <Route exact path="/teacher/lessons" component={TeacherLessonPage}/>
                <Route exact path="/teacher/info" component={TeacherInfoPage}/>
                <Route exact path="/admin" component={AdminPage}/>
                <Route exact path="/admin/profile" component={ProfilePage}/>
                <Route exact path="/student/profile" component={ProfilePage}/>
                <Route exact path="/student/group" component={StudentGroupPage}/>
                <Route exact path="/student/teachers" component={StudentTeacherPage}/>
                <Route exact path="/teacher/profile" component={ProfilePage}/>
                <Route exact path="/register" component={RegisterPage}/>
                <Route exact path="/recovery" component={RecoveryPasswordPage}/>
                <Route exact path="/change-password" component={ChangePasswordPage}/>
                <Route exact path="/404" component={NotFoundErrorPage}/>
                <Route exact path="/500" component={ServerErrorPage}/>
                <Redirect exact from="/" to="/login"/>
                <Redirect to="/404"/>
            </Switch>
        </Router>
    }
}

export default App;
