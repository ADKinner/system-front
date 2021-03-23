import React from "react";
import axios from "axios";
import {
    goLoginPage,
    goServerErrorPage,
    goStudentGroupPage,
    goStudentMainPage,
    goStudentProfilePage,
    goStudentTeacherPage
} from "../../redirect";
import * as constants from "../../constants";
import '../../styles/student.css';

class StudentTeacherPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teachers: []
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_STUDENT":
                    this.getStudentData();
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getStudentData() {
        axios.get(constants.DEFAULT_URL + constants.STUDENTS_URL + constants.SLASH + localStorage.getItem("id")
            + constants.TEACHERS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    isEmpty: false,
                    teachers: response.data
                });
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
                } else if (error.response.status === 404) {
                    this.setState({isEmpty: true});
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
                    <a onClick={() => goStudentTeacherPage(this.props)}>Учителя</a>
                    <a onClick={() => goStudentGroupPage(this.props)}>Группа</a>
                    <a onClick={() => goStudentMainPage(this.props)}>Главная</a>
                </div>
                <div className="table_panel">
                    <div>
                        <h1 id='title'>Учителя</h1>
                        <table id='data'>
                            <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Фамилия</th>
                                <th>Имя</th>
                                <th>Отчество</th>
                                <th>Email</th>
                                <th>Предмет</th>
                            </tr>
                            {this.state.teachers.map((teacher, index) => {
                                const {id, surname, name, patronymic, email, subjectName} = teacher
                                return (
                                    <tr key={id}>
                                        <td>{index + 1}</td>
                                        <td>{surname}</td>
                                        <td>{name}</td>
                                        <td>{patronymic}</td>
                                        <td>{email}</td>
                                        <td>{subjectName}</td>
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

export default StudentTeacherPage;