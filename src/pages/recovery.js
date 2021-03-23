import React from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import validateRecIDInput from "../validate/validateRecIDInput";
import validateRecPasswordsInput from "../validate/validateRecPasswordsInput";
import * as constants from '../constants';
import '../styles/recovery.css';
import '../styles/modal.css';
import '../styles/success.css';

class RecoveryPasswordPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoginCorrect: false,
            isModalOpen: false,
            isSuccess: false,
            isPasswordVisibility: false,
            id: '',
            data: {},
            role: -1,
            errors: {},
            emailError: 0
        }
    }

    handleIDInputChange(event) {
        this.setState({
            id: event.target.value
        });
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

    handleSubmitIDInput(event) {
        event.preventDefault();
        if (Object.keys(this.state.errors).length === 0) {
            this.setState({
                errors: {}
            });
        }
        if (this.checkIDInputError()) {
            this.checkIsStudentIDCorrectOnServer(this.state.id);
            if (this.state.emailError === 1) {
                this.checkIsTeacherIDCorrectOnServer(this.state.id);
            }
            if (this.state.emailError === 2) {
                this.state.checkIsAdminIDCorrectOnServer(this.state.id);
            }
        }
    }

    handleSubmitPasswordsInput(event) {
        event.preventDefault();
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
                        confirmPassword: 'Пароль-подтверждение не совпадает'
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

    checkIDInputError() {
        const errors = validateRecIDInput(this.state.id);
        this.setState({
            errors: errors
        });
        return Object.keys(errors).length === 0;
    }

    checkPasswordsInputError() {
        const errors = validateRecPasswordsInput(this.state.data);
        this.setState({
            errors: errors
        });
        return Object.keys(errors).length === 0;
    }

    checkIsStudentIDCorrectOnServer(id) {
        axios.get(constants.DEFAULT_URL + constants.STUDENTS_URL + constants.SLASH + id + constants.EMAIL_URL)
            .then(response => {
                this.setState({
                    data: {
                        confirmPassword: '',
                        newPassword: '',
                        repeatPassword: ''
                    },
                    isLoginCorrect: true,
                    isModalOpen: true,
                    role: 0
                });
                this.getConfirmPassword(response.data["email"]);
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goServerErrorPage(this.props);
                } else {
                    this.setState({
                        data: {
                            id: ''
                        },
                        emailError: 1
                    });
                }
            })
    }

    checkIsTeacherIDCorrectOnServer(id) {
        axios.get(constants.DEFAULT_URL + constants.TEACHERS_URL + constants.SLASH + id + constants.EMAIL_URL)
            .then(response => {
                this.setState({
                    data: {
                        confirmPassword: '',
                        newPassword: '',
                        repeatPassword: ''
                    },
                    isLoginCorrect: true,
                    isModalOpen: true,
                    role: 1
                });
                this.getConfirmPassword(response.data["email"]);
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goServerErrorPage(this.props);
                } else {
                    this.setState({
                        data: {
                            id: ''
                        },
                        emailError: 2
                    });
                }
            })
    }

    checkIsAdminIDCorrectOnServer(id) {
        axios.get(constants.DEFAULT_URL + constants.ADMINS_URL + constants.SLASH + id + constants.EMAIL_URL)
            .then(response => {
                this.setState({
                    data: {
                        confirmPassword: '',
                        newPassword: '',
                        repeatPassword: ''
                    },
                    isLoginCorrect: true,
                    isModalOpen: true,
                    role: 2
                });
                this.getConfirmPassword(response.data["email"]);
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goServerErrorPage(this.props);
                } else {
                    this.setState({
                        data: {
                            id: ''
                        },
                        errors: {
                            id: 'ID не верен'
                        }
                    });
                }
            })
    }

    checkConfirmPasswordsIdentity() {
        return this.state.data.emailConfirmPassword === this.state.data.confirmPassword;
    }

    getConfirmPassword(email) {
        axios.get(constants.DEFAULT_URL + constants.CONFIRMATION_URL + constants.PASSWORD_REPAIR_URL
            + constants.EMAIL_URL_PARAM + email)
            .then(response => {
                this.setState({
                    data: {
                        emailConfirmPassword: response.data["password"]
                    }
                });
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goServerErrorPage(this.props);
                }
            });
    }

    changePasswordOnAccount() {
        let url = constants.DEFAULT_URL;
        if (this.state.role === 0) {
            url += constants.STUDENTS_URL;
        } else if (this.state.role === 1) {
            url += constants.TEACHERS_URL;
        } else if (this.state.role === 2) {
            url += constants.ADMINS_URL;
        }
        axios.put(url, {
            id: this.state.id,
            password: this.state.data.newPassword
        })
            .then(() => {
                this.setState({
                    isSuccess: true
                })
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goServerErrorPage(this.props);
                }
            })
    }

    render() {
        if (this.state.isSuccess) {
            return (
                <div className="main_success">
                    <div className="panel_success">
                        <svg className="img_success"/>
                    </div>
                    <div className="text_success">
                        <h1>Password successfully change</h1>
                        <Link to="/login">Click to go to login page.</Link>
                    </div>
                </div>
            )
        } else {
            if (this.state.isLoginCorrect) {
                return (
                    <div className="main">
                        <div className="small_panel">
                            <svg className="recovery_image"/>
                        </div>
                        <div className="panel_second">
                            <div className="begin_rec">
                                Password recovery in System
                            </div>
                            <form className="login" onSubmit={event => this.handleSubmitPasswordsInput(event)}>
                                <div className="part">
                                    <div className="desc">
                                        Пароль-подтверждение
                                    </div>
                                    <input
                                        name="confirmPassword"
                                        className="data_input"
                                        type={this.state.isPasswordVisibility ? "text" : "password"}
                                        placeholder="Введите пароль-подтверждение"
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
                                        placeholder="Повторите новый пароль"
                                        value={this.state.data.repeatPassword}
                                        onChange={event => this.handlePasswordsInputChange(event)}
                                    />
                                </div>
                                <input type="checkbox"
                                       id="check"
                                       className="check_recovery"
                                       onChange={() => this.handleChangePasswordVisibility()}
                                />
                                <label htmlFor="check">Show passwords</label>
                                {this.state.errors.newPassword && (
                                    <div className="error_text_2">
                                        {this.state.errors.newPassword}
                                    </div>
                                )}
                                <button className="btn_rec">Закончить восстановление</button>
                            </form>
                        </div>
                        {this.state.isModalOpen && (
                            <React.Fragment>
                                {
                                    <div className="modal_rm">
                                        <div className="modal_body_rm success_rec">
                                            <h1>Information</h1>
                                            <h3>
                                                Пароль для подтвержения был выслан на вашу почту.
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
                    </div>
                )
            } else {
                return (
                    <div className="main">
                        <div className="small_panel">
                            <svg className="recovery_image"/>
                        </div>
                        <div className="panel_first">
                            <div className="begin_rec">
                                Восстановление пароля
                            </div>
                            <form className="login" onSubmit={event => this.handleSubmitIDInput(event)}>
                                <div className="part">
                                    <div className="desc">
                                        ID
                                    </div>
                                    <input
                                        name="id"
                                        className="data_input"
                                        type="text"
                                        placeholder="Введите ваш ID"
                                        value={this.state.id}
                                        onChange={event => this.handleIDInputChange(event)}
                                    />
                                </div>
                                {this.state.errors.id && (
                                    <div className="error_text">
                                        {this.state.errors.id}
                                    </div>
                                )}
                                <button className="btn_rec first_indent">Начать восстановление</button>
                            </form>
                        </div>
                    </div>
                )
            }
        }
    }
}

export default RecoveryPasswordPage;