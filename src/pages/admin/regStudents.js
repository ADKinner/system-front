import React from "react";
import '../../styles/main.css';
import {
    goAdminGroupsPage,
    goAdminProfilePage,
    goAdminsPage,
    goAdminStudentsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
    goLoginPage
} from "../../redirect";
import axios from "axios";
import {DEFAULT_URL, EXISTS_URL, GROUPS_URL, S_PARAM, STUDENTS_URL} from "../../constants";
import validateCreateRegStudentInput from "../../validate/validateCreateRegStudentInput";
import handleDefaultError from "../../handle/handleDefaultReuqestError";
import handleAdminMount from "../../handle/handleAdminMount";

class AdminRegisterStudentsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            findId: '',
            answer: '',
            groups: [],
            values: {},
            errors: {}
        }
    }

    componentDidMount() {
        handleAdminMount(localStorage);
    }

    defaultDetail() {
        this.setState({
            values: {
                ...this.state.values,
                id: '',
                name: '',
                surname: '',
                patronymic: '',
                email: '',
                password: ''
            }
        });
    }

    studentExists(id) {
        axios.get(DEFAULT_URL + STUDENTS_URL + S_PARAM + id + EXISTS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                isExists: response.data
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    createStudent() {
        axios.post(DEFAULT_URL + STUDENTS_URL, {
            id: this.state.values.id,
            name: this.state.values.name,
            surname: this.state.values.surname,
            patronymic: this.state.values.patronymic,
            email: this.state.values.email,
            password: this.state.values.password,
            group: this.state.values.GId,
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
            if (error.response.status === 400) {
                this.setState({
                    errors: {
                        id: "ID занят"
                    }
                });
            }
        });
    }

    getGroups() {
        axios.get(DEFAULT_URL + GROUPS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                values: {
                    ...this.state.values,
                    GId: response.data[0]["id"]
                },
                groups: response.data
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    regStudentsBar() {
        if (this.state.part > 0) {
            this.setState({
                part: this.state.part - 1,
                answer: ''
            });
        }
    }

    timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    change(event) {
        this.setState({
            values: {
                ...this.state.values,
                [event.target.name]: event.target.value
            }
        });
    }

    changeFindId(id) {
        this.setState({
            findId: id
        });
    }

    async search() {
        if (this.state.findId !== '') {
            this.studentExists(this.state.findId);
            await this.timeout(300);
            if (this.state.isExists) {
                this.setState({
                    answer: 'ID занят'
                });
            } else {
                this.setState({
                    answer: 'ID не занят'
                });
            }
        }
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
        const errors = validateCreateRegStudentInput(this.state.values.id, this.state.values.name,
            this.state.values.surname, this.state.values.patronymic, this.state.values.email,
            this.state.values.password);
        if (Object.keys(errors).length !== 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.setState({
                errors: {}
            });
            this.createStudent();
            await this.timeout(500);
            this.studentExists();
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
                    <div className="panel_add big_3">
                        <div className="begin_add">
                            Поиск аккаунта студента
                        </div>
                        <div className="part_add">
                            <div className="description_add">
                                ID
                            </div>
                            <input
                                name="id"
                                type="text"
                                placeholder="Введите ID студента"
                                className="in_data_add"
                                value={this.state.findId}
                                onChange={event => this.changeFindId(event.target.value)}
                            />
                        </div>
                        {this.state.answer.length !== 0 && (
                            <div className="search_info">
                                {this.state.answer}
                            </div>
                        )}
                        <button className="btn_add" onClick={() => this.search()}>
                            Проверить ID
                        </button>
                        <button className="btn_add" onClick={() => this.add()}>
                            Добавить студента
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
                                value={this.state.values.id}
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
                                value={this.state.values.surname}
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
                                value={this.state.values.name}
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
                                value={this.state.values.patronymic}
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
                                value={this.state.values.email}
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
                                value={this.state.values.GId}
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
                                value={this.state.values.password}
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
            </div>
        )
    }
}

export default AdminRegisterStudentsPage;

