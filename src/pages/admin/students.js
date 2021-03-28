import React from "react";
import '../../styles/admin.css';
import {
    goAdminGroupsPage,
    goAdminProfilePage,
    goAdminRegisterStudentsPage,
    goAdminsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
    goLoginPage,
    goServerErrorPage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";

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
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_ADMIN":
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getStudentsByNSP() {
        axios.get(constants.DEFAULT_URL + "/students?name=" + this.state.search.name + "&surname="
            + this.state.search.surname + "&patronymic=" + this.state.search.patronymic, {
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

    getStudentsById() {
        axios.get(constants.DEFAULT_URL + "/students?id=" + this.state.search.id, {
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

    getStudent(id) {
        axios.get(constants.DEFAULT_URL + "/students/" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    student: response.data,
                    GId: response.data.group.id
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

    deleteStudent() {
        axios.delete(constants.DEFAULT_URL + "/students/" + this.state.SId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    updateStudent() {
        axios.put(constants.DEFAULT_URL + "/students/group", {
            studentId: this.state.SId,
            groupId: this.state.GId
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                student: response.data,
                GId: response.data.group.id
            });
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
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
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
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
        await this.timeout(500);
        if (this.state.isFindById) {
            this.getStudentsById();
        } else {
            this.getStudentsByNSP();
        }
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
        await this.timeout(300);
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
        await this.timeout(500);
        this.setState({
            SId: event.target.value,
            part: 2
        });
    }

    async update() {
        await this.timeout(150);
        this.updateStudent();
        await this.timeout(150);
        this.getStudent(this.state.SId);
        await this.timeout(150);
        this.setState({
            isChangeGroup: false
        });
    }

    async findById() {
        this.getStudentsById();
        await this.timeout(300);
        this.setState({
            isFindById: true,
            part: 1
        });
    }

    async findByNSP() {
        this.getStudentsByNSP();
        await this.timeout(300);
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
                                    const {id, surname, name, patronymic, email, group} = student;
                                    return (
                                        <tr key={id}>
                                            <td>{id}</td>
                                            <td>{surname}</td>
                                            <td>{name}</td>
                                            <td>{patronymic}</td>
                                            <td>{email}</td>
                                            <td>{group.id}</td>
                                            <td>
                                                <button
                                                    className="btn_view"
                                                    value={id}
                                                    onClick={event => this.view(event)}
                                                >
                                                    Посмотреть
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn_delete"
                                                    value={id}
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
                    <div className="data_panel_student data_admin">
                        <h1>Студент</h1>
                        <h1>{this.state.student.surname} {this.state.student.name} {this.state.student.patronymic}</h1>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Группа:</div>
                            <div className="subject_detail_value">
                                {this.state.student.group.id}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Форма обучения:</div>
                            <div className="subject_detail_value">
                                {this.state.student.group.term.educationForm.name}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Семестр:</div>
                            <div className="subject_detail_value">
                                {this.state.student.group.term.number}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Специальность:</div>
                            <div className="subject_detail_value">
                                {this.state.student.group.term.speciality.name}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Кафедра:</div>
                            <div className="subject_detail_value">
                                {this.state.student.group.term.speciality.cathedra.name}
                            </div>
                        </div>
                        <div className="subject_detail">
                            <div className="subject_detail_name">Факультет:</div>
                            <div className="subject_detail_value">
                                {this.state.student.group.term.speciality.cathedra.faculty.name}
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
                                        const {id} = group;
                                        return (
                                            <option value={id}>{id}</option>
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

