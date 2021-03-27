import React from "react";
import '../../styles/teacher.css';
import {
    goLoginPage,
    goServerErrorPage,
    goTeacherInfoPage,
    goTeacherMainPage,
    goTeacherProfilePage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";

class TeacherLessonPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFindGroup: true,
            isSubjects: false,
            isLesson: false,
            isError: false,
            groupId: '',
            subjectId: '',
            subjects: [],
            students: []
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
        axios.get(constants.DEFAULT_URL + constants.SUBJECTS_URL + constants.TEACHERS_URL + constants.SLASH
            + localStorage.getItem("id") + constants.GROUPS_URL + constants.SLASH + this.state.groupId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                if (response.data.length == 0) {
                    this.setState({
                        isError: true,
                        errorMessage: 'Эта группа не доступна'
                    });
                } else {
                    this.setState({
                        isSubjects: true,
                        isFindGroup: false,
                        isError: false,
                        subjects: response.data
                    });
                }
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
                } else if (error.response.status === 404 || error.response.status === 400) {
                    this.setState({
                        isError: true,
                        errorMessage: 'ID учебной группы не верен'
                    });
                }
            });
    }

    getLessonInfo() {
        axios.get(constants.DEFAULT_URL + constants.LESSON_ULR + constants.GROUPS_URL + constants.SLASH
            + this.state.groupId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                if (response.data.length == 0) {
                    this.setState({
                        isSubjects: false,
                        isFindGroup: true,
                        isError: true,
                        errorMessage: 'Группа пуста'
                    });
                } else {
                    this.setState({
                        students: response.data,
                        isSubjects: false,
                        isLesson: true
                    });
                }
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
                }
            });
    }

    saveLessonInfo() {
        const data = [];
        this.state.students.forEach((st) => {
            const info = {
                id: st["id"],
                mark: st["mark"],
                isSkip: st["isSkip"]
            };
            data.push(info);
        });
        axios.post(constants.DEFAULT_URL + constants.LESSON_ULR, {
            groupId: this.state.groupId,
            subjectId: this.state.subjectId,
            data: data
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(() => {
                this.setState({
                    isSubjects: true,
                    isLesson: false
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

    handleGroupInputChange(event) {
        this.setState({
            groupId: event.target.value,
        });
    }

    handleSearchGroupButtonClick() {
        if (this.state.groupId != '') {
            this.getSubjects();
        }
    }

    handleSubjectButtonClick(event) {
        this.getLessonInfo();
        this.setState({
            subjectId: event.target.value
        });
    }

    handleLessonButtonClick() {
        if (this.state.isSubjects) {
            this.setState({
                isFindGroup: true,
                isSubjects: false
            });
        } else if (this.state.isLesson) {
            this.setState({
                isSubjects: true,
                isLesson: false
            });
        }
    }

    handleSubmitLessonForm(event) {
        event.preventDefault();
        this.saveLessonInfo();
    }

    handleSelectSkip(event) {
        this.setState(state => ({
            students: state.students.map(
                (st, i) => i == event.target.id ? {
                    ...st,
                    isSkip: !!JSON.parse(String(event.target.value).toLowerCase())
                } : st
            )
        }));
    }

    handleGradeValue(event) {
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
                    <a onClick={() => goTeacherInfoPage(this.props)}>Информация</a>
                    <a onClick={() => this.handleLessonButtonClick()} className="active">Занятие</a>
                    <a onClick={() => goTeacherMainPage(this.props)}>Главная</a>
                </div>
                {this.state.isFindGroup && (
                    <div className="find_group_panel">
                        <div className="head">
                            Поиск группы
                        </div>
                        <div className="find_panel">
                            <div className="panel_part">
                                <div className="input_description">
                                    ID учебной группы
                                </div>
                                <input
                                    name="groupId"
                                    type="text"
                                    placeholder="Введите ID учебной группы"
                                    className="input_group"
                                    value={this.state.groupId}
                                    onChange={event => this.handleGroupInputChange(event)}
                                />
                            </div>
                            {this.state.isError && (
                                <div className="error_panel_part">
                                    {this.state.errorMessage}
                                </div>
                            )}
                            <button onClick={() => this.handleSearchGroupButtonClick()} className="btn">
                                Поиск
                            </button>
                        </div>
                    </div>
                )}
                {this.state.isSubjects && (
                    <div className="subjects_button_panel">
                        {this.state.subjects.map((subject) => {
                            const {id, name, form} = subject
                            return (
                                <div>
                                    <button
                                        className="btn_data"
                                        value={id}
                                        onClick={event => this.handleSubjectButtonClick(event)}
                                    >
                                        {name + ' - ' + form}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
                {this.state.isLesson && (
                    <div className="table_panel">
                        <h1 id='title'>Занятие</h1>
                        <form onSubmit={(event => this.handleSubmitLessonForm(event))}>
                            <table id='students'>
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
                                                    onChange={event => this.handleSelectSkip(event)}
                                                >
                                                    <option value={false}>Нет</option>
                                                    <option value={true}>Да</option>
                                                </select>
                                            </td>
                                            <td>

                                                <select
                                                    id={index}
                                                    className="select_mark"
                                                    onChange={event => this.handleGradeValue(event)}
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
                            <button className="btn_end_lesson">Закончить занятие</button>
                        </form>
                    </div>
                )}
            </div>
        )
    }
}

export default TeacherLessonPage;

