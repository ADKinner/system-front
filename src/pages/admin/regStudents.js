import React from "react";
import '../../styles/main.css';
import {
    goAdminGroupsPage,
    goAdminProfilePage, goAdminRegisterStudentsPage,
    goAdminsPage, goAdminStudentsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
    goLoginPage,
    goServerErrorPage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";
import validateCreateRegStudentInput from "../../validate/validateCreateRegStudentInput";

class AdminRegisterStudentsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            details: [],
            groups: [],
            detail: {},
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
                    this.getRegStudentDetails();
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    defaultDetail() {
        this.setState({
            detail: {
                ...this.state.detail,
                id: '',
                name: '',
                surname: '',
                patronymic: '',
                email: '',
                password: ''
            }
        });
    }

    getRegStudentDetails() {
        axios.get(constants.DEFAULT_URL + "/registration-details/", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    details: response.data
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

    createRegStudentDetails() {
        axios.post(constants.DEFAULT_URL + "/registration-details", {
            id: this.state.detail.id,
            name: this.state.detail.name,
            surname: this.state.detail.surname,
            patronymic: this.state.detail.patronymic,
            email: this.state.detail.email,
            password: this.state.detail.password,
            groupId: this.state.detail.GId,
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            } else if (error.response.status === 400) {
                this.setState({
                    errors: {
                        id: "ID занят"
                    }
                });
            }
        });
    }

    deleteRegStudentDetails() {
        axios.delete(constants.DEFAULT_URL + "/registration-details/" + this.state.SRDId, {
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

    getGroups() {
        axios.get(constants.DEFAULT_URL + constants.GROUPS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                detail: {
                    ...this.state.detail,
                    GId: response.data[0]["id"]
                },
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

    regStudentsBar() {
        if (this.state.part > 0) {
            this.setState({
                part: this.state.part - 1
            });
        }
    }

    async modalDelete() {
        this.deleteRegStudentDetails()
        await this.timeout(500);
        this.getRegStudentDetails();
        this.setState({
            part: 0
        });
    }

    modalClose() {
        this.setState({
            part: 0
        });
    }

    timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    change(event) {
        this.setState({
            detail: {
                ...this.state.detail,
                [event.target.name]: event.target.value
            }
        });
    }

    delete(event) {
        this.setState({
            SRDId: event.target.value,
            part: 2
        });
    }

    async add() {
        this.getGroups();
        this.defaultDetail();
        await this.timeout(500);
        this.setState({
            part: 1
        });
    }

    async create() {
        const errors = validateCreateRegStudentInput(this.state.detail.id, this.state.detail.name,
            this.state.detail.surname, this.state.detail.patronymic, this.state.detail.email,
            this.state.detail.password);
        if (Object.keys(errors).length !== 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.setState({
                errors: {}
            });
            this.createRegStudentDetails();
            await this.timeout(500);
            this.getRegStudentDetails();
            await this.timeout(500);
            if (Object.keys(this.state.errors).length === 0) {
                this.setState({
                    part: 0
                });
            }
        }
    }

    changeVisibility() {
        this.setState((state) => ({
            isPasswordVisibility: !state.isPasswordVisibility
        }));
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
                    <a className="active" onClick={() => this.regStudentsBar()}>Регистрация студентов</a>
                    <a onClick={() => goAdminStudentsPage(this.props)}>Студенты</a>
                    <a onClick={() => goAdminSubjectsPage(this.props)}>Предметы</a>
                </div>
                {this.state.part === 0 && (
                    <div>
                        <h1 id='title'>Данные студентов для регистрации</h1>
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
                            </tr>
                            {this.state.details.map(detail => {
                                const {id, name, surname, patronymic, email, groupId} = detail;
                                return (
                                    <tr key={id}>
                                        <td>{id}</td>
                                        <td>{name}</td>
                                        <td>{surname}</td>
                                        <td>{patronymic}</td>
                                        <td>{email}</td>
                                        <td>{groupId}</td>
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
                        <button className="btn_add_medium" onClick={() => this.add()}>
                            Добавить данные студента
                        </button>
                    </div>
                )}
                {this.state.part === 1 && (
                    <div className="panel_add big_2">
                        <div className="begin_add">
                            Добавление данных студента
                        </div>
                        <div className="part_add">
                            <div className="description_add">
                                ID
                            </div>
                            <input
                                name="id"
                                className="in_data_add"
                                type="text"
                                placeholder="Введите ID студента"
                                value={this.state.detail.id}
                                onChange={event => this.change(event)}
                            />
                        </div>
                        {this.state.errors.id && (
                            <div className="error_panel_add">
                                {this.state.errors.id}
                            </div>
                        )}
                        <div className="part_add">
                            <div className="description_add">
                                Фамилия
                            </div>
                            <input
                                name="surname"
                                type="text"
                                className="in_data_add"
                                placeholder="Введите фамилию студента"
                                value={this.state.detail.surname}
                                onChange={event => this.change(event)}
                            />
                        </div>
                        {this.state.errors.surname && (
                            <div className="error_panel_add">
                                {this.state.errors.surname}
                            </div>
                        )}
                        <div className="part_add">
                            <div className="description_add">
                                Имя
                            </div>
                            <input
                                name="name"
                                type="text"
                                className="in_data_add"
                                placeholder="Введите имя студента"
                                value={this.state.detail.name}
                                onChange={event => this.change(event)}
                            />
                        </div>
                        {this.state.errors.name && (
                            <div className="error_panel_add">
                                {this.state.errors.name}
                            </div>
                        )}
                        <div className="part_add">
                            <div className="description_add">
                                Отчество
                            </div>
                            <input
                                name="patronymic"
                                type="text"
                                className="in_data_add"
                                placeholder="Введите отчество студента"
                                value={this.state.detail.patronymic}
                                onChange={event => this.change(event)}
                            />
                        </div>
                        {this.state.errors.patronymic && (
                            <div className="error_panel_add">
                                {this.state.errors.patronymic}
                            </div>
                        )}
                        <div className="part_add">
                            <div className="description_add">
                                Email
                            </div>
                            <input
                                name="email"
                                type="email"
                                className="in_data_add"
                                placeholder="Введите почту студента"
                                value={this.state.detail.email}
                                onChange={event => this.change(event)}
                            />
                        </div>
                        {this.state.errors.email && (
                            <div className="error_panel_add">
                                {this.state.errors.email}
                            </div>
                        )}
                        <div className="part_add">
                            <div className="description_add">
                                Группа
                            </div>
                            <select
                                name="GId"
                                className="select_data"
                                value={this.state.detail.GId}
                                onChange={event => this.change(event)}
                            >
                                {this.state.groups.map(group => {
                                    const {id} = group;
                                    return (
                                        <option value={id}>{id}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="part_add">
                            <div className="description_add">
                                Пароль
                            </div>
                            <input
                                name="password"
                                className="in_data_add"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Введите пароль"
                                title="не менее 8 знаков"
                                value={this.state.detail.password}
                                onChange={event => this.change(event)}
                            />
                        </div>
                        <input type="checkbox"
                               id="check"
                               className="check_recovery"
                               onChange={() => this.changeVisibility()}
                        />
                        <label htmlFor="check">Посмотреть пароль</label>
                        {this.state.errors.password && (
                            <div className="error_panel_add">
                                {this.state.errors.password}
                            </div>
                        )}
                        <button className="btn_add" onClick={() => this.create()}>Подтвердить</button>
                    </div>
                )}
                {this.state.part === 2 && (
                    <React.Fragment>
                        {
                            <div className="modal_rm">
                                <div className="modal_body_rm">
                                    <h1>УДАЛЕНИЕ</h1>
                                    <h3>Вы действительно хотите удалить данные студента для регистрации?</h3>
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

export default AdminRegisterStudentsPage;

