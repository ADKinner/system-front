import React from "react";
import '../../styles/admin.css'
import {
    goAdminGroupsPage,
    goAdminProfilePage,
    goAdminsPage,
    goAdminStudentsPage,
    goAdminSubjectsPage,
    goLoginPage,
    goServerErrorPage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";
import validateCreateTeacherInput from "../../validate/validateCreateTeacherInput";

class AdminTeachersPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_ADMIN":
                    this.getCathedras();
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getCathedras() {
        axios.get(constants.DEFAULT_URL + constants.CATHEDRAS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    values: {CID: response.data[0]["id"]},
                    cathedras: response.data
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

    getTeachers() {
        axios.get(constants.DEFAULT_URL + constants.TEACHERS_URL + "/cathedra/" + this.state.values.CID, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    teachers: response.data
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

    getSubjects(id) {
        axios.get(constants.DEFAULT_URL + constants.SUBJECTS_URL + "/teacher/" + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    subjects: response.data
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

    deleteTeacher(id) {
        axios.delete(constants.DEFAULT_URL + constants.TEACHERS_URL + constants.SLASH + id, {
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

    createTeacher() {
        axios.post(constants.DEFAULT_URL + constants.TEACHERS_URL, {
            id: this.state.data.id,
            name: this.state.data.name,
            surname: this.state.data.surname,
            patronymic: this.state.data.patronymic,
            password: this.state.data.password,
            email: this.state.data.email,
            postId: this.state.data.postId,
            cathedraId: this.state.values.CID
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

    handleTeachersClick() {

    }

    handleFindBtnClick() {
        this.getTeachers();
        this.setState({
            part: 1
        });
    }

    handleViewTableBtnClick(event) {
        this.getSubjects(event.target.value);
        this.setState({

        });
    }

    handleDeleteTableBtnClick(event) {
        this.setState({
            values: {groupId: event.target.value},
            isDeleteGroupModal: true
        });
    }

    handleDeleteModalClick() {
        this.deleteGroup();
        this.setState({
            part: 1
        });
    }

    handleCloseModalClick() {
        this.setState({
            part: 1
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

    handleCreateTeacherForm(event) {
        event.preventDefault();
        const errors = validateCreateTeacherInput(this.state.values, this.state.teachers);
        if (Object.keys(errors).length !== 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.createTeacher();
            this.setState({
                part: 1
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
                    <a onClick={() => goAdminsPage(this.props)}>Администраторы</a>
                    <a className="active" onClick={() => this.handleTeachersClick()}>Учителя</a>
                    <a onClick={() => goAdminGroupsPage(this.props)}>Группы</a>
                    <a onClick={() => goAdminStudentsPage(this.props)}>Студенты</a>
                    <a onClick={() => goAdminSubjectsPage(this.props)}>Предметы</a>
                </div>
                {this.state.part == 0 && (
                    <div className="panel_add panel_add_medium">
                        <div className="begin_add">
                            Поиск группы
                        </div>
                        <div className="part_add">
                            <div className="description_add">
                                Кафедры
                            </div>
                            <select
                                name="CID"
                                className="select_data"
                                onChange={event => this.handleChange(event)}
                            >
                                {this.state.cathedras.map(cathedra => {
                                    const {id, name} = cathedra;
                                    return (
                                        <option value={id}>{name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <button
                            className="btn_add"
                            onClick={() => this.handleFindBtnClick()}
                        >
                            Поиск
                        </button>
                    </div>
                )}
                {this.state.part == 1 && (
                    <div className="table_panel">
                        <div>
                            <h1 id='title'>Учителя</h1>
                            <table id='data'>
                                <tbody>
                                <tr>
                                    <th>ID</th>
                                    <th>Фамилия</th>
                                    <th>Имя</th>
                                    <th>Отчество</th>
                                    <th>Email</th>
                                    <th/>
                                    <th/>
                                </tr>
                                {this.state.teachers.map(teacher => {
                                    const {id, surname, name, patronymic, email} = teacher
                                    return (
                                        <tr key={id}>
                                            <td>{id}</td>
                                            <td>{surname}</td>
                                            <td>{name}</td>
                                            <td>{patronymic}</td>
                                            <td>{email}</td>
                                            <td>
                                                <button
                                                    className="btn_view"
                                                    value={id}
                                                    onClick={event => this.handleViewTableBtnClick(event)}
                                                >
                                                    Посмотреть
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn_delete"
                                                    value={id}
                                                    onClick={event => this.handleDeleteTableBtnClick(event)}
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
                {this.state.part == 2 && (
                    <div className="table_panel">
                        <div>
                            <h1 id='title'>Предметы</h1>
                            <table id='data'>
                                <tbody>
                                <tr>
                                    <th>Предмет</th>
                                    <th>Тип</th>
                                    <th>Семестр</th>
                                    <th>Форма обучения</th>
                                    <th>Специальность</th>
                                </tr>
                                {this.state.subjects.map(subject => {
                                    const {id, name} = subject;
                                    const typeName = subject["subjectType"]["name"];
                                    const termNumber = subject["term"]["number"];
                                    const edFormName = subject["term"]["educationForm"]["name"];
                                    const specialityName = subject["term"]["speciality"]["name"];
                                    return (
                                        <tr key={id}>
                                            <td>{name}</td>
                                            <td>{typeName}</td>
                                            <td>{termNumber}</td>
                                            <td>{edFormName}</td>
                                            <td>{specialityName}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {this.state.part == 3 && (
                    <React.Fragment>
                        {
                            <div className="modal_rm">
                                <div className="modal_body_rm">
                                    <h1>УДАЛЕНИЕ</h1>
                                    <h3>Вы действительно хотите удалить преподователя?</h3>
                                    <h3>
                                        Действие будет невозможно отменить.
                                    </h3>
                                    <button
                                        className="btn_rm"
                                        onClick={() => this.handleDeleteModalClick()}
                                    >
                                        Удалить
                                    </button>
                                    <div/>
                                    <button
                                        className="btn_close"
                                        onClick={() => this.handleCloseModalClick()}
                                    >
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        }
                    </React.Fragment>
                )}
                {this.state.part == 4 && (
                    <div className="panel_add">
                        <div className="begin_add">
                            Добавление учителя
                        </div>
                        <form className="reg_add" onSubmit={event => this.handleCreateTeacherForm(event)}>
                            <div className="part_add">
                                <div className="description_add">
                                    ID
                                </div>
                                <input
                                    name="id"
                                    className="in_data_add"
                                    type="text"
                                    placeholder="Введите ID учителя"
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
                                    placeholder="Введите фамилию учителя"
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
                                    placeholder="Введите имя учителя"
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
                                    placeholder="Введите отчество учителя"
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
                                    placeholder="Введите почту учителя"
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
            </div>
        )
    }
}

export default AdminTeachersPage;