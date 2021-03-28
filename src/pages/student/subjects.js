import React from "react";
import '../../styles/admin.css';
import {
    goLoginPage,
    goServerErrorPage,
    goStudentGroupPage,
    goStudentProfilePage,
    goStudentRecordBookPage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";

class StudentSubjectsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            subjects: [],
            grades: [],
            subjectTypes: [],
            subjectInfo: {},
            groupInfo: {},
            skip: {}
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_STUDENT":
                    console.log(localStorage.getItem("groupId"));
                    this.getSubjects(localStorage.getItem("groupId"));
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getSubjects(groupId) {
        axios.get(constants.DEFAULT_URL + constants.SUBJECTS_URL + "/groups/" + groupId, {
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

    getSubjectTypes(subjectId) {
        axios.get(constants.DEFAULT_URL + constants.SUBJECTS_URL + constants.SLASH + subjectId + "/types", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                subjectTypes: response.data
            });
        }).catch((error) => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getSubjectInfo(subjectId, typeId) {
        axios.get(constants.DEFAULT_URL + constants.SUBJECTS_URL + constants.SLASH + subjectId + "/types/"
            + typeId + "/info", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                subjectInfo: response.data
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
        axios.get(constants.DEFAULT_URL + "/grades/subjects/" + subjectId + "/students/" + studentId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                grades: response.data,
                avGrade: this.average(response.data)
            });
        }).catch((error) => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getSkip(subjectId, studentId) {
        axios.get(constants.DEFAULT_URL + "/skips/subjects/" + subjectId + "/students/" + studentId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                skip: response.data
            });
        }).catch((error) => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getGroupInfo(subjectId, groupId) {
        axios.get(constants.DEFAULT_URL + "/groups/" + groupId + "/info/subjects/" + subjectId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                groupInfo: response.data
            });
        }).catch((error) => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    average(grades) {
        if (grades.length === 0) {
            return 0;
        } else {
            return (grades.reduce((total, next) => total + next.value, 0) / grades.length).toFixed(1);
        }
    }

    timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    async view(subjectId) {
        this.setState({
            part: 1,
            SId: subjectId
        });
        this.getSubjectTypes(subjectId);
        await this.timeout(150);
    }

    async get(typeId) {
        const studentId = localStorage.getItem("id");
        const groupId = localStorage.getItem("groupId");
        this.getSubjectInfo(this.state.SId, typeId);
        await this.timeout(150);
        this.getGrades(this.state.subjectInfo.id, studentId);
        this.getSkip(this.state.subjectInfo.id, studentId);
        this.getGroupInfo(this.state.subjectInfo.id, groupId);
        await this.timeout(150);
        this.setState({
            part: 2,
            STId: typeId
        });
    }

    mainBar() {
        if (this.state.part > 0) {
            this.setState((state) => ({
                    part: state.part - 1
                }
            ));
        }
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
                    <a onClick={() => goStudentGroupPage(this.props)}>Группа</a>
                    <a className="active" onClick={() => this.mainBar()}>Предметы</a>
                </div>
                <div className="main_data">
                    {this.state.part === 0 && (
                        <div className="data_panel">
                            {
                                this.state.subjects.map(subject => {
                                    const {id, name} = subject
                                    return (
                                        <div>
                                            <button
                                                className="btn_data"
                                                value={id}
                                                onClick={event => this.view(event.target.value)}
                                            >
                                                {name}
                                            </button>
                                        </div>
                                    )
                                })}
                        </div>
                    )}
                    {this.state.part === 1 && (
                        <div className="data_panel small">
                            {this.state.subjectTypes.map(subject => {
                                const {id, name} = subject
                                return (
                                    <div>
                                        <button
                                            className="btn_data"
                                            value={id}
                                            onClick={event => this.get(event.target.value)}
                                        >
                                            {name}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    {this.state.part === 2 && (
                        <div className="data_panel_student">
                            <h1>Предмет: {this.state.subjectInfo.subject.name}</h1>
                            <h1>Тип занятия: {this.state.subjectInfo.subjectType.name}</h1>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Преподаватель:</div>
                                <div className="subject_detail_value">
                                    {this.state.subjectInfo.subjectTeacher.surname + " "}
                                    {this.state.subjectInfo.subjectTeacher.name + " "}
                                    {this.state.subjectInfo.subjectTeacher.patronymic}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Оценки:</div>
                                <div className="subject_detail_value">
                                    {this.state.grades.map(grade => {
                                        return grade.value + " ";
                                    })}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Средний балл:</div>
                                <div className="subject_detail_value">
                                    {this.state.avGrade}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Тип сдачи:</div>
                                <div
                                    className="subject_detail_value">
                                    {this.state.subjectInfo.subject.examinationType.name}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Количество пропусков:</div>
                                <div className="subject_detail_value">
                                    {this.state.skip.count}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Прошло занятий:</div>
                                <div className="subject_detail_value">
                                    {this.state.groupInfo.pastLessonsCount}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Всего занятий:</div>
                                <div className="subject_detail_value">
                                    {this.state.subjectInfo.count}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default StudentSubjectsPage;

