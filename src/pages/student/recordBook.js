import React from "react";
import {goLoginPage, goStudentGroupPage, goStudentMainPage, goStudentProfilePage} from "../../redirect";
import '../../styles/student.css';

class StudentRecordBookPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_STUDENT":
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    recordBookBar() {

    }

    render() {
        return (
            <div className="main">
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a onClick={() => goStudentProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => this.recordBookBar()}>Учителя</a>
                    <a onClick={() => goStudentGroupPage(this.props)}>Группа</a>
                    <a onClick={() => goStudentMainPage(this.props)}>Главная</a>
                </div>
            </div>
        )
    }
}

export default StudentRecordBookPage;