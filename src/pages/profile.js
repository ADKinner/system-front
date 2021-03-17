import React from "react";
import axios from "axios";
import * as constants from "../constants";
import '../styles/recovery.css';
import '../styles/modal.css';
import '../styles/profile.css'

class ProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            student: {
                group: ''
            },
            teacher: {
                cathedra: ''
            },
            admin: {
                post: ''
            },
            user: {
                id: '',
                name: '',
                surname: '',
                patronymic: '',
                password: '',
                email: ''

            },
            isStudent: false,
            isTeacher: false,
            isAdmin: false
        };
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (role === null) {
            this.goToLoginPage();
        } else {
            switch (role) {
                case "ROLE_STUDENT":
                    this.setState({isStudent: true});
                    this.getStudentData();
                    break;
                case "ROLE_TEACHER":
                    this.setState({isTeacher: true});
                    this.getTeacherData();
                    break;
                case "ROLE_ADMIN":
                    this.setState({isAdmin: true});
                    this.getAdminData();
                    break;
                default:
                    this.goToLoginPage();
                    break;
            }
        }
    }

    getStudentData() {
        axios.get(constants.DEFAULT_URL + constants.STUDENTS_URL + constants.SLASH +
            localStorage.getItem("id"), {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                this.setState({
                    user: {
                        id: response.data["id"],
                        name: response.data["firstName"],
                        surname: response.data["lastName"],
                        patronymic: response.data["patronymic"],
                        password: response.data["password"],
                        email: response.data["email"],
                    },
                    student: {
                        group: response.data["group"]["number"]
                    }
                })
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 500) {
                    this.goToServerErrorPage();
                } else if (error.response.status === 401) {
                    this.goToLoginPage();
                }
            });
    }

    getTeacherData() {
        axios.get(constants.DEFAULT_URL + constants.TEACHERS_URL + constants.SLASH +
            localStorage.getItem("id"), {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                this.setState({
                    user: {
                        id: response.data["id"],
                        name: response.data["firstName"],
                        surname: response.data["lastName"],
                        patronymic: response.data["patronymic"],
                        password: response.data["password"],
                        email: response.data["email"],
                    },
                    teacher: {
                        cathedra: response.data["cathedra"]["abbreviation"]
                    }
                })
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 500) {
                    this.goToServerErrorPage();
                } else if (error.response.status === 401) {
                    this.goToLoginPage();
                }
            });
    }

    getAdminData() {
        axios.get(constants.DEFAULT_URL + constants.ADMINS_URL + constants.SLASH +
            localStorage.getItem("id"), {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                this.setState({
                    user: {
                        id: response.data["id"],
                        name: response.data["firstName"],
                        surname: response.data["lastName"],
                        patronymic: response.data["patronymic"],
                        password: response.data["password"],
                        email: response.data["email"],
                    },
                    admin: {
                        post: response.data["adminPost"]["name"]
                    }
                })
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 500) {
                    this.goToServerErrorPage();
                } else if (error.response.status === 401) {
                    this.goToLoginPage();
                }
            });
    }

    handleLogoutClick() {
        this.goToLoginPage()
    }

    handleProfileClick() {
        this.props.history.push('/student/profile');
    }

    handleGradesClick() {
        this.props.history.push('/student/grades');
    }

    handleGroupClick() {
        this.props.history.push('/student/group');
    }

    handleMainClick(role) {
        if (role.localeCompare(constants.STUDENT_ROLE)) {
            this.props.history.push('/student');
        } else if (role.localeCompare(constants.TEACHER_ROLE)) {
            this.props.history.push('/teacher');
        } else if (role.localeCompare(constants.ADMIN_ROLE)) {
            this.props.history.push('/admin');
        }
    }

    goToLoginPage() {
        //localStorage.clear();
        this.props.history.push('/login');
    }

    goToChangePasswordPage() {
        localStorage.setItem("email", this.state.user.email);
        this.props.history.push('/change/password');
    }

    goToChangeEmailPage() {
        this.props.history.push('/change/email');
    }

    render() {
        return (
            <div className="main_p_s">
                {this.state.isStudent && (
                    <div className="bar_p">
                        <div className="sys_image"/>
                        <div className="sys_name">SYSTEM</div>
                        <a className="logout" onClick={() => this.handleLogoutClick()}>Logout</a>
                        <a className="active" onClick={() => this.handleProfileClick()}>Profile</a>
                        <a onClick={() => this.handleGradesClick()}>Grades</a>
                        <a onClick={() => this.handleGroupClick()}>Group</a>
                        <a onClick={() => this.handleMainClick(localStorage.getItem("role"))}>Main</a>
                    </div>
                )}
                {this.state.isTeacher && (
                    <div className="bar_p">
                        <div className="sys_image"/>
                        <div className="sys_name">SYSTEM</div>
                        <a className="logout" onClick={() => this.handleLogoutClick()}>Logout</a>
                        <a className="active" onClick={() => this.handleProfileClick()}>Profile</a>
                        <a onClick={() => this.handleMainClick(localStorage.getItem("role"))}>Main</a>
                    </div>
                )}
                {this.state.isAdmin && (
                    <div className="bar_p">
                        <div className="sys_image"/>
                        <div className="sys_name">SYSTEM</div>
                        <a className="logout" onClick={() => this.handleLogoutClick()}>Logout</a>
                        <a className="active" onClick={() => this.handleProfileClick()}>Profile</a>
                        <a onClick={() => this.handleMainClick(localStorage.getItem("role"))}>Main</a>
                    </div>
                )}
                <div className="panel">
                    <div className="user_panel">
                        <div className="user_image_st"/>
                        <div className="user_id">ID: {this.state.user.id}</div>
                    </div>
                    <div className="user_details_panel">
                        <div className="main_text">Student Profile</div>
                        <div className="user_detail">
                            <div className="user_detail_name">Name:</div>
                            <div className="user_detail_value">{this.state.user.name}</div>
                        </div>
                        <div className="indent"/>
                        <div className="user_detail">
                            <div className="user_detail_name">Surname:</div>
                            <div className="user_detail_value">{this.state.user.surname}</div>
                        </div>
                        <div className="indent"/>
                        <div className="user_detail">
                            <div className="user_detail_name">Patronymic:</div>
                            <div className="user_detail_value">{this.state.user.patronymic}</div>
                        </div>
                        <div className="indent"/>
                        <div className="user_detail">
                            <div className="user_detail_name">Email:</div>
                            <div className="user_detail_value">{this.state.user.email}</div>
                        </div>
                        <div className="indent"/>
                        {this.state.isStudent && (
                            <div className="user_detail">
                                <div className="user_detail_name">Group:</div>
                                <div className="user_detail_value">{this.state.student.group}</div>
                            </div>
                        )}
                        {this.state.isTeacher && (
                            <div className="user_detail">
                                <div className="user_detail_name">Cathedra:</div>
                                <div className="user_detail_value">{this.state.teacher.cathedra}</div>
                            </div>
                        )}
                        {this.state.isAdmin && (
                            <div className="user_detail">
                                <div className="user_detail_name">Post:</div>
                                <div className="user_detail_value">{this.state.admin.post}</div>
                            </div>
                        )}
                        <button
                            className="btn_pr"
                            onClick={() => this.goToChangePasswordPage()}
                        >
                            Change password
                        </button>
                        <button
                            className="btn_pr"
                            onClick={() => this.goToChangeEmailPage()}
                        >
                            Change email
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfilePage;