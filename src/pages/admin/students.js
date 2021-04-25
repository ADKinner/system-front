import React from "react";
import '../../styles/main.css';
import {
    goAdminGroupsPage,
    goAdminProfilePage,
    goAdminRegisterStudentsPage,
    goAdminsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
    goLoginPage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";
import {
    AND_PARAM,
    DEFAULT_URL,
    GROUP_URL,
    ID_PARAM,
    NAME_PARAM,
    PATRONYMIC_PARAM,
    Q_PARAM,
    S_PARAM,
    STUDENTS_URL,
    SURNAME_PARAM
} from "../../constants";
import handleDefaultError from "../../handle/handleDefaultReuqestError";
import handleAdminMount from "../../handle/handleAdminMount";
import timeout from "../../handle/timeout";

class AdminStudentsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            isFindById: true,
            isChangeGroup: false,
            SId: '',
            GId: '',
            search: {
                id: '',
                name: '',
                surname: '',
                patronymic: ''
            },
            students: [],
            groups: [],
            student: {},
            errors: {}
        }
    }

    componentDidMount() {
        handleAdminMount(localStorage);
    }

    getStudentsByNSP() {
        axios.get(DEFAULT_URL + STUDENTS_URL + Q_PARAM + NAME_PARAM + this.state.search.name + AND_PARAM
            + SURNAME_PARAM + this.state.search.surname + AND_PARAM
            + PATRONYMIC_PARAM + this.state.search.patronymic, {
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

    getStudentsById() {
        axios.get(DEFAULT_URL + STUDENTS_URL + Q_PARAM + ID_PARAM + this.state.search.id, {
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

    getStudent(id) {
        axios.get(DEFAULT_URL + STUDENTS_URL + S_PARAM + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    student: response.data,
                    GId: response.data.group
                });
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    deleteStudent() {
        axios.delete(DEFAULT_URL + STUDENTS_URL + S_PARAM + this.state.SId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    updateStudent() {
        axios.put(constants.DEFAULT_URL + STUDENTS_URL + GROUP_URL, {
            userId: this.state.SId,
            userGroup: this.state.GId
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                student: response.data,
                GId: response.data.group
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getGroups() {
        axios.get(constants.DEFAULT_URL + constants.GROUPS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                groups: response.data
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    studentsBar() {
        if (this.state.isChangeGroup) {
            this.setState({
                isChangeGroup: false
            });
        } else if (this.state.part > 0) {
            this.setState({
                part: this.state.part - 1
            });
        }
    }

    async modalDelete() {
        this.deleteStudent();
        await timeout(500);
        if (this.state.isFindById) {
            this.getStudentsById();
        } else {
            this.getStudentsByNSP();
        }
        await timeout(500);
        this.setState({
            part: 1
        });
    }

    modalClose() {
        this.setState({
            part: 1
        });
    }

    timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    change(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async openGroupChange() {
        this.getGroups();
        await timeout(300);
        this.setState({
            isChangeGroup: true
        });
    }

    closeGroupChange() {
        this.setState({
            isChangeGroup: false
        });
    }

    changeSearch(event) {
        this.setState({
            search: {
                ...this.state.search,
                [event.target.name]: event.target.value
            }
        });
    }

    async view(event) {
        this.getStudent(event.target.value);
        await timeout(500);
        this.setState({
            SId: event.target.value,
            part: 2
        });
    }

    async update() {
        await timeout(150);
        this.updateStudent();
        await timeout(150);
        this.getStudent(this.state.SId);
        await timeout(150);
        this.setState({
            isChangeGroup: false
        });
    }

    async findById() {
        this.getStudentsById();
        await timeout(300);
        this.setState({
            isFindById: true,
            part: 1
        });
    }

    async findByNSP() {
        this.getStudentsByNSP();
        await timeout(300);
        this.setState({
            isFindById: false,
            part: 1
        });
    }

    delete(event) {
        this.setState({
            SId: event.target.value,
            part: 3
        });
    }

    render() {
        return (
            <div className="main">
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a onClick={() => goAdminProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goAdminsPage(this.props)}>Администраторы</a>
                    <a onClick={() => goAdminTeachersPage(this.props)}>Учителя</a>
                    <a onClick={() => goAdminGroupsPage(this.props)}>Группы</a>
                    <a onClick={() => goAdminRegisterStudentsPage(this.props)}>Регистрация студентов</a>
                    <a className="active" onClick={() => this.studentsBar()}>Студенты</a>
                    <a onClick={() => goAdminSubjectsPage(this.props)}>Предметы</a>
                </div>
                {this.state.part === 0 && (
                    <div>
                        <div className="panel_add big_2">
                            <div className="begin_add">
                                Поиск студентов по ID
                            </div>
                            <div className="part_add">
                                <div className="description_add">
                                    ID
                                </div>
                                <input
                                    name="id"
                                    type="text"
                                    placeholder="Введите ID"
                                    className="in_data_add"
                                    value={this.state.search.id}
                                    onChange={event => this.changeSearch(event)}
                                />
                            </div>
                            <button
                                className="btn_add"
                                onClick={() => this.findById()}
                            >
                                Поиск
                            </button>
                        </div>
                        <div className="panel_add big">
                            <div className="begin_add">
                                Поиск студентов по ФИО
                            </div>
                            <div className="part_add">
                                <div className="description_add">
                                    Surname
                                </div>
                                <input
                                    name="surname"
                                    type="text"
                                    placeholder="Введите фамилию студента"
                                    className="in_data_add"
                                    value={this.state.search.surname}
                                    onChange={event => this.changeSearch(event)}
                                />
                            </div>
                            <div className="part_add">
                                <div className="description_add">
                                    Name
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Введите имя студента"
                                    className="in_data_add"
                                    value={this.state.search.name}
                                    onChange={event => this.changeSearch(event)}
                                />
                            </div>
                            <div className="part_add">
                                <div className="description_add">
                                    Patronymic
                                </div>
                                <input
                                    name="patronymic"
                                    type="text"
                                    placeholder="Введите отчество студента"
                                    className="in_data_add"
                                    value={this.state.search.patronymic}
                                    onChange={event => this.changeSearch(event)}
                                />
                            </div>
                            <button
                                className="btn_add"
                                onClick={() => this.findByNSP()}
                            >
                                Поиск
                            </button>
                        </div>
                    </div>
                )}
                {this.state.part === 1 && (
                    <div className="table_panel">
                        <div>
                            <h1 id='title'>Студенты</h1>
                            <table id='data'>
                                <tbody>
                                <tr>
                                    <th>ID</th>
                                    <th>Фамилия</th>
                                    <th>Имя</th>
                                    <th>Отчество</th>
                                    <th>Email</th>
                                    <th>Группа</th>
                                    <th/>
                                    <th/>
                                </tr>
                                {this.state.students.map(student => {
                                    return (
                                        <tr>
                                            <td>{student.id}</td>
                                            <td>{student.surname}</td>
                                            <td>{student.name}</td>
                                            <td>{student.patronymic}</td>
                                            <td>{student.email}</td>
                                            <td>{student.group}</td>
                                            <td>
                                                <button
                                                    className="btn_view"
                                                    value={student.id}
                                                    onClick={event => this.view(event)}
                                                >
                                                    Посмотреть
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn_delete"
                                                    value={student.id}
                                                    onClick={event => this.delete(event)}
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {this.state.part === 2 && (
                    <div className="data_panel_student">
                        <h1>Студент</h1>
                        <h1>{this.state.student.surname} {this.state.student.name} {this.state.student.patronymic}</h1>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Группа:</div>
                            <div className="subject_detail_value">
                                {this.state.student.group}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Форма обучения:</div>
                            <div className="subject_detail_value">
                                {this.state.student.educationForm}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Семестр:</div>
                            <div className="subject_detail_value">
                                {this.state.student.term}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Специальность:</div>
                            <div className="subject_detail_value">
                                {this.state.student.speciality}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Кафедра:</div>
                            <div className="subject_detail_value">
                                {this.state.student.cathedra}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Факультет:</div>
                            <div className="subject_detail_value">
                                {this.state.student.faculty}
                            </div>
                        </div>
                        {!this.state.isChangeGroup && (
                            <div className="subject_detail">
                                <button className="btn_change" onClick={() => this.openGroupChange()}>
                                    Изменить группу
                                </button>
                            </div>
                        )}
                        {this.state.isChangeGroup && (
                            <div className="subject_detail more_detail">
                                <div className="subject_detail_name">
                                    Группы
                                </div>
                                <div className="indent"/>
                                <select
                                    name="GId"
                                    className="select_data select_data_admin"
                                    value={this.state.GId}
                                    onChange={event => this.change(event)}
                                >
                                    {this.state.groups.map(group => {
                                        return (
                                            <option value={group.id}>{group.id}</option>
                                        )
                                    })}
                                </select>
                                <button className="btn_change" onClick={() => this.update()}>
                                    Обновить
                                </button>
                                <button className="btn_change" onClick={() => this.closeGroupChange()}>
                                    Закрыть
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {this.state.part === 3 && (
                    <React.Fragment>
                        {
                            <div className="modal_rm">
                                <div className="modal_body_rm">
                                    <h1>УДАЛЕНИЕ</h1>
                                    <h3>
                                        Вы действительно хотите удалить студента?
                                        Все его данные будут удалены.
                                    </h3>
                                    <button
                                        className="btn_rm"
                                        onClick={() => this.modalDelete()}
                                    >
                                        Удалить
                                    </button>
                                    <div/>
                                    <button
                                        className="btn_close"
                                        onClick={() => this.modalClose()}
                                    >
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        }
                    </React.Fragment>
                )}
            </div>
        )
    }
}

export default AdminStudentsPage;

