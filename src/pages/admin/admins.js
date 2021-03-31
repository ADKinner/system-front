import React from "react";
import '../../styles/main.css';
import {
    goAdminGroupsPage,
    goAdminProfilePage,
    goAdminRegisterStudentsPage,
    goAdminStudentsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
    goLoginPage
} from "../../redirect";
import axios from "axios";
import {ADMINS_URL, DEFAULT_URL, POSTS_URL, S_PARAM} from "../../constants";
import validateCreateAdminInput from "../../validate/validateCreateAdminInput";
import handleDefaultError from "../../handle/handleDefaultReuqestError";
import handleAdminMount from "../../handle/handleAdminMount";

class AdminsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            admins: [],
            posts: [],
            errors: {},
            values: {},
            defPID: 0,
            isPasswordVisibility: false,
            isDeleteAdminModal: false,
            isCreateAdmin: false
        }
    }

    componentDidMount() {
        handleAdminMount(localStorage);
        this.getAdmins();
    }

    getAdmins() {
        axios.get(DEFAULT_URL + ADMINS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                admins: response.data
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getPosts() {
        axios.get(DEFAULT_URL + POSTS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                values: {
                    ...this.state.values,
                    PId: response.data[0]["id"]
                },
                posts: response.data
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    deleteAdmin() {
        axios.delete(DEFAULT_URL + ADMINS_URL + S_PARAM + this.state.values.AId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    createAdmin() {
        axios.post(DEFAULT_URL + ADMINS_URL, {
            id: this.state.values.ANId,
            name: this.state.values.AName,
            surname: this.state.values.ASurname,
            patronymic: this.state.values.APatronymic,
            password: this.state.values.APassword,
            email: this.state.values.AEmail,
            postId: this.state.values.PId
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

    timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    adminsBar() {
        if (this.state.part > 0) {
            this.setState((state) => ({
                part: state.part - 1
            }));
        }
    }

    delete(event) {
        this.setState({
            values: {
                ...this.state.values,
                AId: event.target.value
            },
            part: 2
        });
    }

    modalClose() {
        this.setState({
            part: 0
        });
    }

    async modalDelete() {
        this.deleteAdmin();
        await this.timeout(1000);
        this.getAdmins();
        this.setState({
            part: 0
        });
    }

    defaultCreateValues() {
        this.setState({
            values: {
                ...this.state.values,
                ANId: '',
                APassword: '',
                ACPassword: '',
                AName: '',
                ASurname: '',
                APatronymic: '',
                AEmail: ''
            }
        });
    }

    add() {
        this.getPosts();
        this.defaultCreateValues();
        this.setState({
            part: 1
        });
    }

    change(event) {
        this.setState({
            values: {
                ...this.state.values,
                [event.target.name]: event.target.value
            }
        });
    }

    changeVisibility() {
        this.setState((state) => ({
            isPasswordVisibility: !state.isPasswordVisibility
        }));
    }

    async create() {
        const errors = validateCreateAdminInput(this.state.values.ANId, this.state.values.AName,
            this.state.values.ASurname, this.state.values.APatronymic, this.state.values.AEmail,
            this.state.values.APassword, this.state.values.ACPassword);
        if (Object.keys(errors).length !== 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.setState({
                errors: {}
            });
            this.createAdmin();
            await this.timeout(500);
            this.getAdmins();
            await this.timeout(500);
            if (Object.keys(this.state.errors).length === 0) {
                this.setState({
                    part: 0
                });
            }
        }
    }

    render() {
        return (
            <div className="main">
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a onClick={() => goAdminProfilePage(this.props)}>Профиль</a>
                    <a className="active" onClick={() => this.adminsBar()}>Администраторы</a>
                    <a onClick={() => goAdminTeachersPage(this.props)}>Учителя</a>
                    <a onClick={() => goAdminGroupsPage(this.props)}>Группы</a>
                    <a onClick={() => goAdminRegisterStudentsPage(this.props)}>Регистрация студентов</a>
                    <a onClick={() => goAdminStudentsPage(this.props)}>Студенты</a>
                    <a onClick={() => goAdminSubjectsPage(this.props)}>Предметы</a>
                </div>
                {this.state.part === 0 && (
                    <div className="table_panel">
                        {this.state.admins.length === 0 && (
                            <div>
                                <h2 className="h2_margin">Администраторов нет</h2>
                            </div>
                        )}
                        {this.state.admins.length !== 0 && (
                            <div>
                                <h1 id='title'>Администраторы</h1>
                                <table id='data'>
                                    <tbody>
                                    <tr>
                                        <th>ID</th>
                                        <th>Фамилия</th>
                                        <th>Имя</th>
                                        <th>Отчество</th>
                                        <th>Email</th>
                                        <th>Должность</th>
                                        <th/>
                                    </tr>
                                    {this.state.admins.map(admin => {
                                        const {id, surname, name, patronymic, email} = admin
                                        const adminId = localStorage.getItem("id");
                                        return (
                                            <tr key={id}>
                                                <td>{id}</td>
                                                <td>{surname}</td>
                                                <td>{name}</td>
                                                <td>{patronymic}</td>
                                                <td>{email}</td>
                                                <td>{admin.post.name}</td>
                                                {id != adminId && (
                                                    <td>
                                                        <button
                                                            className="btn_delete"
                                                            value={id}
                                                            onClick={event => this.delete(event)}
                                                        >
                                                            Удалить
                                                        </button>
                                                    </td>
                                                )}
                                                {id == adminId && (
                                                    <td/>
                                                )}
                                            </tr>
                                        )

                                    })}
                                    </tbody>
                                </table>
                                <button className="btn_add_medium" onClick={() => this.add()}>
                                    Добавить администратора
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {this.state.part === 1 && (
                    <div className="panel_add big">
                        <div className="begin_add">
                            Добавление администратора
                        </div>
                        <div className="part_add">
                            <div className="description_add">
                                ID
                            </div>
                            <input
                                name="ANId"
                                className="in_data_add"
                                type="text"
                                placeholder="Введите ID администратора"
                                value={this.state.values.ANId}
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
                                name="ASurname"
                                type="text"
                                className="in_data_add"
                                placeholder="Введите фамилию администратора"
                                value={this.state.values.ASurname}
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
                                name="AName"
                                type="text"
                                className="in_data_add"
                                placeholder="Введите имя администратора"
                                value={this.state.values.AName}
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
                                name="APatronymic"
                                type="text"
                                className="in_data_add"
                                placeholder="Введите отчество администратора"
                                value={this.state.values.APatronymic}
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
                                name="AEmail"
                                type="email"
                                className="in_data_add"
                                placeholder="Введите почту администратора"
                                value={this.state.values.AEmail}
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
                                Должность
                            </div>
                            <select
                                name="PId"
                                className="select_data"
                                value={this.state.values.PId}
                                onChange={event => this.change(event)}
                            >
                                {this.state.posts.map(post => {
                                    const {id, name} = post;
                                    return (
                                        <option value={id}>{name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="part_password_add">
                            <div className="description_add">
                                Пароль
                            </div>
                            <input
                                name="APassword"
                                className="in_data_add"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Введите пароль"
                                title="≥ одной цифры, ≥ одной буквы в верхнем и нижнем регистре and ≥ восьми знаков"
                                value={this.state.values.APassword}
                                onChange={event => this.change(event)}
                            />
                            <div className="small_indent"/>
                            <input
                                name="ACPassword"
                                className="in_data_add"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Повторно введите пароль"
                                value={this.state.values.ACPassword}
                                onChange={event => this.change(event)}
                            />
                        </div>
                        <input type="checkbox"
                               id="check"
                               className="check_recovery"
                               onChange={() => this.changeVisibility()}
                        />
                        <label htmlFor="check">Посмотреть пароли</label>
                        {this.state.errors.password && (
                            <div className="error_panel_add">
                                {this.state.errors.password}
                            </div>
                        )}
                        <button
                            className="btn_add"
                            onClick={() => this.create()}
                        >
                            Подтвердить
                        </button>
                    </div>
                )}
                {this.state.part === 2 && (
                    <React.Fragment>
                        {
                            <div className="modal_rm">
                                <div className="modal_body_rm">
                                    <h1>УДАЛЕНИЕ</h1>
                                    <h3>Вы действительно хотите удалить администратора?</h3>
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

export default AdminsPage;