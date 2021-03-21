import React from "react";
import axios from "axios";
import {
    goLoginPage,
    goProfilePage,
    goServerErrorPage,
    goStudentGroupPage,
    goStudentMainPage,
    goStudentTeacherPage
} from "../../redirect";
import * as constants from "../../constants";
import '../../styles/student/group.css';

class StudentGroupPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [],
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
            + constants.GROUP_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                this.setState({
                    isEmpty: false,
                    students: response.data
                });
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
                }
            });
    }

    renderTableData() {
        return this.state.students.map((student, index) => {
            const {id, surname, name, patronymic, email} = student
            return (
                <tr key={id}>
                    <td>{index + 1}</td>
                    <td>{name}</td>
                    <td>{surname}</td>
                    <td>{patronymic}</td>
                    <td>{email}</td>
                </tr>
            )
        })
    }

    renderTableHeader() {
        let header = Object.keys(this.state.students[0])
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    render() {
        return (
            <div className="main_group_st">
                <div className="bar_p">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                    <a onClick={() => goProfilePage(this.props, '/student')}>Profile</a>
                    <a onClick={() => goStudentTeacherPage(this.props)}>Teachers</a>
                    <a className="active" onClick={() => goStudentGroupPage(this.props)}>Group</a>
                    <a onClick={() => goStudentMainPage(this.props)}>Main</a>
                </div>
                <div className="st_group_table_panel">
                    {!this.state.isEmpty && (
                        <div>
                            <h1 id='title'>Group</h1>
                            <table id='students'>
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

export default StudentGroupPage;