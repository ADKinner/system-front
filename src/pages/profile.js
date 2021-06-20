import React from "react";
import axios from "axios";
import {
    ADMIN_ROLE,
    ADMINS_URL,
    DEFAULT_URL,
    S_PARAM,
    STUDENT_ROLE,
    STUDENTS_URL,
    TEACHER_ROLE,
    TEACHERS_URL
} from "../constants";
import {
    goAdminGroupsPage,
    goAdminProfilePage,
    goAdminRegisterStudentsPage,
    goAdminsPage,
    goAdminStudentsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
    goChangePasswordPage,
    goLoginPage,
    goStudentGroupPage,
    goStudentProfilePage,
    goStudentRecordBookPage,
    goStudentSubjectsPage,
    goTeacherExamPage,
    goTeacherLessonPage,
    goTeacherMainPage,
    goTeacherProfilePage
} from "../redirect";
import '../styles/modal.css';
import '../styles/main.css';
import handleProfileDefaultError from "../handle/handleProfileRequestError";

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
            switch (role) {
                case "ROLE_STUDENT":
                    this.getStudent();
                    break;
                case "ROLE_TEACHER":
                    this.getTeacher();
                    break;
                case "ROLE_ADMIN":
                    this.getAdmin();
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getStudent() {
        const studentId = localStorage.getItem("id");
        axios.get(DEFAULT_URL + STUDENTS_URL + S_PARAM + studentId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                user: {
                    id: response.data["id"],
                    name: response.data["name"],
                    surname: response.data["surname"],
                    patronymic: response.data["patronymic"],
                    email: response.data["email"],
                },
                student: {
                    group: response.data["group"],
                    term: response.data["term"],
                    speciality: response.data["speciality"],
                    faculty: response.data["faculty"]
                }
            })
        }).catch((error) => {
            handleProfileDefaultError(this.props, error.response.status);
        });
    }

    getTeacher() {
        const teacherId = localStorage.getItem("id");
        axios.get(DEFAULT_URL + TEACHERS_URL + S_PARAM + teacherId, {
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
                        cathedra: response.data["cathedra"],
                        post: response.data["position"]
                    }
                })
            }).catch((error) => {
            handleProfileDefaultError(this.props, error.response.status);
        });
    }

    getAdmin() {
        const adminId = localStorage.getItem("id");
        axios.get(DEFAULT_URL + ADMINS_URL + S_PARAM + adminId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                user: {
                    id: response.data["id"],
                    name: response.data["name"],
                    surname: response.data["surname"],
                    patronymic: response.data["patronymic"],
                    email: response.data["email"],
                },
                admin: {
                    post: response.data["position"]
                }
            })
        }).catch((error) => {
            handleProfileDefaultError(this.props, error.response.status);
        });
    }

    renderAdditionalData() {
        const role = localStorage.getItem("role");
        if (role === STUDENT_ROLE) {
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
        } else if (role === TEACHER_ROLE) {
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
        } else if (role === ADMIN_ROLE) {
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
        if (role === STUDENT_ROLE) {
            return (
                <div className="user_image user_image_st"/>
            );
        } else if (role === TEACHER_ROLE) {
            return (
                <div className="user_image user_image_t"/>
            );
        } else if (role === ADMIN_ROLE) {
            return (
                <div className="user_image user_image_a"/>
            );
        }
    }

    renderBarButtons() {
        const role = localStorage.getItem("role");
        if (role === STUDENT_ROLE) {
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
        } else if (role === TEACHER_ROLE) {
            return (
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a className="active" onClick={() => goTeacherProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goTeacherExamPage(this.props)}>Зачёт/экзамен</a>
                    <a onClick={() => goTeacherLessonPage(this.props)}>Занятие</a>
                    <a onClick={() => goTeacherMainPage(this.props)}>Главная</a>
                </div>
            );
        } else if (role === ADMIN_ROLE) {
            return (
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a className="active" onClick={() => goAdminProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goAdminsPage(this.props)}>Администраторы</a>
                    <a onClick={() => goAdminTeachersPage(this.props)}>Учителя</a>
                    <a onClick={() => goAdminGroupsPage(this.props)}>Группы</a>
                    <a onClick={() => goAdminRegisterStudentsPage(this.props)}>Регистрация студентов</a>
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