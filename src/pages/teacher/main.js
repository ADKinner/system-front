import React from "react";
import '../../styles/teacher/main.css';
import {goLoginPage, goProfilePage, goStudentGroupPage, goStudentTeacherPage} from "../../redirect";

class TeacherPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_TEACHER":
                    //this.getStudentSubjects();
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    render() {
        return (
            <div className="main_t">
                <div className="bar_p">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                    <a onClick={() => goProfilePage(this.props, '/teacher')}>Profile</a>
                    <a className="active">Main</a>
                </div>
            </div>
        )
    }
}

export default TeacherPage;

