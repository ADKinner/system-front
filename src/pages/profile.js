import React from "react";
import axios from "axios";
import * as constants from "../constants";
import {
    goAdminGroupsPage,
    goAdminProfilePage, goAdminsPage, goAdminStudentsPage, goAdminSubjectsPage, goAdminTeachersPage,
    goChangePasswordPage,
    goLoginPage,
    goServerErrorPage,
    goStudentGroupPage,
    goStudentSubjectsPage,
    goStudentProfilePage,
    goStudentRecordBookPage,
    goTeacherInfoPage,
    goTeacherLessonPage,
    goTeacherMainPage,
    goTeacherProfilePage
} from "../redirect";
import '../styles/modal.css';
import '../styles/admin.css';

class ProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            student: {},
            teacher: {},
            admin: {}
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            const id = localStorage.getItem("id");
            switch (role) {
                case "ROLE_STUDENT":
                    this.getStudent(id);
                    break;
                case "ROLE_TEACHER":
                    this.getTeacher(id);
                    break;
                case "ROLE_ADMIN":
                    this.getAdmin(id);
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getStudent(id) {
        axios.get(constants.DEFAULT_URL + constants.STUDENTS_URL + constants.SLASH + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    user: {
                        id: response.data["id"],
                        name: response.data["name"],
                        surname: response.data["surname"],
                        patronymic: response.data["patronymic"],
                        email: response.data["email"],
                    },
                    student: {
                        group: response.data["group"]["id"],
                        term: response.data["group"]["term"]["number"],
                        speciality: response.data["group"]["term"]["speciality"]["name"],
                        faculty: response.data["group"]["term"]["speciality"]["cathedra"]["faculty"]["name"]
                    }
                })
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401 || error.response.status === 404) {
                    goLoginPage(this.props);
                }
            });
    }

    getTeacher(id) {
        axios.get(constants.DEFAULT_URL + constants.TEACHERS_URL + constants.SLASH + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    user: {
                        id: response.data["id"],
                        name: response.data["name"],
                        surname: response.data["surname"],
                        patronymic: response.data["patronymic"],
                        email: response.data["email"],
                    },
                    teacher: {
                        cathedra: response.data["cathedra"]["name"],
                        post: response.data["post"]["name"]
                    }
                })
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401 || error.response.status === 404) {
                    goLoginPage(this.props);
                }
            });
    }

    getAdmin(id) {
        axios.get(constants.DEFAULT_URL + constants.ADMINS_URL + constants.SLASH + id, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                this.setState({
                    user: {
                        id: response.data["id"],
                        name: response.data["name"],
                        surname: response.data["surname"],
                        patronymic: response.data["patronymic"],
                        email: response.data["email"],
                    },
                    admin: {
                        post: response.data["post"]["name"]
                    }
                })
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401 || error.response.status === 404) {
                    goLoginPage(this.props);
                }
            });
    }

    renderAdditionalData() {
        const role = localStorage.getItem("role");
        if (role === constants.STUDENT_ROLE) {
            return (
                <div>
                    <div className="user_detail">
                        <div className="user_detail_name">Группа:</div>
                        <div className="user_detail_value">{this.state.student.group}</div>
                    </div>
                    <div className="indent"/>
                    <div className="user_detail">
                        <div className="user_detail_name">Семестр:</div>
                        <div className="user_detail_value">{this.state.student.term}</div>
                    </div>
                    <div className="indent"/>
                    <div className="user_detail">
                        <div className="user_detail_name">Специальность:</div>
                        <div className="user_detail_value">{this.state.student.speciality}</div>
                    </div>
                    <div className="indent"/>
                    <div className="user_detail">
                        <div className="user_detail_name">Факультет:</div>
                        <div className="user_detail_value">{this.state.student.faculty}</div>
                    </div>
                </div>
            );
        } else if (role === constants.TEACHER_ROLE) {
            return (
                <div className="add_data">
                    <div className="user_detail">
                        <div className="user_detail_name">Кафедра:</div>
                        <div className="user_detail_value">{this.state.teacher.cathedra}</div>
                    </div>
                    <div className="indent"/>
                    <div className="user_detail">
                        <div className="user_detail_name">Должность:</div>
                        <div className="user_detail_value">{this.state.teacher.post}</div>
                    </div>
                </div>
            );
        } else if (role === constants.ADMIN_ROLE) {
            return (
                <div className="add_data">
                    <div className="user_detail">
                        <div className="user_detail_name">Должность:</div>
                        <div className="user_detail_value">{this.state.admin.post}</div>
                    </div>
                </div>
            );
        }
    }

    renderProfileImage() {
        const role = localStorage.getItem("role");
        if (role === constants.STUDENT_ROLE) {
            return (
                <div className="user_image user_image_st"/>
            );
        } else if (role === constants.TEACHER_ROLE) {
            return (
                <div className="user_image user_image_t"/>
            );
        } else if (role === constants.ADMIN_ROLE) {
            return (
                <div className="user_image user_image_a"/>
            );
        }
    }

    renderBarButtons() {
        const role = localStorage.getItem("role");
        if (role === constants.STUDENT_ROLE) {
            return (
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a className="active" onClick={() => goStudentProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goStudentRecordBookPage(this.props)}>Зачётка</a>
                    <a onClick={() => goStudentGroupPage(this.props)}>Группа</a>
                    <a onClick={() => goStudentSubjectsPage(this.props)}>Предметы</a>
                </div>
            );
        } else if (role === constants.TEACHER_ROLE) {
            return (
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a className="active" onClick={() => goTeacherProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goTeacherInfoPage(this.props)}>Информация</a>
                    <a onClick={() => goTeacherLessonPage(this.props)}>Занятие</a>
                    <a onClick={() => goTeacherMainPage(this.props)}>Главная</a>
                </div>
            );
        } else if (role === constants.ADMIN_ROLE) {
            return (
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a className="active" onClick={() => goAdminProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goAdminsPage(this.props)}>Администраторы</a>
                    <a onClick={() => goAdminTeachersPage(this.props)}>Учителя</a>
                    <a onClick={() => goAdminGroupsPage(this.props)}>Группы</a>
                    <a onClick={() => goAdminStudentsPage(this.props)}>Студенты</a>
                    <a onClick={() => goAdminSubjectsPage(this.props)}>Предметы</a>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="main">
                {this.renderBarButtons()}
                <div className="panel">
                    <div className="user_panel">
                        {this.renderProfileImage()}
                        <div className="user_id">ID: {this.state.user.id}</div>
                    </div>
                    <div className="user_details_panel">
                        <div>
                            <div className="main_text">
                                Профиль
                            </div>
                        </div>
                        <div className="user_detail">
                            <div className="user_detail_name">Фамилия:</div>
                            <div className="user_detail_value">{this.state.user.surname}</div>
                        </div>
                        <div className="indent"/>
                        <div className="user_detail">
                            <div className="user_detail_name">Имя:</div>
                            <div className="user_detail_value">{this.state.user.name}</div>
                        </div>
                        <div className="indent"/>
                        <div className="user_detail">
                            <div className="user_detail_name">Отчество:</div>
                            <div className="user_detail_value">{this.state.user.patronymic}</div>
                        </div>
                        <div className="indent"/>
                        <div className="user_detail">
                            <div className="user_detail_name">Email:</div>
                            <div className="user_detail_value">{this.state.user.email}</div>
                        </div>
                        <div className="indent"/>
                        {this.renderAdditionalData()}
                        <button
                            className="btn_add change"
                            onClick={() => goChangePasswordPage(this.props, this.state.user.email)}
                        >
                            Сменить пароль
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfilePage;