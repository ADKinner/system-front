import React from "react";
import '../../styles/teacher.css';
import {goLoginPage, goTeacherExamPage, goTeacherLessonPage, goTeacherProfilePage} from "../../redirect";
import axios from "axios";
import {
    AND_PARAM,
    DEFAULT_URL,
    EXAM_GRADE_URL,
    GRADES_URL,
    GROUP_ID_PARAM,
    GROUP_INFOS_URL,
    GROUPS_URL,
    Q_PARAM,
    S_PARAM,
    SKIPS_URL,
    STUDENT_ID_PARAM,
    STUDENTS_URL,
    SUB_SUBJECT_ID_PARAM,
    SUB_SUBJECTS_URL,
    SUBJECT_ID_PARAM,
    SUBJECTS_URL,
    TEACHER_ID_PARAM,
    TERM_ID_PARAM
} from "../../constants";
import handleDefaultError from "../../handle/handleDefaultReuqestError";
import handleTeacherMount from "../../handle/handleTeacherMount";

class MainTeacherPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            subjects: [],
            subSubjects: [],
            groups: [],
            grades: [],
            skips: [],
            students: [],
            subSubject: {},
            skip: {},
            examGrade: {}
        }
    }

    componentDidMount() {
        handleTeacherMount(localStorage);
    }

    getSubjects() {
        const teacherId = localStorage.getItem("id");
        axios.get(DEFAULT_URL + SUBJECTS_URL + Q_PARAM + TEACHER_ID_PARAM + teacherId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                subjects: response.data
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getSubSubjects() {
        const teacherId = localStorage.getItem("id");
        axios.get(DEFAULT_URL + SUB_SUBJECTS_URL + Q_PARAM + TEACHER_ID_PARAM + teacherId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    subSubjects: response.data
                });
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getGroups(termId) {
        axios.get(DEFAULT_URL + GROUPS_URL + Q_PARAM + TERM_ID_PARAM + termId, {
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
            handleDefaultError(this.props, error.response.status);
        });
    }

    getStudents(groupId) {
        axios.get(DEFAULT_URL + STUDENTS_URL + Q_PARAM + GROUP_ID_PARAM + groupId + AND_PARAM + SUBJECT_ID_PARAM, {
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
            handleDefaultError(this.props, error.response.status);
        });
    }

    getGroupInfos(subSubjectId) {
        axios.get(DEFAULT_URL + GROUP_INFOS_URL + Q_PARAM + SUB_SUBJECT_ID_PARAM + subSubjectId, {
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
            handleDefaultError(this.props, error.response.status);
        });
    }

    getSubSubject(subSubjectId) {
        axios.get(DEFAULT_URL + SUB_SUBJECTS_URL + S_PARAM + subSubjectId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    subSubject: response.data
                });
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getAllGrades(subSubjectId) {
        axios.get(DEFAULT_URL + GRADES_URL + Q_PARAM + SUB_SUBJECT_ID_PARAM + subSubjectId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                grades: response.data,
                avGrade: this.averageGrades(response.data)
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getAllSkips(id) {
        axios.get(DEFAULT_URL + SKIPS_URL + Q_PARAM + SUB_SUBJECT_ID_PARAM + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                skips: response.data,
                avSkips: this.averageSkips(response.data)
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getGroupInfo(groupId) {
        axios.get(DEFAULT_URL + GROUP_INFOS_URL + Q_PARAM + GROUP_ID_PARAM + groupId + AND_PARAM
            + SUB_SUBJECT_ID_PARAM + this.state.SIId, {
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
            handleDefaultError(this.props, error.response.status);
        });
    }

    getGroupGrades(groupId) {
        axios.get(DEFAULT_URL + GRADES_URL + Q_PARAM + SUB_SUBJECT_ID_PARAM + this.state.SIId + AND_PARAM
            + GROUP_ID_PARAM + groupId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                grades: response.data,
                avGrade: this.averageGrades(response.data)
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getGroupSkips(groupId) {
        axios.get(DEFAULT_URL + SKIPS_URL + Q_PARAM + SUB_SUBJECT_ID_PARAM + this.state.SIId + AND_PARAM
            + GROUP_ID_PARAM + groupId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                skips: response.data,
                avSkips: this.averageSkips(response.data)
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getStudentGrades(studentId) {
        axios.get(DEFAULT_URL + GRADES_URL + Q_PARAM + SUB_SUBJECT_ID_PARAM + this.state.SIId + AND_PARAM
            + STUDENT_ID_PARAM + studentId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                grades: response.data,
                avGrade: this.averageGrades(response.data)
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getStudentExamGrade(studentId) {
        axios.get(DEFAULT_URL + EXAM_GRADE_URL + Q_PARAM + SUBJECT_ID_PARAM + this.state.SId + AND_PARAM
            + STUDENT_ID_PARAM + studentId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            console.log(response.data)
            this.setState({
                examGrade: response.data
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getStudentSkip(studentId) {
        axios.get(DEFAULT_URL + SKIPS_URL + Q_PARAM + SUB_SUBJECT_ID_PARAM + this.state.SIId + AND_PARAM
            + STUDENT_ID_PARAM + studentId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            console.log(response.data)
            this.setState({
                skip: response.data
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    async subjects() {
        this.getSubSubjects();
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
        this.getSubSubject(id);
        this.getAllGrades(id);
        this.getAllSkips(id);
        await this.timeout(300);
        this.setState({
            part: 5
        });
    }

    async groupData(id) {
        this.getGroupInfo(id);
        this.getSubSubject(this.state.SIId);
        this.getGroupGrades(id);
        this.getGroupSkips(id);
        await this.timeout(300);
        this.setState({
            part: 6
        });
    }

    async studentData(id) {
        this.getGroupInfo(this.state.GId);
        this.getSubSubject(this.state.SIId);
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
            return (grades.reduce((total, next) => total + next.mark, 0) / grades.length).toFixed(1);
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
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{subject.name}</td>
                                                <td>{subject.termId}</td>
                                                <td>{subject.speciality}</td>
                                                <td>{subject.offsetForm}</td>
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
                        {this.state.subSubjects.length === 0 && (
                            <div>
                                <h2 className="h2_margin">Предметов нет</h2>
                            </div>
                        )}
                        {this.state.subSubjects.length !== 0 && (
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
                                    {this.state.subSubjects.map((subSubject, index) => {
                                        const data = [subSubject.id, subSubject.termId, subSubject.subjectId];
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{subSubject.subjectName}</td>
                                                <td>{subSubject.subjectForm}</td>
                                                <td>{subSubject.lessonsCount}</td>
                                                <td>
                                                    <button
                                                        className="btn_view"
                                                        value={subSubject.id}
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
                        <h1>Предмет: {this.state.subSubject.subjectName}</h1>
                        <h1>Тип занятия: {this.state.subSubject.subjectForm}</h1>
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
                                {this.state.subSubject.lessonsCount}
                            </div>
                        </div>
                    </div>
                )}
                {this.state.part === 6 && (
                    <div className="data_panel_student subject_data">
                        <h1>Предмет: {this.state.subSubject.subjectName}</h1>
                        <h1>Тип занятия: {this.state.subSubject.subjectForm}</h1>
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
                                {this.state.subSubject.lessonsCount}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Экзамен/зачёт:</div>
                            <div className="subject_detail_value">
                                {this.state.groupInfo.offsetStatus && "Проведён"}
                                {!this.state.groupInfo.offsetStatus && "Не проведён"}
                            </div>
                        </div>
                    </div>
                )}
                {this.state.part === 7 && (
                    <div className="data_panel_student subject_data">
                        <h1>Предмет: {this.state.subSubject.subjectName}</h1>
                        <h1>Тип занятия: {this.state.subSubject.subjectForm}</h1>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Студент:</div>
                            <div className="subject_detail_value">
                                {this.state.skip.student}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Оценки:</div>
                            <div className="subject_detail_value">
                                {this.state.grades.map(grade => {
                                    return grade.mark + " ";
                                })}
                                {this.state.grades.length === 0 && "Оценок нет"}
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
                                {this.state.subSubject.lessonsCount}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Оценка за экзамен/зачёт:</div>
                            <div className="subject_detail_value">
                                {this.state.examGrade.mark === null && "Нет оценки"}
                                {this.state.examGrade.mark !== null && this.state.examGrade.mark}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default MainTeacherPage;

