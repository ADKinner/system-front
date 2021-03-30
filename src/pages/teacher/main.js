import React from "react";
import '../../styles/teacher.css';
import {
    goLoginPage,
    goServerErrorPage,
    goTeacherExamPage,
    goTeacherLessonPage,
    goTeacherProfilePage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";

class MainTeacherPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            subjects: [],
            subjectInfos: [],
            groups: [],
            grades: [],
            skips: [],
            students: [],
            subjectInfo: {},
            skip: {},
            examGrade: {}
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_TEACHER":
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getSubjects() {
        axios.get(constants.DEFAULT_URL + "/subjects?teacherId=" + localStorage.getItem("id"), {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    subjects: response.data
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getSubjectInfos() {
        axios.get(constants.DEFAULT_URL + "/subjects/infos?teacherId=" + localStorage.getItem("id"), {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    subjectInfos: response.data
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getGroups(id) {
        axios.get(constants.DEFAULT_URL + "/groups?termId=" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    groups: response.data
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getStudents(id) {
        axios.get(constants.DEFAULT_URL + "/students?groupId=" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    students: response.data
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getGroupInfos(id) {
        axios.get(constants.DEFAULT_URL + "/groups/infos?subjectInfoId=" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    groupInfos: response.data,
                    avGroupsPastLessons: this.averagePastLessonsCount(response.data)
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getSubjectInfo(id) {
        axios.get(constants.DEFAULT_URL + "/subjects/infos/" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    subjectInfo: response.data
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getAllGrades(id) {
        axios.get(constants.DEFAULT_URL + "/grades?subjectInfoId=" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    grades: response.data,
                    avGrade: this.averageGrades(response.data)
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getAllSkips(id) {
        axios.get(constants.DEFAULT_URL + "/skips?subjectInfoId=" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    skips: response.data,
                    avSkips: this.averageSkips(response.data)
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getGroupInfo(id) {
        axios.get(constants.DEFAULT_URL + "/groups/" + id + "/infos/?subjectInfoId=" + this.state.SIId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    groupInfo: response.data
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getGroupGrades(id) {
        axios.get(constants.DEFAULT_URL + "/grades?subjectInfoId=" + this.state.SIId + "&groupId=" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    grades: response.data,
                    avGrade: this.averageGrades(response.data)
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getGroupSkips(id) {
        axios.get(constants.DEFAULT_URL + "/skips?subjectInfoId=" + this.state.SIId + "&groupId=" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    skips: response.data,
                    avSkips: this.averageSkips(response.data)
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getStudentGrades(id) {
        axios.get(constants.DEFAULT_URL + "/grades?subjectInfoId=" + this.state.SIId + "&studentId=" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    grades: response.data,
                    avGrade: this.averageGrades(response.data)
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getStudentExamGrade(id) {
        axios.get(constants.DEFAULT_URL + "/grades?subjectId=" + this.state.SId + "&studentId=" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    examGrade: response.data
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    getStudentSkip(id) {
        axios.get(constants.DEFAULT_URL + "/skips?subjectInfoId=" + this.state.SIId + "&studentId=" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    skip: response.data[0]
                });
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    async subjects() {
        this.getSubjectInfos();
        await this.timeout(300);
        this.setState({
            part: 2
        });
    }

    async examSubjects() {
        this.getSubjects();
        await this.timeout(300);
        this.setState({
            part: 1
        });
    }

    async allData(id) {
        this.getGroupInfos(id);
        this.getSubjectInfo(id);
        this.getAllGrades(id);
        this.getAllSkips(id);
        await this.timeout(300);
        this.setState({
            part: 5
        });
    }

    async groupData(id) {
        this.getGroupInfo(id);
        this.getSubjectInfo(this.state.SIId);
        this.getGroupGrades(id);
        this.getGroupSkips(id);
        await this.timeout(300);
        this.setState({
            part: 6
        });
    }

    async studentData(id) {
        this.getGroupInfo(this.state.GId);
        this.getSubjectInfo(this.state.SIId);
        this.getStudentGrades(id);
        this.getStudentExamGrade(id);
        this.getStudentSkip(id);
        await this.timeout(300);
        this.setState({
            part: 7
        });
    }

    async groups(data) {
        this.getGroups(data[2]);
        await this.timeout(300);
        this.setState({
            part: 3,
            SIId: data[0],
            SId: data[4]
        });
    }

    async students(id) {
        this.getStudents(id);
        await this.timeout(300);
        this.setState({
            part: 4,
            GId: id
        });
    }

    mainBar() {
        if (this.state.part > 0 && this.state.part < 3) {
            this.setState({
                part: 0
            });
        } else if (this.state.part === 3 || this.state.part === 4) {
            this.setState({
                part: this.state.part - 1
            });
        } else if (this.state.part > 4) {
            this.setState({
                part: this.state.part - 3
            });
        }
    }

    timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    averageGrades(grades) {
        if (grades.length === 0) {
            return 0;
        } else {
            return (grades.reduce((total, next) => total + next.value, 0) / grades.length).toFixed(1);
        }
    }

    averageSkips(skips) {
        if (skips.length === 0) {
            return 0;
        } else {
            return (skips.reduce((total, next) => total + next.count, 0) / skips.length).toFixed(1);
        }
    }

    averagePastLessonsCount(groupInfos) {
        if (groupInfos.length === 0) {
            return 0;
        } else {
            return (groupInfos.reduce((total, next) => total + next.pastLessonsCount, 0) / groupInfos.length).toFixed(1);
        }
    }

    render() {
        return (
            <div className="main">
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a onClick={() => goTeacherProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goTeacherExamPage(this.props)}>Зачёт/экзамен</a>
                    <a onClick={() => goTeacherLessonPage(this.props)}>Занятие</a>
                    <a onClick={() => this.mainBar()} className="active">Главная</a>
                </div>
                {this.state.part === 0 && (
                    <div className="panel_add big_3">
                        <div className="begin_add">
                            Выбор предмета/экзаменационного предмета
                        </div>
                        <button
                            className="btn_add"
                            onClick={() => this.subjects()}
                        >
                            Предметы
                        </button>
                        <button
                            className="btn_add"
                            onClick={() => this.examSubjects()}
                        >
                            Экзаменационные предметы
                        </button>
                    </div>
                )}
                {this.state.part === 1 && (
                    <div className="table_panel">
                        {this.state.subjects.length === 0 && (
                            <div>
                                <h2 className="h2_margin">Экзаменационных предметов нет</h2>
                            </div>
                        )}
                        {this.state.subjects.length !== 0 && (
                            <div>
                                <h1 id='title'>Экзаменационные предметы</h1>
                                <table id='data'>
                                    <tbody>
                                    <tr>
                                        <th>№</th>
                                        <th>Предмет</th>
                                        <th>Семестр</th>
                                        <th>Специальность</th>
                                        <th>Тип сдачи</th>
                                    </tr>
                                    {this.state.subjects.map((subject, index) => {
                                        const {name, term, examinationType} = subject;
                                        const TNumber = term.number;
                                        const SName = term.speciality.name;
                                        const EName = examinationType.name;
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{name}</td>
                                                <td>{TNumber}</td>
                                                <td>{SName}</td>
                                                <td>{EName}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                {this.state.part === 2 && (
                    <div className="table_panel">
                        {this.state.subjectInfos.length === 0 && (
                            <div>
                                <h2 className="h2_margin">Предметов нет</h2>
                            </div>
                        )}
                        {this.state.subjectInfos.length !== 0 && (
                            <div>
                                <h1 id='title'>Предметы</h1>
                                <table id='data'>
                                    <tbody>
                                    <tr>
                                        <th>№</th>
                                        <th>Предмет</th>
                                        <th>Тип занятия</th>
                                        <th>Количество занятий</th>
                                        <th/>
                                        <th/>
                                    </tr>
                                    {this.state.subjectInfos.map((subjectInfo, index) => {
                                        const {id, count, subject, subjectType} = subjectInfo;
                                        const SName = subject.name;
                                        const TName = subjectType.name;
                                        const termId = subject.term.id;
                                        const subjectId = subject.id;
                                        const data = [id, termId, subjectId];
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{SName}</td>
                                                <td>{TName}</td>
                                                <td>{count}</td>
                                                <td>
                                                    <button
                                                        className="btn_view"
                                                        value={id}
                                                        onClick={event => this.allData(event.target.value)}
                                                    >
                                                        Данные
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn_view"
                                                        value={data}
                                                        onClick={event => this.groups(event.target.value)}
                                                    >
                                                        Группы
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                {this.state.part === 3 && (
                    <div className="table_panel">
                        {this.state.groups.length === 0 && (
                            <div>
                                <h2 className="h2_margin">Групп на потоке нет</h2>
                            </div>
                        )}
                        {this.state.groups.length !== 0 && (
                            <div>
                                <h1 id='title'>Группы</h1>
                                <table id='small_data'>
                                    <tbody>
                                    <tr>
                                        <th>Группа</th>
                                        <th/>
                                        <th/>
                                    </tr>
                                    {this.state.groups.map(group => {
                                        const {id} = group;
                                        return (
                                            <tr>
                                                <td>{id}</td>
                                                <td>
                                                    <button
                                                        className="btn_view"
                                                        value={id}
                                                        onClick={event => this.groupData(event.target.value)}
                                                    >
                                                        Данные
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn_view"
                                                        value={id}
                                                        onClick={event => this.students(event.target.value)}
                                                    >
                                                        Студенты
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                {this.state.part === 4 && (
                    <div className="table_panel">
                        {this.state.students.length === 0 && (
                            <div>
                                <h2 className="h2_margin">Студентов нет</h2>
                            </div>
                        )}
                        {this.state.students.length !== 0 && (
                            <div>
                                <h1 id='title'>Студенты</h1>
                                <table id='data'>
                                    <tbody>
                                    <tr>
                                        <th>№</th>
                                        <th>Фамилия</th>
                                        <th>Имя</th>
                                        <th>Отчество</th>
                                        <th>Email</th>
                                        <th/>
                                    </tr>
                                    {this.state.students.map((student, index) => {
                                        const {id, name, surname, patronymic, email} = student;
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{surname}</td>
                                                <td>{name}</td>
                                                <td>{patronymic}</td>
                                                <td>{email}</td>
                                                <td>
                                                    <button
                                                        className="btn_view"
                                                        value={id}
                                                        onClick={event => this.studentData(event.target.value)}
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
                    </div>
                )}
                {this.state.part === 5 && (
                    <div className="data_panel_student subject_data">
                        <h1>Предмет: {this.state.subjectInfo.subject.name}</h1>
                        <h1>Тип занятия: {this.state.subjectInfo.subjectType.name}</h1>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Средний балл:</div>
                            <div className="subject_detail_value">
                                {this.state.avGrade}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Среднне количество пропусков:</div>
                            <div className="subject_detail_value">
                                {this.state.avSkips}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Среднее количество проведенных занятий:</div>
                            <div className="subject_detail_value">
                                {this.state.avGroupsPastLessons}
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
                {this.state.part === 6 && (
                    <div className="data_panel_student subject_data">
                        <h1>Предмет: {this.state.subjectInfo.subject.name}</h1>
                        <h1>Тип занятия: {this.state.subjectInfo.subjectType.name}</h1>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Средний балл:</div>
                            <div className="subject_detail_value">
                                {this.state.avGrade}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Среднне количество пропусков:</div>
                            <div className="subject_detail_value">
                                {this.state.avSkips}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Количество проведенных занятий:</div>
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
                        <div className="subject_detail">
                            <div className="subject_detail_name">Экзамен/зачёт:</div>
                            <div className="subject_detail_value">
                                {this.state.groupInfo.isExamination && (
                                    <div>
                                        Проведён
                                    </div>
                                )}
                                {!this.state.groupInfo.isExamination && (
                                    <div>
                                        Не проведён
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {this.state.part === 7 && (
                    <div className="data_panel_student subject_data">
                        <h1>Предмет: {this.state.subjectInfo.subject.name}</h1>
                        <h1>Тип занятия: {this.state.subjectInfo.subjectType.name}</h1>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Студент:</div>
                            <div className="subject_detail_value">
                                {this.state.skip.student.surname + " "}
                                {this.state.skip.student.name + " "}
                                {this.state.skip.student.patronymic}
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
                            <div className="subject_detail_name">Количество пропусков:</div>
                            <div className="subject_detail_value">
                                {this.state.skip.count}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Количество проведенных занятий:</div>
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
                        <div className="subject_detail">
                            <div className="subject_detail_name">Оценка за экзамен/зачёт:</div>
                            <div className="subject_detail_value">
                                {Object.keys(this.state.examGrade).length === 0 && (
                                    <div>
                                        Нет оценки
                                    </div>
                                )}
                                {Object.keys(this.state.examGrade).length === 0 && (
                                    <div>
                                        {this.state.examGrade.mark}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default MainTeacherPage;

