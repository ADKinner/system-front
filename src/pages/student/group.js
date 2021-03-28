import React from "react";
import axios from "axios";
import {
    goLoginPage,
    goServerErrorPage,
    goStudentGroupPage,
    goStudentSubjectsPage,
    goStudentProfilePage,
    goStudentRecordBookPage
} from "../../redirect";
import * as constants from "../../constants";
import '../../styles/main.css';

class StudentGroupPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: []
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_STUDENT":
                    this.getStudents(localStorage.getItem("groupId"));
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getStudents(id) {
        axios.get(constants.DEFAULT_URL + constants.STUDENTS_URL + "/groups/" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                students: response.data
            });
        }).catch((error) => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    render() {
        return (
            <div className="main">
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a onClick={() => goStudentProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goStudentRecordBookPage(this.props)}>Зачётка</a>
                    <a className="active" onClick={() => goStudentGroupPage(this.props)}>Группа</a>
                    <a onClick={() => goStudentSubjectsPage(this.props)}>Предметы</a>
                </div>
                <div className="table_panel">
                    <div>
                        <h1 id='title'>Группа</h1>
                        <table id='data'>
                            <tbody>
                            <tr>
                                <th>№</th>
                                <th>Фамилия</th>
                                <th>Имя</th>
                                <th>Отчество</th>
                                <th>Email</th>
                            </tr>
                            {this.state.students.map((student, index) => {
                                const {id, surname, name, patronymic, email} = student
                                return (
                                    <tr key={id}>
                                        <td>{index + 1}</td>
                                        <td>{surname}</td>
                                        <td>{name}</td>
                                        <td>{patronymic}</td>
                                        <td>{email}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default StudentGroupPage;