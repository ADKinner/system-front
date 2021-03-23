import React from "react";
import axios from 'axios';
import validateRegInput from "../validate/validateRegInput";
import {goServerErrorPage} from "../redirect";
import {Link} from "react-router-dom";
import * as constants from '../constants';
import '../styles/register.css';
import '../styles/modal.css';
import '../styles/success.css';

class RegisterPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSubmitted: false,
            isInputConfirmed: false,
            isPasswordConfirmed: false,
            isPasswordVisibility: false,
            isReady: false,
            isSuccess: false,
            confirmPassword: '',
            values: {
                id: '',
                studentIDPassword: '',
                password: '',
                confirmPassword: '',
                emailConfirmPassword: ''
            },
            student: {
                id: '',
                name: '',
                surname: '',
                patronymic: '',
                email: '',
                groupId: ''
            },
            errors: {}
        };
    }

    handleSubmitRegInput(event) {
        event.preventDefault();
        const val = this.checkInputErrors();
        this.setState({
            isSubmitted: val
        });
        if (val) {
            this.checkStudentData();
        }
        this.setState({
            isReady: true
        });
    }

    handleRegInputChange(event) {
        this.setState({
            values: {
                ...this.state.values,
                [event.target.name]: event.target.value
            }
        });
    }

    handleChangePasswordVisibility() {
        this.setState((state) => ({
            isPasswordVisibility: !state.isPasswordVisibility
        }));
    }

    handleConfirmPasswordInputChange(event) {
        this.setState({
            values: {
                emailConfirmPassword: event.target.value
            }
        });
    }

    handleCloseButtonClick() {
        this.setState({
            isSubmitted: false
        });
    }

    checkInputErrors() {
        const errors = validateRegInput(this.state.values);
        this.setState({
            errors: errors
        });
        return Object.keys(errors).length === 0;
    }

    checkStudentData() {
        axios.get(constants.DEFAULT_URL + constants.REGISTRATION_DATA_URL + constants.SLASH
            + this.state.values.studentID +
            constants.PASSWORD_URL_PARAM + this.state.values.studentIDPassword)
            .then(response => {
                this.setState({
                    isInputConfirmed: true,
                    isReady: true,
                    student: {
                        id: response.data["id"],
                        name: response.data["name"],
                        surname: response.data["surname"],
                        password: this.state.values.password,
                        patronymic: response.data["patronymic"],
                        email: response.data["email"],
                        groupId: response.data["groupId"]
                    }
                });
                this.getConfirmPassword(response.data["email"]);
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else {
                    this.setState({
                        isInputConfirmed: false
                    });
                }
            })
    }

    checkConfirmPassword() {
        if (this.state.confirmPassword === this.state.values.emailConfirmPassword) {
            this.createStudent();
        } else {
            this.setState({
                values: {
                    emailConfirmPassword: ''
                }
            });
        }
    }

    getConfirmPassword(email) {
        axios.get(constants.DEFAULT_URL + constants.CONFIRMATION_URL + constants.REGISTRATION_URL 
            + constants.EMAIL_URL_PARAM + email)
            .then(response => {
                this.setState({
                    confirmPassword: response.data["password"]
                });
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                }
            });
    }

    createStudent() {
        axios.post(constants.DEFAULT_URL + constants.STUDENTS_URL, {
            id: this.state.student.id,
            name: this.state.student.name,
            surname: this.state.student.surname,
            patronymic: this.state.student.patronymic,
            password: this.state.student.password,
            email: this.state.student.email,
            groupId: this.state.student.groupId
        })
            .then(response => {
                if (this.state.student.id === response.data["id"]) {
                    this.deleteStudentData();
                    this.setState({
                        isSuccess: true
                    });
                }
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                }
            });
    }

    deleteStudentData() {
        axios.delete(constants.DEFAULT_URL + constants.REGISTRATION_DATA_URL + constants.SLASH
            + this.state.student.id)
            .then();
    }

    render() {
        if (this.state.isSuccess) {
            return (
                <div className="main_success">
                    <div className="panel_success">
                        <svg className="img_success"/>
                    </div>
                    <div className="text_success">
                        <h1>Аккаунт успешно создан</h1>
                        <Link to="/login">Нажмите для перехода на страницу входа.</Link>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="main_register">
                    <div className="small_panel_register">
                        <svg className="img_register"/>
                    </div>
                    <div className="panel_register">
                        <div className="begin_register">
                            Регистрация в Системе
                        </div>
                        <form className="reg_register" onSubmit={event => this.handleSubmitRegInput(event)}>
                            <div className="part_register">
                                <div className="description_register">
                                    ID
                                </div>
                                <input
                                    name="studentID"
                                    className="in_data_register"
                                    type="text"
                                    placeholder="Введите ваш ID"
                                    value={this.state.values.studentID}
                                    onChange={event => this.handleRegInputChange(event)}
                                />
                            </div>
                            {this.state.errors.studentID && (
                                <div className="error_panel_register">
                                    {this.state.errors.studentID}
                                </div>
                            )}
                            <div className="part_register">
                                <div className="description_register">
                                    Пароль-подтверждение
                                </div>
                                <input
                                    name="studentIDPassword"
                                    className="in_data_register"
                                    type={this.state.isPasswordVisibility ? "text" : "password"}
                                    placeholder="Введите паоль для подтверждения ID"
                                    value={this.state.values.studentIDPassword}
                                    onChange={event => this.handleRegInputChange(event)}
                                />
                            </div>
                            {this.state.errors.studentIDPassword && (
                                <div className="error_panel_register">
                                    {this.state.errors.studentIDPassword}
                                </div>
                            )}
                            <div className="part_password_register">
                                <div className="description_register">
                                    Пароль
                                </div>
                                <input
                                    name="password"
                                    className="in_data_register"
                                    type={this.state.isPasswordVisibility ? "text" : "password"}
                                    placeholder="Введите пароль"
                                    title="≥ одной цифры, ≥ одной буквы в верхнем и нижнем регистре and ≥ восьми знаков"
                                    value={this.state.values.password}
                                    onChange={event => this.handleRegInputChange(event)}
                                />
                                <div className="small_indent"/>
                                <input
                                    name="confirmPassword"
                                    className="in_data_register"
                                    type={this.state.isPasswordVisibility ? "text" : "password"}
                                    placeholder="Повторно введите пароль"
                                    value={this.state.values.confirmPassword}
                                    onChange={event => this.handleRegInputChange(event)}
                                />
                            </div>
                            <input type="checkbox"
                                   id="check"
                                   className="check_recovery"
                                   onChange={() => this.handleChangePasswordVisibility()}
                            />
                            <label htmlFor="check">Посмотреть пароли</label>
                            {this.state.errors.password && (
                                <div className="error_panel_register_2">
                                    {this.state.errors.password}
                                </div>
                            )}
                            <button className="btn_register">Подтвердить</button>
                        </form>
                        {this.state.isSubmitted && this.state.isInputConfirmed && this.state.isReady &&
                        (
                            <React.Fragment>
                                {
                                    <div className="modal_rm">
                                        <div className="modal_body_rm success">
                                            <h1>Verification</h1>
                                            <h3>
                                                Код был отправлен на вашу почту.
                                            </h3>
                                            <div>
                                                <input
                                                    name="email_password"
                                                    className="input_rm"
                                                    type="text"
                                                    value={this.state.values.emailConfirmPassword}
                                                    onChange={event =>
                                                        this.handleConfirmPasswordInputChange(event)}
                                                />
                                                <button
                                                    className="btn_rm margin_btn_rm"
                                                    onClick={() => this.checkConfirmPassword()}
                                                >
                                                    Подтведить
                                                </button>
                                            </div>
                                            <div>
                                                <button
                                                    className="btn_rm btn_rm_success_size"
                                                    onClick={() => this.handleCloseButtonClick()}
                                                >
                                                    Закрыть
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </React.Fragment>
                        )}
                        {this.state.isSubmitted && !this.state.isInputConfirmed && this.state.isReady &&
                        (
                            <React.Fragment>
                                {
                                    <div className="modal_rm">
                                        <div className="modal_body_rm">
                                            <h1>Ошибка</h1>
                                            <h3>Введенные данные не верны.</h3>
                                            <button
                                                className="btn_rm"
                                                onClick={() => this.handleCloseButtonClick()}
                                            >
                                                Закрыть
                                            </button>
                                        </div>
                                    </div>
                                }
                            </React.Fragment>
                        )}
                    </div>
                </div>
            )
        }
    }
}

export default RegisterPage;