import React from "react";
import '../../styles/teacher.css';
import {goLoginPage, goTeacherLessonPage, goTeacherMainPage, goTeacherProfilePage} from "../../redirect";
import axios from "axios";
import {
    AND_PARAM,
    DEFAULT_URL,
    GROUP_ID_PARAM,
    GROUPS_URL,
    LESSON_ULR,
    Q_PARAM,
    STUDENTS_URL,
    SUBJECT_ID_PARAM,
    SUBJECTS_URL,
    TEACHER_ID_PARAM,
    TERM_ID_PARAM
} from "../../constants";
import handleDefaultError from "../../handle/handleDefaultReuqestError";
import handleTeacherMount from "../../handle/handleTeacherMount";

class TeacherExamPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            subjects: [],
            groups: [],
            students: [],
            SId: '',
            GId: ''
        }
    }

    componentDidMount() {
        handleTeacherMount(localStorage);
        this.getSubjects();
    }

    getSubjects() {
        axios.get(DEFAULT_URL + SUBJECTS_URL + Q_PARAM + TEACHER_ID_PARAM + localStorage.getItem("id"), {
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
            handleDefaultError(this.props, error.response.status);
        });
    }

    getGroups(id) {
        axios.get(DEFAULT_URL + GROUPS_URL + Q_PARAM + TERM_ID_PARAM + id, {
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

    getStudents(id) {
        axios.get(DEFAULT_URL + STUDENTS_URL + Q_PARAM + GROUP_ID_PARAM + id + AND_PARAM +
            SUBJECT_ID_PARAM + this.state.SId, {
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

    saveExamInfo() {
        const data = [];
        this.state.students.forEach((st) => {
            const info = {
                id: st["id"],
                mark: st["mark"],
                isSkip: st["isSkip"]
            };
            data.push(info);
        });
        axios.post(DEFAULT_URL + LESSON_ULR, {
            groupId: this.state.GId,
            subjectId: this.state.SId,
            isExam: true,
            data: data
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    async groups(data) {
        this.getGroups(data[2]);
        this.setState({
            SId: data[0]
        });
        await this.timeout(300);
        this.setState({
            part: 1
        });
    }

    async students(id) {
        this.getStudents(id);
        this.setState({
            GId: id
        });
        await this.timeout(300);
        this.setState({
            part: 2
        });
    }

    async save() {
        this.saveExamInfo();
        await this.timeout(300);
        this.setState({
            part: 1
        });
    }

    examBar() {
        if (this.state.part > 0) {
            this.setState({
                part: this.state.part - 1
            });
        }
    }

    timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
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
                    <a className="active" onClick={() => this.examBar()}>Зачёт/экзамен</a>
                    <a onClick={() => goTeacherLessonPage(this.props)}>Занятие</a>
                    <a onClick={() => goTeacherMainPage(this.props)}>Главная</a>
                </div>
                {this.state.part === 0 && (
                    <div className="table_panel">
                        {this.state.subjects.length === 0 && (
                            <div>
                                <h2 className="h2_margin">Предметов нет</h2>
                            </div>
                        )}
                        {this.state.subjects.length !== 0 && (
                            <div>
                                <h1 id='title'>Предметы</h1>
                                <table id='data'>
                                    <tbody>
                                    <tr>
                                        <th>№</th>
                                        <th>Предмет</th>
                                        <th>Семестр</th>
                                        <th>Специальность</th>
                                        <th>Тип сдачи</th>
                                        <th/>
                                    </tr>
                                    {this.state.subjects.map((subject, index) => {
                                        const {id, name, termId, termNumber, offsetForm, speciality} = subject;
                                        const data = [id, termId]
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{name}</td>
                                                <td>{termNumber}</td>
                                                <td>{speciality}</td>
                                                <td>{offsetForm}</td>
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
                {this.state.part === 1 && (
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
                                                        onClick={(event => this.students(event.target.value))}
                                                    >
                                                        {this.state.subjects.find(s => s.id == this.state.SId).examinationType.name}
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
                        <h1 id='title'>
                            {this.state.subjects.find(s => s.id == this.state.SId).name} - {this.state.groups.find(g => g.id == this.state.GId).id}
                        </h1>
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
                                const {id, surname, name, patronymic} = student;
                                return (
                                    <tr key={id}>
                                        <td>{index + 1}</td>
                                        <td>{surname}</td>
                                        <td>{name}</td>
                                        <td>{patronymic}</td>
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

export default TeacherExamPage;

