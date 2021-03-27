import React from "react";
import axios from "axios";
import {
    goAdminGroupsPage,
    goAdminProfilePage,
    goAdminStudentsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
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
import validateRecPasswordsInput from "../validate/validateRecPasswordsInput";
import * as constants from '../constants';
import '../styles/recovery.css';
import '../styles/modal.css';

class ChangePasswordPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: true,
            isPasswordVisibility: false,
            data: {},
            errors: {},
            isStudent: false,
            isTeacher: false,
            isAdmin: false
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_STUDENT":
                    break;
                case "ROLE_TEACHER":
                    break;
                case "ROLE_ADMIN":
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
            this.getConfirmPassword(localStorage.getItem("email"));
        }
    }

    handlePasswordsInputChange(event) {
        this.setState({
            data: {
                ...this.state.data,
                [event.target.name]: event.target.value
            }
        });
    }

    handleChangePasswordVisibility() {
        this.setState((state) => ({
            isPasswordVisibility: !state.isPasswordVisibility
        }));
    }

    handleSubmitPasswordsInput(event) {
        event.preventDefault();
        if (Object.keys(this.state.errors).length === 0) {
            this.setState({
                errors: {}
            })
        }
        console.log(this.state);
        if (this.checkPasswordsInputError()) {
            if (this.checkConfirmPasswordsIdentity()) {
                this.changePasswordOnAccount();
            } else {
                this.setState({
                    errors: {
                        confirmPassword: 'Пароль-подтверждение не верен'
                    }
                })
            }
        }
    }

    handleCloseButtonClick() {
        this.setState({
            isModalOpen: false
        });
    }

    checkPasswordsInputError() {
        const errors = validateRecPasswordsInput(this.state.data);
        this.setState({
            errors: errors
        });
        return Object.keys(errors).length === 0;
    }

    checkConfirmPasswordsIdentity() {
        return this.state.data.emailConfirmPassword === this.state.data.confirmPassword;
    }

    getConfirmPassword(email) {
        axios.get(constants.DEFAULT_URL + constants.CONFIRMATION_URL + constants.PASSWORD_CHANGE_URL
            + constants.EMAIL_URL_PARAM + email, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                this.setState({
                    data: {
                        emailConfirmPassword: response.data["password"]
                    }
                });
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
                }
            });
    }

    changePasswordOnAccount() {
        const role = localStorage.getItem("role");
        let url = constants.DEFAULT_URL;
        if (role === constants.STUDENT_ROLE) {
            url += constants.STUDENTS_URL;
        } else if (role === constants.TEACHER_ROLE) {
            url += constants.TEACHERS_URL;
        } else if (role === constants.ADMIN_ROLE) {
            url += constants.ADMINS_URL;
        }
        axios.put(url, {
            id: localStorage.getItem("id"),
            password: this.state.data.newPassword
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(() => {
                this.setState({
                    isSuccess: true
                })
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                }
            })
    }

    goToProfilePage() {
        localStorage.removeItem("email");
        const role = localStorage.getItem("role");
        if (role === constants.STUDENT_ROLE) {
            goStudentProfilePage(this.props);
        } else if (role === constants.TEACHER_ROLE) {
            goTeacherProfilePage(this.props);
        } else if (role === constants.ADMIN_ROLE) {
            goAdminProfilePage(this.props);
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
                    <a onClick={() => goStudentProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goStudentRecordBookPage(this.props)}>Учителя</a>
                    <a onClick={() => goStudentGroupPage(this.props)}>Группа</a>
                    <a onClick={() => goStudentSubjectsPage(this.props)}>Главная</a>
                </div>
            );
        } else if (role === constants.TEACHER_ROLE) {
            return (
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a onClick={() => goTeacherProfilePage(this.props)}>Профиль</a>
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
                    <a onClick={() => goAdminProfilePage(this.props)}>Профиль</a>
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
                <div className="small_panel">
                    <svg className="recovery_image"/>
                </div>
                <div className="panel_second panel_ch">
                    <div className="begin_rec">
                        Изменить пароль
                    </div>
                    <form className="login" onSubmit={event => this.handleSubmitPasswordsInput(event)}>
                        <div className="part">
                            <div className="desc">
                                Пароль-подтвеждение
                            </div>
                            <input
                                name="confirmPassword"
                                className="data_input"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Enter confirmation password"
                                value={this.state.data.confirmPassword}
                                onChange={event => this.handlePasswordsInputChange(event)}
                            />
                        </div>
                        {this.state.errors.confirmPassword && (
                            <div className="error_panel_register">
                                {this.state.errors.confirmPassword}
                            </div>
                        )}
                        <div className="part_password">
                            <div className="desc">
                                Новый пароль
                            </div>
                            <input
                                name="newPassword"
                                className="data_input"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Введите новый пароль"
                                value={this.state.data.newPassword}
                                onChange={event => this.handlePasswordsInputChange(event)}
                            />
                            <div className="small_indent"/>
                            <input
                                name="repeatPassword"
                                className="data_input"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Введите пароль повторно"
                                value={this.state.data.repeatPassword}
                                onChange={event => this.handlePasswordsInputChange(event)}
                            />
                        </div>
                        <input type="checkbox"
                               id="check"
                               className="check_recovery"
                               onChange={() => this.handleChangePasswordVisibility()}
                        />
                        <label htmlFor="check">Посмотреть пароли</label>
                        {this.state.errors.newPassword && (
                            <div className="error_text_2">
                                {this.state.errors.newPassword}
                            </div>
                        )}
                        <button className="btn_rec">Изменить</button>
                    </form>
                </div>
                {this.state.isModalOpen && (
                    <React.Fragment>
                        {
                            <div className="modal_rm">
                                <div className="modal_body_rm success_rec">
                                    <h1>Information</h1>
                                    <h3>
                                        Пароль-подтверждение был выслан на вашу почту.
                                    </h3>
                                    <h3>
                                        Проверьте её.
                                    </h3>
                                    <button
                                        className="btn_rm"
                                        onClick={() => this.handleCloseButtonClick()}
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        }
                    </React.Fragment>
                )}
                {this.state.isSuccess && (
                    <React.Fragment>
                        {
                            <div className="modal_rm">
                                <div className="modal_body_rm success_rec">
                                    <h1>Success</h1>
                                    <h3>
                                        Пароль успешно обновлен.
                                        Нажмите на кнопку, чтобы выйти.
                                    </h3>
                                    <button
                                        className="btn_rm"
                                        onClick={() => this.goToProfilePage()}
                                    >
                                        Завершить
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

export default ChangePasswordPage;