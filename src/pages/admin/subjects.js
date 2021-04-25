import React from "react";
import '../../styles/main.css';
import {
    goAdminGroupsPage,
    goAdminProfilePage,
    goAdminRegisterStudentsPage,
    goAdminsPage,
    goAdminStudentsPage,
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
    Q_PARAM,
    SPECIALITIES_URL,
    SPECIALITY_PARAM,
    SUBJECT_ID_PARAM,
    SUB_SUBJECTS_URL,
    SUBJECTS_URL,
    TEACHERS_URL,
    TERM_ID_PARAM,
    TERMS_URL
} from "../../constants";
import handleDefaultError from "../../handle/handleDefaultReuqestError";
import handleAdminMount from "../../handle/handleAdminMount";

class AdminSubjectsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            smallPart: 0,
            faculties: [],
            cathedras: [],
            specialities: [],
            terms: [],
            subjects: [],
            subjectInfos: [],
            teachers: {},
            values: {},
            isChangeSubject: false,
            isChangeSubjectInfo: false
        }
    }

    componentDidMount() {
        handleAdminMount(localStorage);
        this.defaultFindValues();
        this.getFaculties();
    }

    defaultFindValues() {
        this.setState({
            values: {
                FId: '',
                CId: '',
                SId: '',
                TId: '',
                NSTId: '',
                NSITId: ''
            }
        });
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

    getSubjects() {
        axios.get(DEFAULT_URL + SUBJECTS_URL + Q_PARAM + TERM_ID_PARAM + this.state.values.TId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                subjects: response.data
            });
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getSubjectsInfos(id) {
        axios.get(DEFAULT_URL + SUB_SUBJECTS_URL + Q_PARAM + SUBJECT_ID_PARAM + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    subjectInfos: response.data,
                    values: {
                        ...this.state.values,
                        SbId: id
                    }
                });
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    updateSubject(id) {
        axios.put(DEFAULT_URL + SUBJECTS_URL, {
            subjectId: id,
            teacherId: this.state.values.NSTId
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    updateSubjectInfo(id) {
        axios.put(DEFAULT_URL + SUB_SUBJECTS_URL, {
            subjectInfoId: id,
            teacherId: this.state.values.NSITId
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    subjectsBar() {
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

    getTeachers() {
        axios.get(DEFAULT_URL + TEACHERS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data.length !== 0) {
                this.setState({
                    teachers: response.data,
                    values: {
                        ...this.state.values,
                        NSTId: response.data[0]["id"],
                        NSITId: response.data[0]["id"]
                    }
                });
            }
        }).catch(error => {
            handleDefaultError(this.props, error.response.status);
        });
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

    find() {
        if (this.state.smallPart < 3) {
            this.getData(this.state.smallPart);
            this.setState((state) => ({
                smallPart: state.smallPart + 1
            }));
        } else if (this.state.smallPart < 4) {
            this.getSubjects();
            this.setState({
                part: 1
            });
        }
    }

    timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    async openChangeSubject(event) {
        this.getTeachers();
        await this.timeout(300);
        this.setState({
            isChangeSubject: true
        });
    }

    closeChangeSubject() {
        this.setState({
            isChangeSubject: false
        });
    }

    async changeSubject(event) {
        this.updateSubject(event.target.value);
        await this.timeout(150);
        this.getSubjects();
        await this.timeout(150);
        this.setState({
            isChangeSubject: false
        });
    }

    async openChangeSubjectInfo() {
        this.getTeachers();
        await this.timeout(300);
        this.setState({
            isChangeSubjectInfo: true,
        });
    }

    closeChangeSubjectInfo() {
        this.setState({
            isChangeSubjectInfo: false
        });
    }

    async changeSubjectInfo(event) {
        this.updateSubjectInfo(event.target.value);
        await this.timeout(150);
        this.getSubjectsInfos(this.state.values.SbId);
        await this.timeout(150);
        this.setState({
            isChangeSubjectInfo: false
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

    async view(event) {
        this.getSubjectsInfos(event.target.value);
        await this.timeout(500);
        this.setState({
            part: 2
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
                    <a onClick={() => goAdminStudentsPage(this.props)}>Студенты</a>
                    <a className="active" onClick={() => this.subjectsBar()}>Предметы</a>
                </div>
                {this.state.part === 0 && (
                    <div className="panel_add panel_add_medium">
                        <div className="begin_add">
                            Поиск предметов
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
                                    const {id, title} = faculty;
                                    return (
                                        <option value={id}>{title}</option>
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
                                        const {id, title} = cathedra;
                                        return (
                                            <option value={id}>{title}</option>
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
                                        const {id, title} = speciality;
                                        return (
                                            <option value={id}>{title}</option>
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
                                        const {id, number, educationFormTitle} = term;
                                        return (
                                            <option value={id}>{number} сем., форма обучения: {educationFormTitle}</option>
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
                        <div>
                            <h1 id='title'>Предметы</h1>
                            <table id='data'>
                                <tbody>
                                {!this.state.isChangeSubject && (
                                    <tr>
                                        <th>№</th>
                                        <th>Предмет</th>
                                        <th>Преподаватель</th>
                                        <th/>
                                        <th/>
                                    </tr>
                                )}
                                {this.state.isChangeSubject && (
                                    <tr>
                                        <th>№</th>
                                        <th>Предмет</th>
                                        <th>Преподаватель</th>
                                        <th>Новый преподаватель</th>
                                        <th/>
                                        <th/>
                                    </tr>
                                )}
                                {!this.state.isChangeSubject && this.state.subjects.map((subject, index) => {
                                    const {id, name, examTeacher} = subject;
                                    return (
                                        <tr key={id}>
                                            <td>{index + 1}</td>
                                            <td>{name}</td>
                                            <td>{examTeacher}</td>
                                            <td>
                                                <button
                                                    className="btn_view"
                                                    value={id}
                                                    onClick={event => this.openChangeSubject(event)}
                                                >
                                                    Изменить
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn_view"
                                                    value={id}
                                                    onClick={event => this.view(event)}
                                                >
                                                    Посмотреть
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {this.state.isChangeSubject && this.state.subjects.map((subject, index) => {
                                    const {id, name, examTeacher} = subject;
                                    return (
                                        <tr key={id}>
                                            <td>{index + 1}</td>
                                            <td>{name}</td>
                                            <td>{examTeacher}</td>
                                            <td>
                                                <select
                                                    name="NSTId"
                                                    className="select_teacher"
                                                    value={this.state.values.NSTId}
                                                    onChange={event => this.change(event)}
                                                >
                                                    {this.state.teachers.map(teacher => {
                                                        const {id, name, surname, patronymic} = teacher;
                                                        const cred = surname + " " + name + " " + patronymic;
                                                        return (
                                                            <option value={id}>{cred}</option>
                                                        )
                                                    })}
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn_view"
                                                    value={id}
                                                    onClick={event => this.changeSubject(event)}
                                                >
                                                    Сохранить
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn_view"
                                                    value={id}
                                                    onClick={event => this.closeChangeSubject(event)}
                                                >
                                                    Закрыть
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
                    <div className="table_panel">
                        <div>
                            <h1 id='title'>Предметы</h1>
                            <table id='data'>
                                <tbody>
                                {!this.state.isChangeSubjectInfo && (
                                    <tr>
                                        <th>№</th>
                                        <th>Предмет</th>
                                        <th>Тип предмета</th>
                                        <th>Преподаватель</th>
                                        <th/>
                                    </tr>
                                )}
                                {this.state.isChangeSubjectInfo && (
                                    <tr>
                                        <th>№</th>
                                        <th>Предмет</th>
                                        <th>Тип предмета</th>
                                        <th>Преподаватель</th>
                                        <th>Новый преподаватель</th>
                                        <th/>
                                        <th/>
                                    </tr>
                                )}
                                {!this.state.isChangeSubjectInfo && this.state.subjectInfos.map((subjectInfo, index) => {
                                    const {id, subjectTeacher, subjectForm, subjectName} = subjectInfo;
                                    return (
                                        <tr key={id}>
                                            <td>{index + 1}</td>
                                            <td>{subjectName}</td>
                                            <td>{subjectForm}</td>
                                            <td>{subjectTeacher}</td>
                                            <td>
                                                <button
                                                    className="btn_view"
                                                    value={id}
                                                    onClick={event => this.openChangeSubjectInfo(event)}
                                                >
                                                    Изменить
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {this.state.isChangeSubjectInfo && this.state.subjectInfos.map((subjectInfo, index) => {
                                    const {id, subjectTeacher, subjectForm, subjectName} = subjectInfo;
                                    return (
                                        <tr key={id}>
                                            <td>{index + 1}</td>
                                            <td>{subjectName}</td>
                                            <td>{subjectForm}</td>
                                            <td>{subjectTeacher}</td>
                                            <td>
                                                <select
                                                    name="NSITId"
                                                    className="select_teacher"
                                                    value={this.state.values.NSITId}
                                                    onChange={event => this.change(event)}
                                                >
                                                    {this.state.teachers.map(teacher => {
                                                        const {id, name, surname, patronymic} = teacher;
                                                        const cred = surname + " " + name + " " + patronymic;
                                                        return (
                                                            <option value={id}>{cred}</option>
                                                        )
                                                    })}
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn_view"
                                                    value={id}
                                                    onClick={event => this.changeSubjectInfo(event)}
                                                >
                                                    Сохранить
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn_view"
                                                    value={id}
                                                    onClick={event => this.closeChangeSubjectInfo(event)}
                                                >
                                                    Закрыть
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
            </div>
        )
    }
}

export default AdminSubjectsPage;