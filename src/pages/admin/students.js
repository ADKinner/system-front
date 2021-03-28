import React from "react";
import '../../styles/admin.css';
import {
    goAdminGroupsPage,
    goAdminProfilePage, goAdminRegisterStudentsPage, goAdminsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
    goLoginPage
} from "../../redirect";

class AdminStudentsPage extends React.Component {

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
                case "ROLE_ADMIN":
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getStudentsByNSP() {

    }

    getStudentsById() {

    }

    getRegStudentDetails() {

    }

    createRegStudentDetails() {

    }

    deleteStudent() {

    }

    handleStudentsClick() {

    }

    render() {
        return (
            <div className="main">
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a onClick={() => goAdminProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goAdminsPage(this.props)}>Администраторы</a>
                    <a onClick={() => goAdminTeachersPage(this.props)}>Учителя</a>
                    <a onClick={() => goAdminGroupsPage(this.props)}>Группы</a>
                    <a onClick={() => goAdminRegisterStudentsPage(this.props)}>Регистрация студентов</a>
                    <a className="active" onClick={() => this.handleStudentsClick()}>Студенты</a>
                    <a onClick={() => goAdminSubjectsPage(this.props)}>Предметы</a>
                </div>
            </div>
        )
    }
}

export default AdminStudentsPage;

