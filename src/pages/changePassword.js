import React from "react";
import axios from "axios";
import {
    goAdminGroupsPage,
    goAdminProfilePage,
    goAdminRegisterStudentsPage,
    goAdminsPage,
    goAdminStudentsPage,
    goAdminSubjectsPage,
    goAdminTeachersPage,
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
import validateRecPasswordsInput from "../validate/validateRecPasswordsInput";
import {
    ADMIN_ROLE,
    CONFIRMATION_URL,
    DEFAULT_URL,
    EMAIL_URL_PARAM,
    PASSWORD_CHANGE_URL,
    STUDENT_ROLE,
    TEACHER_ROLE
} from '../constants';
import '../styles/recovery.css';
import '../styles/modal.css';
import handleDefaultError from "../handle/handleDefaultReuqestError";

class ChangePasswordPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isStart: true,
            isPasswordVisibility: false,
            data: {},
            errors: {}
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_STUDENT":
                    this.setState({
                        url: DEFAULT_URL + "/students/password"
                    });
                    break;
                case "ROLE_TEACHER":
                    this.setState({
                        url: DEFAULT_URL + "/teachers/password"
                    });
                    break;
                case "ROLE_ADMIN":
                    this.setState({
                        url: DEFAULT_URL + "/admins/password"
                    });
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
            this.getConfirmPassword(localStorage.getItem("email"));
        }
    }

    change(event) {
        this.setState({
            data: {
                ...this.state.data,
                [event.target.name]: event.target.value
            }
        });
    }

    changeVisibility() {
        this.setState((state) => ({
            isPasswordVisibility: !state.isPasswordVisibility
        }));
    }

    changePassword() {
        if (Object.keys(this.state.errors).length === 0) {
            this.setState({
                errors: {}
            })
        }
        if (this.checkPasswordsInputError()) {
            if (this.checkConfirmPasswordsIdentity()) {
                this.changePasswordOnAccount();
            } else {
                this.setState({
                    errors: {
                        confirmPassword: 'Пароль-подтверждение не верен'
                    }
                });
            }
        }
    }

    close() {
        this.setState({
            isStart: false
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
        axios.get(DEFAULT_URL + CONFIRMATION_URL + PASSWORD_CHANGE_URL + EMAIL_URL_PARAM + email, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then((response) => {
            this.setState({
                data: {
                    emailConfirmPassword: response.data["password"]
                }
            });
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    changePasswordOnAccount() {
        axios.put(this.state.url, {
            userId: localStorage.getItem("id"),
            password: this.state.data.newPassword
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(() => {
            this.setState({
                isSuccess: true
            })
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    goToProfilePage() {
        localStorage.removeItem("email");
        const role = localStorage.getItem("role");
        if (role === STUDENT_ROLE) {
            goStudentProfilePage(this.props);
        } else if (role === TEACHER_ROLE) {
            goTeacherProfilePage(this.props);
        } else if (role === ADMIN_ROLE) {
            goAdminProfilePage(this.props);
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
                    <a onClick={() => goStudentProfilePage(this.props)}>Профиль</a>
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
                    <a onClick={() => goTeacherProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goTeacherExamPage(this.props)}>Информация</a>
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
                    <a onClick={() => goAdminProfilePage(this.props)}>Профиль</a>
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
                <div className="small_panel">
                    <svg className="recovery_image"/>
                </div>
                <div className="panel_second panel_ch">
                    <div className="begin_rec">
                        Изменить пароль
                    </div>
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
                            onChange={event => this.change(event)}
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
                            onChange={event => this.change(event)}
                        />
                        <div className="small_indent"/>
                        <input
                            name="repeatPassword"
                            className="data_input"
                            type={this.state.isPasswordVisibility ? "text" : "password"}
                            placeholder="Введите пароль повторно"
                            value={this.state.data.repeatPassword}
                            onChange={event => this.change(event)}
                        />
                    </div>
                    <input type="checkbox"
                           id="check"
                           className="check_recovery"
                           onChange={() => this.changeVisibility()}
                    />
                    <label htmlFor="check">Посмотреть пароли</label>
                    {this.state.errors.newPassword && (
                        <div className="error_text_2">
                            {this.state.errors.newPassword}
                        </div>
                    )}
                    <button className="btn_rec" onClick={() => this.changePassword()}>Изменить</button>
                </div>
                {this.state.isStart && (
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
                                        onClick={() => this.close()}
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