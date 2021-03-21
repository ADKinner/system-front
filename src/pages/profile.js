import React from "react";
import axios from "axios";
import * as constants from "../constants";
import {
    goLoginPage,
    goProfilePage,
    goMainPage,
    goStudentGroupPage,
    goChangePasswordPage,
    goServerErrorPage,
    goStudentTeacherPage
} from "../redirect";
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
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
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
                    goLoginPage(this.props);
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
                        name: response.data["name"],
                        surname: response.data["surname"],
                        patronymic: response.data["patronymic"],
                        email: response.data["email"],
                    },
                    student: {
                        group: response.data["group"]["id"],
                        speciality: response.data["group"]["term"]["speciality"]["name"],
                        faculty: response.data["group"]["term"]["speciality"]["cathedra"]["faculty"]["name"]
                    }
                })
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
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
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
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
                console.log(error);
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
                }
            });
    }

    handleMainClick(role) {
        if (role === constants.STUDENT_ROLE) {
            goMainPage(this.props, '/student');
        } else if (role === constants.TEACHER_ROLE) {
            goMainPage(this.props, '/teacher');
        } else if (role === constants.ADMIN_ROLE) {
            goMainPage(this.props, '/admin');
        }
    }

    renderTitle() {
        const role = localStorage.getItem("role");
        if (role === constants.STUDENT_ROLE) {
            return(
                <div>
                    <div className="main_text">
                        Student Profile
                    </div>
                </div>
            );
        } else if (role === constants.TEACHER_ROLE) {
            return(
                <div>
                    <div className="main_text">
                        Teacher Profile
                    </div>
                </div>
            );
        } else if (role === constants.ADMIN_ROLE) {
            return(
                <div>
                    <div className="main_text">
                        Admin Profile
                    </div>
                </div>
            );
        }
    }

    renderAdditionalData() {
        const role = localStorage.getItem("role");
        if (role === constants.STUDENT_ROLE) {
            return(
                <div>
                    <div className="user_detail">
                        <div className="user_detail_name">Group:</div>
                        <div className="user_detail_value">{this.state.student.group}</div>
                    </div>
                    <div className="user_detail">
                        <div className="user_detail_name">Speciality:</div>
                        <div className="user_detail_value">{this.state.student.speciality}</div>
                    </div>
                    <div className="user_detail">
                        <div className="user_detail_name">Faculty:</div>
                        <div className="user_detail_value">{this.state.student.faculty}</div>
                    </div>
                </div>
            );
        } else if (role === constants.TEACHER_ROLE) {
            return(
                <div className="add_data">
                    <div className="user_detail">
                        <div className="user_detail_name">Cathedra:</div>
                        <div className="user_detail_value">{this.state.teacher.cathedra}</div>
                    </div>
                    <div className="user_detail">
                        <div className="user_detail_name">Post:</div>
                        <div className="user_detail_value">{this.state.teacher.post}</div>
                    </div>
                </div>
            );
        } else if (role === constants.ADMIN_ROLE) {
            return(
                <div>
                    <div className="user_detail">
                        <div className="user_detail_name">Post:</div>
                        <div className="user_detail_value">{this.state.admin.post}</div>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="main_p_s">
                {this.state.isStudent && (
                    <div className="bar_p">
                        <div className="sys_image"/>
                        <div className="sys_name">SYSTEM</div>
                        <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                        <a className="active" onClick={() => goProfilePage(this.props, '/student')}>Profile</a>
                        <a onClick={() => goStudentTeacherPage(this.props)}>Teachers</a>
                        <a onClick={() => goStudentGroupPage(this.props)}>Group</a>
                        <a onClick={() => this.handleMainClick(localStorage.getItem("role"))}>Main</a>
                    </div>
                )}
                {this.state.isTeacher && (
                    <div className="bar_p">
                        <div className="sys_image"/>
                        <div className="sys_name">SYSTEM</div>
                        <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                        <a className="active" onClick={() => goProfilePage(this.props, '/teacher')}>Profile</a>
                        <a onClick={() => this.handleMainClick(localStorage.getItem("role"))}>Main</a>
                    </div>
                )}
                {this.state.isAdmin && (
                    <div className="bar_p">
                        <div className="sys_image"/>
                        <div className="sys_name">SYSTEM</div>
                        <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                        <a className="active" onClick={() => goProfilePage(this.props, '/admin')}>Profile</a>
                        <a onClick={() => this.handleMainClick(localStorage.getItem("role"))}>Main</a>
                    </div>
                )}
                <div className="panel">
                    <div className="user_panel">
                        <div className="user_image_st"/>
                        <div className="user_id">ID: {this.state.user.id}</div>
                    </div>
                    <div className="user_details_panel">
                        {this.renderTitle()}
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
                        {this.renderAdditionalData()}
                        <button
                            className="btn_pr"
                            onClick={() => goChangePasswordPage(this.props, this.state.user.email)}
                        >
                            Change password
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfilePage;