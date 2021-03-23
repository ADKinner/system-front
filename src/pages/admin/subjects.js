import React from "react";
import '../../styles/admin.css'
import {
    goAdminGroupsPage,
    goAdminProfilePage,
    goAdminStudentsPage,
    goAdminTeachersPage,
    goLoginPage
} from "../../redirect";

class AdminSubjectsPage extends React.Component {

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

    handleSubjectsClick() {

    }

    render() {
        return (
            <div className="main">
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a className="active" onClick={() => goAdminProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goAdminTeachersPage(this.props)}>Учителя</a>
                    <a onClick={() => goAdminGroupsPage(this.props)}>Группы</a>
                    <a onClick={() => goAdminStudentsPage(this.props)}>Студенты</a>
                    <a onClick={() => this.handleSubjectsClick()}>Предметы</a>
                </div>
            </div>
        )
    }
}

export default AdminSubjectsPage;