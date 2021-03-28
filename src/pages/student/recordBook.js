import React from "react";
import {
    goLoginPage,
    goStudentGroupPage,
    goStudentSubjectsPage,
    goStudentProfilePage,
    goServerErrorPage
} from "../../redirect";
import '../../styles/admin.css';
import axios from "axios";
import * as constants from "../../constants";

class StudentRecordBookPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            terms: [],
            subjects: [],
            examGrades: []
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_STUDENT":
                    this.getTerms(localStorage.getItem("groupId"));
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    recordBookBar() {
        if (this.state.part > 0) {
            this.setState((state) => ({
                    part: state.part - 1
                }
            ));
        }
    }

    getTerms(groupId) {
        axios.get(constants.DEFAULT_URL + "/terms/groups/" + groupId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                terms: response.data
            });
        }).catch((error) => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getSubjects(termsId) {
        axios.get(constants.DEFAULT_URL + "/subjects/terms/" + termsId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                subjects: response.data
            });
        }).catch((error) => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getGrades(subjectId, studentId) {
        axios.get(constants.DEFAULT_URL + "/grades/exam/subjects/" + subjectId + "/students/" + studentId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                examGrades: response.data
            });
        }).catch((error) => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    async view(termId) {
        const studentId = localStorage.getItem("id");
        this.setState({
            TId: termId
        });
        this.getSubjects(termId);
        await this.timeout(150);
        this.state.subjects.forEach(s => {
            this.getGrades(s.id, studentId)
        });
        await this.timeout(150);
        this.setState({
            part: 1
        });
    }

    getMark(subjectId) {
        const grade = this.state.examGrades.find(g => g.id === subjectId);
        if (grade === undefined) {
            return 0;
        } else {
            return grade.value;
        }
    }

    timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    render() {
        return (
            <div className="main">
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a onClick={() => goStudentProfilePage(this.props)}>Профиль</a>
                    <a className="active" onClick={() => this.recordBookBar()}>Зачётка</a>
                    <a onClick={() => goStudentGroupPage(this.props)}>Группа</a>
                    <a onClick={() => goStudentSubjectsPage(this.props)}>Предметы</a>
                </div>
                {this.state.part === 0 && (
                    <div className="main_data">
                        <div className="data_panel">
                            {this.state.terms.map(term => {
                                const {id, number} = term
                                return (
                                    <div>
                                        <button
                                            className="btn_data"
                                            value={id}
                                            onClick={event => this.view(event.target.value)}
                                        >
                                            {number}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                {this.state.part === 1 && (
                    <div className="table_panel">
                        <div>
                            <h1 id='title'>Оценки, {this.state.TId} семестр</h1>
                            <table id='data'>
                                <tbody>
                                <tr>
                                    <th>№</th>
                                    <th>Предмет</th>
                                    <th>Тип сдачи</th>
                                    <th>Фамилия преподавателя</th>
                                    <th>Имя преподавателя</th>
                                    <th>Отчество преподавателя</th>
                                    <th>Оценка</th>
                                </tr>
                                {this.state.subjects.map((subject, index) => {
                                    const {id, name, examinationTeacher, examinationType} = subject;
                                    const mark = this.getMark(id);
                                    return (
                                        <tr key={id}>
                                            <td>{index + 1}</td>
                                            <td>{name}</td>
                                            <td>{examinationType.name}</td>
                                            <td>{examinationTeacher.surname}</td>
                                            <td>{examinationTeacher.name}</td>
                                            <td>{examinationTeacher.patronymic}</td>
                                            <td>{mark}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default StudentRecordBookPage;