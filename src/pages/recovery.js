import React from "react";
import axios from "axios";
import validateRecIDInput from "../validate/validateRecIDInput";
import validateRecPasswordsInput from "../validate/validateRecPasswordsInput";
import * as constants from '../constants';
import '../styles/recovery.css';
import '../styles/modal.css';

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
                        confirmPassword: 'Confirm passwords not match'
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
            .then((response) => {
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
                    this.goToServerErrorPage();
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
            .then((response) => {
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
                    this.goToServerErrorPage();
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
            .then((response) => {
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
                    this.goToServerErrorPage();
                } else {
                    this.setState({
                        data: {
                            id: ''
                        },
                        errors: {
                            id: 'ID is incorrect'
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
            .then((response) => {
                this.setState({
                    data: {
                        emailConfirmPassword: response.data["password"]
                    }
                });
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goToServerErrorPage();
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
                this.goToSuccessPage();
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goToServerErrorPage();
                }
            })
    }

    goToSuccessPage() {
        this.props.history.push('/recovery/success');
    }

    goToServerErrorPage() {
        this.props.history.push('/500');
    }

    render() {
        if (this.state.isLoginCorrect) {
            return (
                <div className="main_rec">
                    <div className="small_panel_rec">
                        <svg className="img_rec"/>
                    </div>
                    <div className="panel_second_rec">
                        <div className="begin_rec">
                            Password recovery in System
                        </div>
                        <form className="login_rec" onSubmit={(event) => this.handleSubmitPasswordsInput(event)}>
                            <div className="part_rec">
                                <div className="description_rec">
                                    Confirm password
                                </div>
                                <input
                                    name="confirmPassword"
                                    className="in_data_rec"
                                    type={this.state.isPasswordVisibility ? "text" : "password"}
                                    placeholder="Enter confirmation password"
                                    value={this.state.data.confirmPassword}
                                    onChange={(event) => this.handlePasswordsInputChange(event)}
                                />
                            </div>
                            {this.state.errors.confirmPassword && (
                                <div className="indent_r">
                                    {this.state.errors.confirmPassword}
                                </div>
                            )}
                            <div className="part_pass_rec">
                                <div className="description_rec">
                                    New password
                                </div>
                                <input
                                    name="newPassword"
                                    className="in_data_rec"
                                    type={this.state.isPasswordVisibility ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={this.state.data.newPassword}
                                    onChange={(event) => this.handlePasswordsInputChange(event)}
                                />
                                <div className="small_indent_rec"/>
                                <input
                                    name="repeatPassword"
                                    className="in_data_rec"
                                    type={this.state.isPasswordVisibility ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={this.state.data.repeatPassword}
                                    onChange={(event) => this.handlePasswordsInputChange(event)}
                                />
                            </div>
                            <input type="checkbox"
                                   id="check"
                                   className="check_rm"
                                   onChange={() => this.handleChangePasswordVisibility()}
                            />
                            <label htmlFor="check">Show passwords</label>
                            {this.state.errors.newPassword && (
                                <div className="indent_rec_2">
                                    {this.state.errors.newPassword}
                                </div>
                            )}
                            <button type="submit" className="btn_rec">Finish recovery</button>
                        </form>
                    </div>
                    {this.state.isModalOpen && (
                        <React.Fragment>
                            {
                                <div className="modal_rm">
                                    <div className="modal_body_rm success_rec">
                                        <h1>Information</h1>
                                        <h3>
                                            Confirmation password was sent to your account mail.
                                        </h3>
                                        <h3>
                                            Check it.
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
                <div className="main_rec">
                    <div className="small_panel_rec">
                        <svg className="img_rec"/>
                    </div>
                    <div className="panel_first_rec">
                        <div className="begin_rec">
                            Password recovery in System
                        </div>
                        <form className="login_rec" onSubmit={(event) => this.handleSubmitIDInput(event)}>
                            <div className="part_rec">
                                <div className="description_rec">
                                    User ID
                                </div>
                                <input
                                    name="id"
                                    className="in_data_rec"
                                    type="text"
                                    placeholder="Enter your ID number"
                                    value={this.state.id}
                                    onChange={(event) => this.handleIDInputChange(event)}
                                />
                            </div>
                            {this.state.errors.id && (
                                <div className="indent_rec">
                                    {this.state.errors.id}
                                </div>
                            )}
                            <button type="submit" className="btn_rec first_indent">Start recovery</button>
                        </form>
                    </div>
                </div>
            )
        }
    }
}

export default RecoveryPasswordPage;