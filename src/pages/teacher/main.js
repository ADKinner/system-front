import React from "react";
import '../../styles/teacher.css';
import {
    goLoginPage,
    goServerErrorPage,
    goTeacherInfoPage,
    goTeacherLessonPage,
    goTeacherProfilePage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";

class MainTeacherPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFindGroup: true,
            isSubjects: false,
            isGroupInfo: false,
            isGroupStudents: false,
            isStudentInfo: false,
            isError: false,
            errorMessage: '',
            groupId: '',
            subjectId: '',
            subjects: [],
            students: [],
            groupInfo: {},
            studentInfo: {}
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
                if (response.data.length === 0) {
                    this.setState({
                        isError: true,
                        errorMessage: 'You not work with this group'
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
                        errorMessage: 'Group ID is incorrect'
                    });
                }
            });
    }

    getGroupInfo(subjectId) {
        console.log(constants.DEFAULT_URL + constants.SUBJECTS_URL + constants.SLASH + subjectId
            + constants.GROUPS_URL + constants.SLASH + this.state.groupId);
        axios.get(constants.DEFAULT_URL + constants.SUBJECTS_URL + constants.SLASH + subjectId
            + constants.GROUPS_URL + constants.SLASH + this.state.groupId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    groupInfo: response.data,
                    isGroupInfo: true,
                    isSubjects: false,
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

    getStudents() {
        axios.get(constants.DEFAULT_URL + constants.GROUPS_URL + constants.SLASH + this.state.groupId
            + constants.STUDENTS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    students: response.data,
                    isGroupInfo: false,
                    isGroupStudents: true
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

    getStudentInfo(studentId) {
        axios.get(constants.DEFAULT_URL + constants.SUBJECTS_URL + constants.SLASH + this.state.subjectId
            + constants.STUDENTS_URL + constants.SLASH + studentId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    studentInfo: response.data,
                    studentId: studentId,
                    isStudentInfo: true,
                    isGroupStudents: false,
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

    handleMainClick() {
        if (this.state.isSubjects) {
            this.setState({
                isFindGroup: true,
                isSubjects: false
            });
        } else if (this.state.isGroupInfo) {
            this.setState({
                isSubjects: true,
                isGroupInfo: false
            });
        } else if (this.state.isGroupStudents) {
            this.setState({
                isGroupInfo: true,
                isGroupStudents: false
            });
        } else if (this.state.isStudentInfo) {
            this.setState({
                isGroupStudents: true,
                isStudentInfo: false
            });
        }
    }

    handleSearchGroupButtonClick() {
        this.getSubjects();
    }

    handleSubjectButtonClick(event) {
        this.setState({
            subjectId: event.target.value
        });
        this.getGroupInfo(event.target.value);
    }

    handleViewGroupButtonClick() {
        this.getStudents();
    }

    handleViewStudentButtonClick(event) {
        this.getStudentInfo(event.target.value);
    }

    getStudentFullName() {
        const student = this.state.students.find(st => st.id == this.state.studentId);
        return student.surname + " " + student.name + " " + student.patronymic;
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
                    <a onClick={() => goTeacherLessonPage(this.props)}>Занятие</a>
                    <a onClick={() => this.handleMainClick()} className="active">Главная</a>
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
                        {this.state.subjects.map(subject => {
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
                {this.state.isGroupInfo && (
                    <div className="data_panel_teacher">
                        <h1>Учебная группа: {this.state.groupId}</h1>
                        <h2>Предмет: {this.state.groupInfo.subjectName}</h2>
                        <div className="detail">
                            <div className="detail_name">Средняя оценка:</div>
                            <div className="detail_value">
                                {this.state.groupInfo.averageGrade.toFixed(1)}
                            </div>
                        </div>
                        <div className="detail">
                            <div className="detail_name">Среднее количество пропусков:</div>
                            <div className="detail_value">
                                {this.state.groupInfo.averageSkipsCount.toFixed(1)}
                            </div>
                        </div>
                        <div className="detail">
                            <div className="detail_name">Проведено занятий:</div>
                            <div className="detail_value">{this.state.groupInfo.pastLessonsCount}</div>
                        </div>
                        <div className="detail">
                            <div className="detail_name">Всего занятий:</div>
                            <div className="detail_value">{this.state.groupInfo.planLessonsCount}</div>
                        </div>
                        <button onClick={() => this.handleViewGroupButtonClick()} className="btn_view_group">
                            Посмотреть студентов
                        </button>
                    </div>
                )}
                {this.state.isGroupStudents && (
                    <div className="table_panel">
                        <h1 id='title'>Учебная группа: {this.state.groupId}</h1>
                        <table id='students'>
                            <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Фамилия</th>
                                <th>Имя</th>
                                <th>Отчество</th>
                                <th>Email</th>
                                <th/>
                            </tr>
                            {this.state.students.map((student, index) => {
                                const {id, surname, name, patronymic, email} = student
                                return (
                                    <tr key={id}>
                                        <td>{index + 1}</td>
                                        <td>{surname}</td>
                                        <td>{name}</td>
                                        <td>{patronymic}</td>
                                        <td>{email}</td>
                                        <td>
                                            <button
                                                className="btn_view"
                                                value={id}
                                                onClick={event => this.handleViewStudentButtonClick(event)}
                                            >Посмотреть
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
                {this.state.isStudentInfo && (
                    <div className="data_panel_teacher">
                        <h1>
                            Student: {this.getStudentFullName()}
                        </h1>
                        <h2>Предмет: {this.state.groupInfo.subjectName}</h2>
                        <div className="detail">
                            <div className="detail_name">Оценки:</div>
                            <div className="detail_value">{this.state.studentInfo.grades.join(', ')}</div>
                        </div>
                        <div className="detail">
                            <div className="detail_name">Средний балл:</div>
                            <div className="detail_value">
                                {this.state.studentInfo.averageGrade.toFixed(1)}
                            </div>
                        </div>
                        <div className="detail">
                            <div className="detail_name">Количество пропусков:</div>
                            <div className="detail_value">{this.state.studentInfo.skipsCount}</div>
                        </div>
                        <div className="detail">
                            <div className="detail_name">Проведено занятий:</div>
                            <div className="detail_value">{this.state.studentInfo.pastLessonsCount}</div>
                        </div>
                        <div className="detail">
                            <div className="detail_name">Всего занятий:</div>
                            <div className="detail_value">{this.state.studentInfo.planLessonsCount}</div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default MainTeacherPage;

