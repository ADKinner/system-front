import React from "react";
import '../../styles/admin.css'
import {
    goAdminProfilePage,
    goAdminsPage,
    goAdminStudentsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
    goLoginPage,
    goServerErrorPage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";
import validateCreateGroupInput from "../../validate/validateCreateGroupInput";

class AdminGroupsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFaculties: true,
            isCathedras: false,
            isSpecialities: false,
            isTerms: false,
            isGroups: false,
            isStudents: false,
            isDeleteGroupModal: false,
            isCreateGroup: false,
            faculties: [],
            cathedras: [],
            specialities: [],
            terms: [],
            groups: [],
            students: [],
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
                    this.getFaculties();
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getFaculties() {
        axios.get(constants.DEFAULT_URL + constants.FACULTIES_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    values: {FID: response.data[0]["id"]},
                    faculties: response.data
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

    getCathedras() {
        axios.get(constants.DEFAULT_URL + constants.CATHEDRAS_URL + "/faculty/" + this.state.values.FID, {
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

    getSpecialities() {
        axios.get(constants.DEFAULT_URL + constants.SPECIALITIES_URL + "/cathedra/" + this.state.values.CID, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    values: {SID: response.data[0]["id"]},
                    specialities: response.data
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

    getTerms() {
        axios.get(constants.DEFAULT_URL + constants.TERMS_URL + "/speciality/" + this.state.values.SID, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    values: {TID: response.data[0]["id"]},
                    terms: response.data
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

    getGroups() {
        axios.get(constants.DEFAULT_URL + constants.GROUPS_URL + "/term/" + this.state.values.TID, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    groups: response.data
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

    createGroup() {
        axios.post(constants.DEFAULT_URL + constants.GROUPS_URL, {
            id: this.state.values.newId,
            termId: this.state.values.TID
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

    deleteGroup() {
        axios.delete(constants.DEFAULT_URL + constants.GROUPS_URL + constants.SLASH + this.state.values.groupId, {
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

    getStudents(groupId) {
        axios.get(constants.DEFAULT_URL + constants.STUDENTS_URL + "/group/" + groupId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    students: response.data
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

    handleChange(event) {
        this.setState({
            values: {
                ...this.state.values,
                [event.target.name]: event.target.value
            }
        });
    }

    handleFindBtnClick() {
        if (this.state.isFaculties) {
            this.setState({
                isCathedras: true
            });
            this.getCathedras();
        }
        if (this.state.isCathedras) {
            this.setState({
                isSpecialities: true
            });
            this.getSpecialities();
        }
        if (this.state.isSpecialities) {
            this.setState({
                isTerms: true
            });
            this.getTerms();
        }
        if (this.state.isTerms) {
            this.setState({
                isGroups: true
            });
            this.getGroups();
        }
    }

    handleGroupsClick() {
        if (this.state.isCreateGroup) {
            this.setState({
                isCreateGroup: false,
                isGroups: true
            });
        } else if (this.state.isStudents) {
            this.setState({
                isStudents: false,
                isGroups: true
            });
        } else if (this.state.isGroups) {
            this.setState({
                isGroups: false,
                isTerms: true
            });
        } else if (this.state.isTerms) {
            this.setState({
                isTerms: false
            });
        } else if (this.state.isSpecialities) {
            this.setState({
                isSpecialities: false
            });
        } else if (this.state.isCathedras) {
            this.setState({
                isCathedras: false
            });
        }
    }

    handleAddTableBtnClick() {
        this.setState({
            isGroups: false,
            isCreateGroup: true
        });
    }

    handleCreateGroupSubmitForm(event) {
        event.preventDefault();
        const errors = validateCreateGroupInput(this.state.values.newId, this.state.groups);
        if (Object.keys(errors).length !== 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.createGroup();
            this.setState({
                isCreateGroup: false,
                isGroups: true
            });
        }
    }

    handleViewTableBtnClick(event) {
        this.getStudents(event.target.value);
        this.setState({
            isGroups: false,
            isStudents: true
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
            isDeleteGroupModal: false
        });
    }

    handleCloseModalClick() {
        this.setState({
            isDeleteGroupModal: false
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
                    <a className="active" onClick={() => this.handleGroupsClick()}>Группы</a>
                    <a onClick={() => goAdminStudentsPage(this.props)}>Студенты</a>
                    <a onClick={() => goAdminSubjectsPage(this.props)}>Предметы</a>
                </div>
                {!this.state.isGroups && !this.state.isCreateGroup && !this.state.isStudents && (
                    <div className="panel_add panel_add_medium">
                        <div className="begin_add">
                            Поиск группы
                        </div>
                        <div className="part_add">
                            <div className="description_add">
                                Факультеты
                            </div>
                            <select
                                name="FID"
                                className="select_data"
                                onChange={event => this.handleChange(event)}
                            >
                                {this.state.faculties.map(faculty => {
                                    const {id, name} = faculty;
                                    return (
                                        <option value={id}>{name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        {this.state.isCathedras && (
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
                        )}
                        {this.state.isSpecialities && (
                            <div className="part_add">
                                <div className="description_add">
                                    Специальности
                                </div>
                                <select
                                    name="SID"
                                    className="select_data"
                                    onChange={event => this.handleChange(event)}
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
                        {this.state.isTerms && (
                            <div className="part_add">
                                <div className="description_add">
                                    Семестры
                                </div>
                                <select
                                    name="TID"
                                    className="select_data"
                                    onChange={event => this.handleChange(event)}
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
                            onClick={() => this.handleFindBtnClick()}
                        >
                            Поиск
                        </button>
                    </div>
                )}
                {this.state.isGroups && (
                    <div className="table_panel">
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
                                            <td>{index}</td>
                                            <td>{id}</td>
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
                            <button className="btn_add_admin" onClick={() => this.handleAddTableBtnClick()}>
                                Добавить группу
                            </button>
                        </div>
                    </div>
                )}
                {this.state.isStudents && (
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
                    </div>
                )}

                {this.state.isCreateGroup && (
                    <div className="panel_add panel_add_small">
                        <div className="begin_add">
                            Добавление группы
                        </div>
                        <form className="reg_add" onSubmit={event => this.handleCreateGroupSubmitForm(event)}>
                            <div className="part_add">
                                <div className="description_add">
                                    ID
                                </div>
                                <input
                                    name="newId"
                                    className="in_data_add"
                                    type="text"
                                    placeholder="Введите ID новой группы"
                                    onChange={event => this.handleChange(event)}
                                />
                            </div>
                            {this.state.errors.id && (
                                <div className="error_panel_add">
                                    {this.state.errors.id}
                                </div>
                            )}
                            <button className="btn_add">Добавить</button>
                        </form>
                    </div>
                )}
                {this.state.isDeleteGroupModal && (
                    <React.Fragment>
                        {
                            <div className="modal_rm">
                                <div className="modal_body_rm">
                                    <h1>УДАЛЕНИЕ</h1>
                                    <h3>Вы действительно хотите удалить группу?</h3>
                                    <h3>
                                        Все студенты будут удалены.
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
            </div>
        )
    }
}

export default AdminGroupsPage;