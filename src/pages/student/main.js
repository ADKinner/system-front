import React from "react";
import '../../styles/student.css'
import {goLoginPage, goProfilePage, goStudentGroup, goMainPage} from "../../redirect";

class StudentMainPage extends React.Component {

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_STUDENT":
                    this.setState({isStudent: true});
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    render() {
        return (
            <div className="main_st">
                <div className="bar_p">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                    <a onClick={() => goProfilePage(this.props, '/student')}>Profile</a>
                    <a onClick={() => goStudentGroup(this.props)}>Group</a>
                    <a className="active" onClick={() => goMainPage(this.props, '/student')}>Main</a>
                </div>
            </div>
        )
    }
}

export default StudentMainPage;

