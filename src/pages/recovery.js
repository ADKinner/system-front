import React from "react";
import validateRecIDInput from "../validate/validateRecIDInput";
import validateRecPasswordsInput from "../validate/validateRecPasswordsInput";
import '../styles/recovery.css'
import '../styles/modalReg.css'
import axios from "axios";

class RecoveryPasswordPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultServerURL: "http://localhost:8080/",
            urls: {
                passwordUrl: 'password-confirmation/login/repair-password?email=',
                studentUrl: 'students',
                teacherUrl: 'teachers',
                administratorUrl: 'administrators',
                slash: '/'
            },
            isLoginCorrect: false,
            isModalOpen: false,
            isIDError: false,
            isPasswordVisibility: false,
            data: {
                id: ''
            },
            role: -1,
            errors: {}
        }
    }

    handleIDInputChange(event) {
        this.setState({
            data: {
                id: event.target.value
            }
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
            })
        }
        if (this.checkIDInputError()) {
            if (this.checkIsStudentIDCorrectOnServer(this.state.data.id)
                || this.checkIsTeacherIDCorrectOnServer(this.state.data.id)
                || this.checkIsAdministratorIDCorrectOnServer(this.state.data.id)) {
                this.setState({
                    isLoginCorrect: true,
                    isModalOpen: true,
                    data: {
                        confirmPassword: '',
                        newPassword: '',
                        repeatPassword: ''
                    }
                })
            } else {
                this.setState({
                    data: {
                        id: ''
                    },
                    errors: {
                        id: 'ID is incorrect'
                    }
                })
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
                        password: 'Confirm passwords not match'
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
        const errors = validateRecIDInput(this.state.data.id);
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
        axios.get(this.state.defaultServerURL + this.state.urls.studentUrl + this.state.urls.slash + id)
            .then((response) => {
                this.setState({
                    role: 0
                })
                this.getConfirmPassword(response.data["email"]);
                return true;
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goToServerErrorPage();
                } else {
                    return false;
                }
            })
    }

    checkIsTeacherIDCorrectOnServer(id) {
        axios.get(this.state.defaultServerURL + this.state.urls.teacherUrl + this.state.urls.slash + id)
            .then((response) => {
                this.setState({
                    role: 1
                })
                this.getConfirmPassword(response.data["email"]);
                return true;
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goToServerErrorPage();
                } else {
                    return false;
                }
            })
    }

    checkIsAdministratorIDCorrectOnServer(id) {
        axios.get(this.state.defaultServerURL + this.state.urls.administratorUrl + this.state.urls.slash + id)
            .then((response) => {
                this.setState({
                    role: 2
                })
                this.getConfirmPassword(response.data["email"]);
                return true;
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goToServerErrorPage();
                } else {
                    return false;
                }
            })
    }

    checkConfirmPasswordsIdentity() {
        return this.state.data.emailConfirmPassword === this.state.data.confirm_password;
    }

    getConfirmPassword(email) {
        axios.get(this.state.defaultServerURL + this.state.urls.passwordUrl + email)
            .then((response) => {
                this.setState({
                    data: {
                        emailConfirmPassword: response.data["emailConfirmPassword"]
                    }
                })
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goToServerErrorPage();
                }
            });
    }

    changePasswordOnAccount() {
        let url = this.state.defaultServerURL;
        if (this.state.role === 0) {
            url += this.state.urls.studentUrl;
        } else if (this.state.role === 1) {
            url += this.state.urls.teacherUrl;
        } else {
            url += this.state.urls.administratorUrl;
        }
        axios.put(url, {
            login: this.state.data.id,
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
                            Recover password in System
                        </div>
                        <form className="login_rec" onSubmit={(event) => this.handleSubmitPasswordsInput(event)}>
                            <div className="part_rec">
                                <div className="description_rec">
                                    Confirm password
                                </div>
                                <input
                                    name="confirm_password"
                                    className="in_data_rec"
                                    type={this.state.isPasswordVisibility ? "text" : "password"}
                                    placeholder="Enter confirmation password"
                                    value={this.state.data.confirm_password}
                                    onChange={(event) => this.handlePasswordsInputChange(event)}
                                />
                            </div>
                            {this.state.errors.confirm_password && (
                                <div className="indent_r">
                                    {this.state.errors.confirm_password}
                                </div>
                            )}
                            <div className="part_pass_rec">
                                <div className="description_rec">
                                    New password
                                </div>
                                <input
                                    name="new_password"
                                    className="in_data_rec"
                                    type={this.state.isPasswordVisibility ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={this.state.data.new_password}
                                    onChange={(event) => this.handlePasswordsInputChange(event)}
                                />
                                <div className="small_indent_rec"/>
                                <input
                                    name="repeat_password"
                                    className="in_data_rec"
                                    type={this.state.isPasswordVisibility ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={this.state.data.repeat_password}
                                    onChange={(event) => this.handlePasswordsInputChange(event)}
                                />
                            </div>
                            <input type="checkbox"
                                   id="check"
                                   className="check_rm"
                                   onChange={() => this.handleChangePasswordVisibility()}
                            />
                            <label htmlFor="check">Show passwords</label>
                            {this.state.errors.new_password && (
                                <div className="indent_rec_2">
                                    {this.state.errors.new_password}
                                </div>
                            )}
                            <button type="submit" className="btn_l">Finish recovery</button>
                        </form>
                    </div>
                    {this.state.isModalOpen && (
                        <React.Fragment>
                            {
                                <div className="modal_rm">
                                    <div className="modal_body_rm success_rec">
                                        <h1>Information</h1>
                                        <h3>
                                            Confirmation passwords was sent to your account mail.
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
                            Recover password in System
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
                                    value={this.state.data.id}
                                    onChange={(event) => this.handleIDInputChange(event)}
                                />
                            </div>
                            {this.state.errors.id && (
                                <div className="indent_rec">
                                    {this.state.errors.id}
                                </div>
                            )}
                            <button type="submit" className="btn_rec">Start recovery</button>
                        </form>
                    </div>
                </div>
            )
        }
    }
}

export default RecoveryPasswordPage;