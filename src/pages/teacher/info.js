import React from "react";
import '../../styles/teacher/main.css';
import {goLoginPage, goProfilePage, goServerErrorPage, goTeacherLessonPage, goTeacherMainPage} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";

class TeacherInfoPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFindGroup: true,
            isSubjects: false,
            isLessonData: false,
            groupId: '',
            subjectId: '',
            subjects: [],
            students: []
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_TEACHER":
                    // some logic here
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getTeacherInfo() {

    }

    render() {
        return (
            <div className="main_t">
                <div className="bar_p">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                    <a onClick={() => goProfilePage(this.props, '/teacher')}>Profile</a>
                    <a className="active">Info</a>
                    <a onClick={() => goTeacherLessonPage(this.props)}>Lessons</a>
                    <a onClick={() => goTeacherMainPage(this.props)}>Main</a>
                </div>
            </div>
        )
    }
}

export default TeacherInfoPage;

