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
            part: 0,
            cathedras: [],
            teachers: [],
            subjects: [],
            posts: [],
            values: {},
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
                if (response.data.length !== 0) {
                    this.setState({
                        values: {
                            CId: response.data[0]["id"]
                        },
                        cathedras: response.data
                    });
                }
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
        axios.get(constants.DEFAULT_URL + constants.TEACHERS_URL + "/cathedra/" + this.state.values.CId, {
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
                    values: {
                        ...this.state.values,
                        TPId: response.data[0]["id"]
                    },
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

    deleteTeacher() {
        axios.delete(constants.DEFAULT_URL + constants.TEACHERS_URL + constants.SLASH + this.state.values.TId, {
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
            id: this.state.values.TNId,
            name: this.state.values.TName,
            surname: this.state.values.TSurname,
            patronymic: this.state.values.TPatronymic,
            password: this.state.values.TPassword,
            email: this.state.values.TEmail,
            postId: this.state.values.TPId,
            cathedraId: this.state.values.CId
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
                    errors: {id: "ID занят"}
                });
            }
        });
    }

    defaultCreateValues() {
        this.setState({
            values: {
                ...this.state.values,
                TNId: '',
                TPassword: '',
                TCPassword: '',
                TName: '',
                TSurname: '',
                TPatronymic: '',
                TEmail: ''
            }
        });
    }

    teachersBar() {
        if (this.state.part == 3) {
            this.getTeachers();
            this.setState({
                part: 1,
                errors: {}
            });
        } else if (this.state.part > 0) {
            this.setState((state) => ({
                part: state.part - 1
            }));
        }
    }

    find() {
        if (this.state.cathedras.length !== 0) {
            this.getTeachers();
            this.setState({
                part: 1
            });
        }
    }

    add() {
        this.defaultCreateValues();
        this.getPosts();
        this.setState({
            part: 3
        });
    }

    view(event) {
        this.getSubjects(event.target.value);
        this.setState({
            part: 2
        });
    }

    delete(event) {
        this.setState({
            values: {
                ...this.state.values,
                TId: event.target.value
            },
            part: 4
        });
    }

    modalDelete() {
        console.log(this.state);
        this.deleteTeacher();
        this.getTeachers();
        this.setState({
            part: 1
        });
    }

    modalClose() {
        this.setState({
            part: 1
        });
    }

    change(event) {
        console.log(this.state);
        this.setState({
            values: {
                ...this.state.values,
                [event.target.name]: event.target.value
            }
        });
    }

    create() {
        const errors = validateCreateTeacherInput(this.state.values.TNId, this.state.values.TName,
            this.state.values.TSurname, this.state.values.TPatronymic, this.state.values.TEmail,
            this.state.values.TPassword, this.state.values.TCPassword);
        if (Object.keys(errors).length !== 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.setState({
                errors: {}
            });
            this.createTeacher();
            console.log(this.state);
            if (Object.keys(errors).length === 0) {
                this.setState({
                    part: 1
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
                    <a onClick={() => goAdminsPage(this.props)}>Администраторы</a>
                    <a className="active" onClick={() => this.teachersBar()}>Учителя</a>
                    <a onClick={() => goAdminGroupsPage(this.props)}>Группы</a>
                    <a onClick={() => goAdminStudentsPage(this.props)}>Студенты</a>
                    <a onClick={() => goAdminSubjectsPage(this.props)}>Предметы</a>
                </div>
                {this.state.part == 0 && (
                    <div className="panel_add panel_add_small">
                        <div className="begin_add">
                            Поиск учителя
                        </div>
                        <div className="part_add">
                            <div className="description_add">
                                Кафедры
                            </div>
                            <select
                                name="CId"
                                className="select_data"
                                value={this.state.values.CId}
                                onChange={event => this.change(event)}
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
                            onClick={() => this.find()}
                        >
                            Поиск
                        </button>
                    </div>
                )}
                {this.state.part == 1 && (
                    <div className="table_panel">
                        {this.state.teachers.length === 0 && (
                            <div>
                                <h2 className="h2_margin">Учителей нет</h2>
                            </div>
                        )}
                        {this.state.teachers.length !== 0 && (
                            <div>
                                <h1 id='title'>Учителя</h1>
                                <table id='data'>
                                    <tbody>
                                    <tr>
                                        <th>№ ID карты</th>
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
                                <button
                                    className="btn_add_medium"
                                    onClick={() => this.add()}>
                                    Добавить
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {this.state.part == 2 && (
                    <div className="table_panel">
                        <div>
                            {this.state.subjects.length === 0 && (
                                <div>
                                    <h2 className="h2_margin">Предметов нет</h2>
                                </div>
                            )}
                            {this.state.subjects.length !== 0 && (
                                <div>
                                    <h1 id='title'>Предметы</h1>
                                    <table id='medium_data'>
                                        <tbody>
                                        <tr>
                                            <th>Предмет</th>
                                            <th>Тип</th>
                                            <th>Кол-во занятий</th>
                                            <th>Семестр</th>
                                            <th>Форма обучения</th>
                                            <th>Специальность</th>
                                        </tr>
                                        {this.state.subjects.map(subject => {
                                            const {id, name, count} = subject;
                                            const typeName = subject["subjectType"]["name"];
                                            const termNumber = subject["term"]["number"];
                                            const edFormName = subject["term"]["educationForm"]["name"];
                                            const specialityName = subject["term"]["speciality"]["name"];
                                            return (
                                                <tr key={id}>
                                                    <td>{name}</td>
                                                    <td>{typeName}</td>
                                                    <td>{count}</td>
                                                    <td>{termNumber}</td>
                                                    <td>{edFormName}</td>
                                                    <td>{specialityName}</td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {this.state.part == 3 && (
                    <div className="panel_add big">
                        <div className="begin_add">
                            Добавление учителя
                        </div>
                        <div className="part_add">
                            <div className="description_add">
                                ID
                            </div>
                            <input
                                name="TNId"
                                className="in_data_add"
                                type="text"
                                placeholder="Введите ID учителя"
                                value={this.state.values.TNId}
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
                                name="TSurname"
                                type="text"
                                className="in_data_add"
                                placeholder="Введите фамилию учителя"
                                value={this.state.values.TSurname}
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
                                name="TName"
                                type="text"
                                className="in_data_add"
                                placeholder="Введите имя учителя"
                                value={this.state.values.TName}
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
                                name="TPatronymic"
                                type="text"
                                className="in_data_add"
                                placeholder="Введите отчество учителя"
                                value={this.state.values.TPatronymic}
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
                                name="TEmail"
                                type="email"
                                className="in_data_add"
                                placeholder="Введите почту учителя"
                                value={this.state.values.TEmail}
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
                                name="TPId"
                                className="select_data"
                                value={this.state.values.TPId}
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
                                name="TPassword"
                                className="in_data_add"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Введите пароль"
                                title="≥ одной цифры, ≥ одной буквы в верхнем и нижнем регистре and ≥ восьми знаков"
                                value={this.state.values.TPassword}
                                onChange={event => this.change(event)}
                            />
                            <div className="small_indent"/>
                            <input
                                name="TCPassword"
                                className="in_data_add"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Повторно введите пароль"
                                value={this.state.values.TCPassword}
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
                            <div className="error_panel">
                                {this.state.errors.password}
                            </div>
                        )}
                        <button className="btn_add" onClick={() => this.create()}>Подтвердить</button>
                    </div>
                )}
                {this.state.part == 4 && (
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

    changeVisibility() {
        this.setState((state) => ({
            isPasswordVisibility: !state.isPasswordVisibility
        }));
    }
}

export default AdminTeachersPage;