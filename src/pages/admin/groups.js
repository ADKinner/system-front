import React from "react";
import '../../styles/main.css';
import {
    goAdminProfilePage,
    goAdminRegisterStudentsPage,
    goAdminsPage,
    goAdminStudentsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
    goLoginPage
} from "../../redirect";
import axios from "axios";
import {
    CATHEDRA_PARAM,
    CATHEDRAS_URL,
    DEFAULT_URL,
    FACULTIES_URL,
    FACULTY_PARAM,
    GROUP_ID_PARAM,
    GROUPS_URL,
    Q_PARAM,
    S_PARAM,
    SPECIALITIES_URL,
    SPECIALITY_PARAM,
    STUDENTS_URL,
    TERM_ID_PARAM,
    TERMS_URL
} from "../../constants";
import validateCreateGroupInput from "../../validate/validateCreateGroupInput";
import handleDefaultError from "../../handle/handleDefaultReuqestError";
import handleAdminMount from "../../handle/handleAdminMount";

class AdminGroupsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            smallPart: 0,
            faculties: [],
            cathedras: [],
            specialities: [],
            terms: [],
            groups: [],
            students: [],
            values: {},
            errors: {}
        }
    }

    componentDidMount() {
        handleAdminMount(localStorage);
        this.defaultFindValues();
        this.getFaculties();
    }

    getFaculties() {
        axios.get(DEFAULT_URL + FACULTIES_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    values: {
                        ...this.state.values,
                        FId: response.data[0]["id"]
                    },
                    faculties: response.data
                });
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getCathedras() {
        axios.get(DEFAULT_URL + CATHEDRAS_URL + Q_PARAM + FACULTY_PARAM + this.state.values.FId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    values: {
                        ...this.state.values,
                        CId: response.data[0]["id"]
                    },
                    cathedras: response.data
                });
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getSpecialities() {
        axios.get(DEFAULT_URL + SPECIALITIES_URL + Q_PARAM + CATHEDRA_PARAM + this.state.values.CId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    values: {
                        ...this.state.values,
                        SId: response.data[0]["id"]
                    },
                    specialities: response.data
                });
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getTerms() {
        axios.get(DEFAULT_URL + TERMS_URL + Q_PARAM + SPECIALITY_PARAM + this.state.values.SId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    values: {
                        ...this.state.values,
                        TId: response.data[0]["id"]
                    },
                    terms: response.data
                });
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getGroups() {
        axios.get(DEFAULT_URL + GROUPS_URL + Q_PARAM + TERM_ID_PARAM + this.state.values.TId, {
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

    createGroup() {
        axios.post(DEFAULT_URL + GROUPS_URL, {
            id: this.state.values.NGId,
            termId: this.state.values.TId
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

    deleteGroup() {
        axios.delete(DEFAULT_URL + GROUPS_URL + S_PARAM + this.state.values.GId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getStudents(groupId) {
        axios.get(DEFAULT_URL + STUDENTS_URL + Q_PARAM + GROUP_ID_PARAM + groupId, {
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

    change(event) {
        this.setState({
            values: {
                ...this.state.values,
                [event.target.name]: event.target.value
            }
        });
        this.smallPartChange(event);
    }

    defaultFindValues() {
        this.setState({
            values: {
                FId: '',
                CId: '',
                SId: '',
                TId: ''
            }
        });
    }

    smallPartChange(event) {
        switch (event.target.name) {
            case "FId":
                this.setState({
                    smallPart: 0,
                    cathedras: [],
                    specialities: [],
                    terms: []
                });
                break;
            case "CId":
                this.setState({
                    smallPart: 1,
                    specialities: []
                });
                break;
            case "SId":
                this.setState({
                    smallPart: 2,
                    terms: []
                });
                break;
            default:
                break;
        }
    }

    getData(part) {
        switch (part) {
            case 0:
                if (this.state.faculties.length !== 0) {
                    this.getCathedras();
                }
                break;
            case 1:
                if (this.state.cathedras.length !== 0) {
                    this.getSpecialities();
                }
                break;
            case 2:
                if (this.state.specialities.length !== 0) {
                    this.getTerms();
                }
                break;
            default:
                break;
        }
    }

    timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    find() {
        if (this.state.smallPart < 3) {
            this.getData(this.state.smallPart);
            this.setState((state) => ({
                smallPart: state.smallPart + 1
            }));
        } else if (this.state.smallPart < 4) {
            this.getGroups();
            this.setState({
                part: 1
            });
        }
    }

    groupsBar() {
        if (this.state.part === 3) {
            this.setState({
                part: this.state.part - 2
            });
        } else if (this.state.part > 0) {
            if (this.state.part === 2) {
                this.setState({
                    students: []
                });
            } else if (this.state.part === 1) {
                this.setState({
                    groups: []
                });
            }
            this.setState({
                part: this.state.part - 1
            });
        } else if (this.state.smallPart > 0) {
            this.setState({
                smallPart: this.state.smallPart - 1
            });
        }
    }

    add() {
        this.setState({
            part: 3,
            values: {
                ...this.state.values,
                NGId: ''
            }
        });
    }

    async create() {
        const errors = validateCreateGroupInput(this.state.values.NGId);
        if (Object.keys(errors).length !== 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.setState({
                errors: {}
            });
            this.createGroup();
            await this.timeout(500);
            this.getGroups();
            await this.timeout(500);
            if (Object.keys(this.state.errors).length === 0) {
                this.setState({
                    part: 1
                });
            }
        }
    }

    view(event) {
        this.getStudents(event.target.value);
        this.setState({
            part: 2,
            values: {
                ...this.state.values,
                GId: event.target.value
            }
        });
    }

    delete(event) {
        this.setState({
            values: {
                ...this.state.values,
                GId: event.target.value
            },
            part: 4
        });
    }

    async modalDelete() {
        this.deleteGroup();
        await this.timeout(1000);
        this.getGroups();
        this.setState({
            part: 1
        });
    }

    modalClose() {
        this.setState({
            part: 1
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
                    <a className="active" onClick={() => this.groupsBar()}>Группы</a>
                    <a onClick={() => goAdminRegisterStudentsPage(this.props)}>Регистрация студентов</a>
                    <a onClick={() => goAdminStudentsPage(this.props)}>Студенты</a>
                    <a onClick={() => goAdminSubjectsPage(this.props)}>Предметы</a>
                </div>
                {this.state.part === 0 && (
                    <div className="panel_add panel_add_medium">
                        <div className="begin_add">
                            Поиск группы
                        </div>
                        <div className="part_add">
                            <div className="description_add">
                                Факультеты
                            </div>
                            <select
                                name="FId"
                                className="select_data"
                                value={this.state.values.FId}
                                onChange={event => this.change(event)}
                            >
                                {this.state.faculties.map(faculty => {
                                    const {id, name} = faculty;
                                    return (
                                        <option value={id}>{name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        {this.state.smallPart > 0 && (
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
                        )}
                        {this.state.smallPart > 1 && (
                            <div className="part_add">
                                <div className="description_add">
                                    Специальности
                                </div>
                                <select
                                    name="SId"
                                    className="select_data"
                                    value={this.state.values.SId}
                                    onChange={event => this.change(event)}
                                >
                                    {this.state.specialities.map(speciality => {
                                        const {id, name} = speciality;
                                        return (
                                            <option value={id}>{name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        )}
                        {this.state.smallPart > 2 && (
                            <div className="part_add">
                                <div className="description_add">
                                    Семестры
                                </div>
                                <select
                                    name="TId"
                                    className="select_data"
                                    value={this.state.values.TId}
                                    onChange={event => this.change(event)}
                                >
                                    {this.state.terms.map(term => {
                                        const {id, number} = term;
                                        const formName = term["educationForm"]["name"];
                                        return (
                                            <option value={id}>{number} сем., форма обучения: {formName}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        )}
                        <button
                            className="btn_add"
                            onClick={() => this.find()}
                        >
                            Поиск
                        </button>
                    </div>
                )}
                {this.state.part === 1 && (
                    <div className="table_panel">
                        {this.state.groups.length === 0 && (
                            <div>
                                <h2 className="h2_margin">Групп нет</h2>
                            </div>
                        )}
                        {this.state.groups.length !== 0 && (
                            <div>
                                <h1 id='title'>Группы</h1>
                                <table id='small_data'>
                                    <tbody>
                                    <tr>
                                        <th>№</th>
                                        <th>ID</th>
                                        <th/>
                                        <th/>
                                    </tr>
                                    {this.state.groups.map((group, index) => {
                                        const {id} = group
                                        return (
                                            <tr key={id}>
                                                <td>{index + 1}</td>
                                                <td>{id}</td>
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
                                <button className="btn_add_medium" onClick={() => this.add()}>
                                    Добавить группу
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {this.state.part === 2 && (
                    <div className="table_panel">
                        {this.state.students.length === 0 && (
                            <div>
                                <h2 className="h2_margin">Студентов нет</h2>
                            </div>
                        )}
                        {this.state.students.length !== 0 && (
                            <div>
                                <h1 id='title'>Студенты</h1>
                                <table id='data'>
                                    <tbody>
                                    <tr>
                                        <th>Id</th>
                                        <th>Фамилия</th>
                                        <th>Имя</th>
                                        <th>Отчество</th>
                                        <th>Email</th>
                                    </tr>
                                    {this.state.students.map(student => {
                                        const {id, surname, name, patronymic, email} = student
                                        return (
                                            <tr key={id}>
                                                <td>{id}</td>
                                                <td>{surname}</td>
                                                <td>{name}</td>
                                                <td>{patronymic}</td>
                                                <td>{email}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                {this.state.part === 3 && (
                    <div className="panel_add panel_add_small">
                        <div className="begin_add">
                            Добавление группы
                        </div>
                        <div className="part_add">
                            <div className="description_add">
                                ID
                            </div>
                            <input
                                name="NGId"
                                className="in_data_add"
                                type="text"
                                placeholder="Введите ID новой группы"
                                value={this.state.values.NGId}
                                onChange={event => this.change(event)}
                            />
                        </div>
                        {this.state.errors.id && (
                            <div className="error_panel_add">
                                {this.state.errors.id}
                            </div>
                        )}
                        <button
                            className="btn_add"
                            onClick={() => this.create()}
                        >
                            Добавить
                        </button>
                    </div>
                )}
                {this.state.part === 4 && (
                    <React.Fragment>
                        {
                            <div className="modal_rm">
                                <div className="modal_body_rm">
                                    <h1>УДАЛЕНИЕ</h1>
                                    <h3>Вы действительно хотите удалить группу?</h3>
                                    <h3>
                                        Все студенты будут удалены.
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

export default AdminGroupsPage;