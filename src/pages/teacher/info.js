import React from "react";
import '../../styles/teacher.css';
import {
    goLoginPage,
    goServerErrorPage,
    goTeacherLessonPage,
    goTeacherMainPage,
    goTeacherProfilePage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";

class TeacherInfoPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            subjects: [],
            subject: {},
            isSubjectsInfo: false,
            isSubjectInfo: false
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_TEACHER":
                    this.getSubjectsInfo();
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getSubjectsInfo() {
        axios.get(constants.DEFAULT_URL + constants.SUBJECTS_URL + constants.TEACHERS_URL + constants.SLASH +
            localStorage.getItem("id"), {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    subjects: response.data,
                    isSubjectsInfo: true
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

    getSubjectInfo(subjectId) {
        axios.get(constants.DEFAULT_URL + constants.SUBJECTS_URL + constants.SLASH + subjectId
            + constants.GROUPS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    subject: response.data,
                    isSubjectsInfo: false,
                    isSubjectInfo: true
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

    handleInfoClick() {
        if (this.state.isSubjectInfo) {
            this.setState({
                isSubjectsInfo: true,
                isSubjectInfo: false
            });
        }
    }

    handleViewSubjectInfoButtonClick(event) {
        this.getSubjectInfo(event.target.value);
    }

    render() {
        return (
            <div className="main">
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a onClick={() => goTeacherProfilePage(this.props)}>Профиль</a>
                    <a className="active" onClick={() => this.handleInfoClick()}>Информация</a>
                    <a onClick={() => goTeacherLessonPage(this.props)}>Занятие</a>
                    <a onClick={() => goTeacherMainPage(this.props)}>Главная</a>
                </div>
                {this.state.isSubjectsInfo && (
                    <div className="table_panel">
                        <h1 id='title'>Предметы</h1>
                        <table id='students'>
                            <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Предмет</th>
                                <th>Тип</th>
                                <th>Семестр</th>
                                <th>Специальность</th>
                                <th>Группы</th>
                                <th/>
                            </tr>
                            {this.state.subjects.map((student, index) => {
                                const {id, subject, form, term, speciality, groups} = student
                                return (
                                    <tr key={id}>
                                        <td>{index + 1}</td>
                                        <td>{subject}</td>
                                        <td>{form}</td>
                                        <td>{term}</td>
                                        <td>{speciality}</td>
                                        <td>{groups.join(', ')}</td>
                                        <td>
                                            <button
                                                className="btn_view"
                                                value={id}
                                                onClick={event => this.handleViewSubjectInfoButtonClick(event)}
                                            >
                                                Посмотреть
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
                {this.state.isSubjectInfo && (
                    <div className="data_panel_teacher">
                        <h1>Subject: {this.state.subject.name + ' - ' + this.state.subject.form}</h1>
                        <div className="detail">
                            <div className="detail_name">Семестр:</div>
                            <div className="detail_value">{this.state.subject.term}</div>
                        </div>
                        <div className="detail">
                            <div className="detail_name">Специальность:</div>
                            <div className="detail_value">{this.state.subject.speciality}</div>
                        </div>
                        <div className="detail">
                            <div className="detail_name">Средний балл:</div>
                            <div className="detail_value">
                                {this.state.subject.averageGrade.toFixed(1)}
                            </div>
                        </div>
                        <div className="detail">
                            <div className="detail_name">Среднее количество пропусков:</div>
                            <div className="detail_value">
                                {this.state.subject.averageSkips.toFixed(1)}
                            </div>
                        </div>
                        <div className="detail">
                            <div className="detail_name">Среднее количество проведённых занятий:</div>
                            <div className="detail_value">
                                {this.state.subject.averagePastLessonsCount.toFixed(1)}
                            </div>
                        </div>
                        <div className="detail">
                            <div className="detail_name">Всего занятий:</div>
                            <div className="detail_value">{this.state.subject.planLessonsCount}</div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default TeacherInfoPage;

