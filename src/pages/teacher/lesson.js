import React from "react";
import '../../styles/teacher.css';
import {goLoginPage, goTeacherExamPage, goTeacherMainPage, goTeacherProfilePage} from "../../redirect";
import axios from "axios";
import {
    AND_PARAM,
    DEFAULT_URL,
    GROUP_ID_PARAM,
    GROUP_INFOS_URL,
    LESSON_ULR,
    Q_PARAM,
    STUDENTS_URL,
    SUB_SUBJECT_ID_PARAM,
    SUB_SUBJECTS_URL,
    SUBJECT_ID_PARAM,
    TEACHER_ID_PARAM
} from "../../constants";
import handleDefaultError from "../../handle/handleDefaultReuqestError";
import handleTeacherMount from "../../handle/handleTeacherMount";
import timeout from "../../handle/timeout";

class TeacherLessonPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            subSubjects: [],
            groupInfos: [],
            students: [],
            SIId: '',
            GId: ''
        }
    }

    componentDidMount() {
        handleTeacherMount(localStorage);
        this.getSubSubjects();
    }

    getSubSubjects() {
        const teacherId = localStorage.getItem("id");
        axios.get(DEFAULT_URL + SUB_SUBJECTS_URL + Q_PARAM + TEACHER_ID_PARAM + teacherId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                subSubjects: response.data
            });
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
            this.setState({
                groupInfos: response.data
            });
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
            this.setState({
                students: response.data
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    saveLessonInfo() {
        const data = [];
        this.state.students.forEach((st) => {
            const info = {
                studentId: st["id"],
                mark: st["mark"] === null || st["mark"] === undefined ? 0 : st["mark"],
                isSkip: st["isSkip"] === null || st["isSkip"] === undefined ? false : st["isSkip"]
            };
            data.push(info);
        });
        axios.post(DEFAULT_URL + LESSON_ULR, {
            groupId: this.state.GId,
            subjectId: this.state.SIId,
            isExam: false,
            data: data
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    async groupInfos(id) {
        this.getGroupInfos(id);
        await timeout(300);
        this.setState({
            part: 1,
            SIId: id
        });
    }

    async students(id) {
        this.getStudents(id);
        this.setState({
            GId: id
        });
        await timeout(300);
        this.setState({
            part: 2
        });
    }

    async save() {
        this.saveLessonInfo();
        await timeout(300);
        this.setState({
            part: 1
        });
    }

    lessonBar() {
        if (this.state.part > 0) {
            this.setState({
                part: this.state.part - 1
            });
        }
    }

    changeSkip(event) {
        this.setState(state => ({
            students: state.students.map(
                (st, i) => i == event.target.id ? {
                    ...st,
                    isSkip: !!JSON.parse(String(event.target.value).toLowerCase())
                } : st
            )
        }));
    }

    changeMark(event) {
        this.setState(state => ({
            students: state.students.map(
                (st, i) => i == event.target.id ? {...st, mark: parseInt(event.target.value)} : st
            )
        }));
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
                    <a onClick={() => this.lessonBar()} className="active">Занятие</a>
                    <a onClick={() => goTeacherMainPage(this.props)}>Главная</a>
                </div>
                {this.state.part === 0 && (
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
                                        <th>Семестр</th>
                                        <th>Специальность</th>
                                        <th/>
                                    </tr>
                                    {this.state.subSubjects.map((subSubject, index) => {
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{subSubject.subjectName}</td>
                                                <td>{subSubject.subjectForm}</td>
                                                <td>{subSubject.termNumber}</td>
                                                <td>{subSubject.speciality}</td>
                                                <td>
                                                    <button
                                                        className="btn_view"
                                                        value={subSubject.id}
                                                        onClick={event => this.groupInfos(event.target.value)}
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
                {this.state.part === 1 && (
                    <div className="table_panel">
                        {this.state.groupInfos.length === 0 && (
                            <div>
                                <h2 className="h2_margin">Групп на потоке нет</h2>
                            </div>
                        )}
                        {this.state.groupInfos.length !== 0 && (
                            <div>
                                <h1 id='title'>Группы</h1>
                                <table id='medium_data'>
                                    <tbody>
                                    <tr>
                                        <th>Группа</th>
                                        <th>Количество проведённых занятий</th>
                                        <th>Количество запланированных занятий</th>
                                        <th/>
                                    </tr>
                                    {this.state.groupInfos.map(groupInfo => {
                                        const planLessonsCount = this.state.subSubjects.find(s => s.id == this.state.SIId).lessonsCount;
                                        return (
                                            <tr>
                                                <td>{groupInfo.group}</td>
                                                <td>{groupInfo.pastLessonsCount}</td>
                                                <td>{planLessonsCount}</td>
                                                <td>
                                                    <button
                                                        className="btn_view"
                                                        value={groupInfo.group}
                                                        onClick={(event => this.students(event.target.value))}
                                                    >
                                                        Провести занятие
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
                {this.state.part === 2 && (
                    <div className="table_panel">
                        <h1 id='title'>Занятие
                            - {this.state.groupInfos.find(g => g.group == this.state.GId).group}</h1>
                        <table id='data'>
                            <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Фамилия</th>
                                <th>Имя</th>
                                <th>Отчество</th>
                                <th>Отсутсвие</th>
                                <th>Оценка</th>
                            </tr>
                            {this.state.students.map((student, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{student.surname}</td>
                                        <td>{student.name}</td>
                                        <td>{student.patronymic}</td>
                                        <td>
                                            <select
                                                id={index}
                                                className="select_skip"
                                                onChange={event => this.changeSkip(event)}
                                            >
                                                <option value={false}>Нет</option>
                                                <option value={true}>Да</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                id={index}
                                                className="select_mark"
                                                onChange={event => this.changeMark(event)}
                                            >
                                                <option value={0}>Нет оценки</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                                <option value={5}>5</option>
                                                <option value={6}>6</option>
                                                <option value={7}>7</option>
                                                <option value={8}>8</option>
                                                <option value={9}>9</option>
                                                <option value={10}>10</option>
                                            </select>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        <button
                            className="btn_end_lesson"
                            onClick={() => this.save()}
                        >
                            Закончить занятие
                        </button>
                    </div>
                )}
            </div>
        )
    }
}

export default TeacherLessonPage;

