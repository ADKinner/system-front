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
import '../../styles/student/teacher.css';

class StudentTeacherPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teachers: [],
            isEmpty: true
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
            .then((response) => {
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

    renderTableData() {
        return this.state.teachers.map((teacher, index) => {
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
        })
    }

    renderTableHeader() {
        let header = Object.keys(this.state.teachers[0])
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    render() {
        return (
            <div className="main_teacher_st">
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                    <a onClick={() => goStudentProfilePage(this.props)}>Profile</a>
                    <a onClick={() => goStudentTeacherPage(this.props)}>Teachers</a>
                    <a onClick={() => goStudentGroupPage(this.props)}>Group</a>
                    <a onClick={() => goStudentMainPage(this.props)}>Main</a>
                </div>
                <div className="st_group_table_panel">
                    {!this.state.isEmpty && (
                        <div>
                            <h1 id='title'>Teachers</h1>
                            <table id='teachers'>
                                <tbody>
                                <tr>{this.renderTableHeader()}</tr>
                                {this.renderTableData()}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default StudentTeacherPage;