import React from "react";
import '../../styles/admin.css'
import {
    goAdminProfilePage, goAdminsPage,
    goAdminStudentsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
    goLoginPage
} from "../../redirect";

class AdminGroupsPage extends React.Component {

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

    handleGroupsClick() {

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
                    <a className="active" onClick={() => this.handleGroupsClick()}>Группы</a>
                    <a onClick={() => goAdminStudentsPage(this.props)}>Студенты</a>
                    <a onClick={() => goAdminSubjectsPage(this.props)}>Предметы</a>
                </div>
            </div>
        )
    }
}

export default AdminGroupsPage;