import React from "react";
import '../../styles/admin.css';
import {
    goAdminGroupsPage,
    goAdminProfilePage,
    goAdminStudentsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
    goLoginPage,
    goServerErrorPage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";
import validateCreateAdminInput from "../../validate/validateCreateAdminInput";

class AdminsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_ADMIN":
                    this.getAdmins();
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getAdmins() {
        axios.get(constants.DEFAULT_URL + constants.ADMINS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    admins: response.data
                });
            })
            .catch(error => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
                }
            });
    }

    getPosts() {
        axios.get(constants.DEFAULT_URL + constants.POSTS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    defPID: response.data[0]["id"],
                    posts: response.data
                });
            })
            .catch(error => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
                }
            });
    }

    deleteAdmin() {
        axios.delete(constants.DEFAULT_URL + constants.ADMINS_URL + constants.SLASH + this.state.adminId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then().catch(error => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }

    createAdmin() {
        axios.post(constants.DEFAULT_URL + constants.ADMINS_URL, {
            id: this.state.values.id,
            name: this.state.values.name,
            surname: this.state.values.surname,
            patronymic: this.state.values.patronymic,
            password: this.state.values.password,
            email: this.state.values.email,
            postId: this.state.values.postId
        }, {
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

    handleAdminsClick() {
        if (this.state.isCreateAdmin) {
            this.setState({
                isCreateAdmin: false
            });
        }
    }

    handleDeleteAdminBtnClick(event) {
        this.setState({
            adminId: event.target.value,
            isDeleteModal: true
        });
    }

    handleCloseBtnClick() {
        this.setState({
            isDeleteModal: false
        });
    }

    handleDeleteBtnClick() {
        this.deleteAdmin();
        this.setState({
            isDeleteModal: false
        });
    }

    handleGoCreateAdminBtn() {
        this.getPosts();
        this.setState({
            isCreateAdmin: true,
            values: {
                id: '',
                name: '',
                surname: '',
                patronymic: '',
                email: '',
                password: '',
                confirmPassword: '',
                postId: this.state.defPID
            }
        });
    }

    handleInputChange(event) {
        this.setState({
            values: {
                ...this.state.values,
                [event.target.name]: event.target.value
            }
        });
    }

    handleChangePasswordVisibility() {
        this.setState((state) => ({
            isPasswordVisibility: !state.isPasswordVisibility
        }));
    }

    handleCreateAdminSubmitForm(event) {
        event.preventDefault();
        const errors = validateCreateAdminInput(this.state.values, this.state.admins);
        if (Object.keys(errors).length !== 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.createAdmin();
            this.setState({
                isCreateAdmin: false
            });
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
                    <a className="active" onClick={() => this.handleAdminsClick()}>Администраторы</a>
                    <a onClick={() => goAdminTeachersPage(this.props)}>Учителя</a>
                    <a onClick={() => goAdminGroupsPage(this.props)}>Группы</a>
                    <a onClick={() => goAdminStudentsPage(this.props)}>Студенты</a>
                    <a onClick={() => goAdminSubjectsPage(this.props)}>Предметы</a>
                </div>
                {!this.state.isCreateAdmin && (
                    <div className="table_panel">
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
                                {this.state.admins.map((admin) => {
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
                                                        onClick={event => this.handleDeleteAdminBtnClick(event)}
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
                            <button className="btn_add_medium" onClick={() => this.handleGoCreateAdminBtn()}>
                                Добавить администратора
                            </button>
                        </div>
                    </div>
                )}
                {this.state.isCreateAdmin && (
                    <div className="panel_add">
                        <div className="begin_add">
                            Добавление администратора
                        </div>
                        <form className="reg_add" onSubmit={event => this.handleCreateAdminSubmitForm(event)}>
                            <div className="part_add">
                                <div className="description_add">
                                    ID
                                </div>
                                <input
                                    name="id"
                                    className="in_data_add"
                                    type="text"
                                    placeholder="Введите ID администратора"
                                    value={this.state.values.id}
                                    onChange={event => this.handleInputChange(event)}
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
                                    placeholder="Введите фамилию администратора"
                                    value={this.state.values.surname}
                                    onChange={event => this.handleInputChange(event)}
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
                                    placeholder="Введите имя администратора"
                                    value={this.state.values.name}
                                    onChange={event => this.handleInputChange(event)}
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
                                    placeholder="Введите отчество администратора"
                                    value={this.state.values.patronymic}
                                    onChange={event => this.handleInputChange(event)}
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
                                    placeholder="Введите почту администратора"
                                    value={this.state.values.email}
                                    onChange={event => this.handleInputChange(event)}
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
                                    name="postId"
                                    className="select_data"
                                    onChange={event => this.handleInputChange(event)}
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
                                    name="password"
                                    className="in_data_add"
                                    type={this.state.isPasswordVisibility ? "text" : "password"}
                                    placeholder="Введите пароль"
                                    title="≥ одной цифры, ≥ одной буквы в верхнем и нижнем регистре and ≥ восьми знаков"
                                    value={this.state.values.password}
                                    onChange={event => this.handleInputChange(event)}
                                />
                                <div className="small_indent"/>
                                <input
                                    name="confirmPassword"
                                    className="in_data_add"
                                    type={this.state.isPasswordVisibility ? "text" : "password"}
                                    placeholder="Повторно введите пароль"
                                    value={this.state.values.confirmPassword}
                                    onChange={event => this.handleInputChange(event)}
                                />
                            </div>
                            <input type="checkbox"
                                   id="check"
                                   className="check_recovery"
                                   onChange={() => this.handleChangePasswordVisibility()}
                            />
                            <label htmlFor="check">Посмотреть пароли</label>
                            {this.state.errors.password && (
                                <div className="error_panel">
                                    {this.state.errors.password}
                                </div>
                            )}
                            <button className="btn_add">Подтвердить</button>
                        </form>
                    </div>
                )}
                {this.state.isDeleteModal && (
                    <React.Fragment>
                        {
                            <div className="modal_rm">
                                <div className="modal_body_rm">
                                    <h1>УДАЛЕНИЕ</h1>
                                    <h3>Вы действительно хотите удалить администратора?</h3>
                                    <h3>Действие будет невозможно отменить.</h3>
                                    <button
                                        className="btn_rm"
                                        onClick={() => this.handleDeleteBtnClick()}
                                    >
                                        Удалить
                                    </button>
                                    <div/>
                                    <button
                                        className="btn_close"
                                        onClick={() => this.handleCloseBtnClick()}
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