import React from "react";
import axios from 'axios';
import validateRegInput from "../validate/validateRegInput";
import '../styles/register.css';
import '../styles/modalReg.css';

class RegisterPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultServerURL: "http://localhost:8080/",
            urls: {
                firstRegisterUrl: "data?id=",
                secondRegisterUrl: "&password=",
                passwordUrl: "password-confirmation/registration?email=",
            },
            studentsUrl: "students",
            isSubmitted: false,
            isInputConfirmed: false,
            isPasswordConfirmed: false,
            isPasswordVisibility: false,
            isReady: false,
            confirmPassword: '',
            values: {
                studentID: '',
                studentIDPassword: '',
                password: '',
                confirmPassword: '',
                emailConfirmPassword: ''
            },
            student: {
                id: '',
                password: '',
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
            this.checkInputOnServer();
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

    checkInputOnServer() {
        axios.get(this.state.defaultServerURL + this.state.urls.firstRegisterUrl + this.state.values.studentID +
            this.state.urls.secondRegisterUrl + this.state.values.studentIDPassword)
            .then((response) => {
                this.setState({
                    isInputConfirmed: true,
                    isReady: true,
                    student: {
                        id: response.data["studentId"],
                        password: response.data["studentIdPassword"],
                        name: response.data["studentName"],
                        surname: response.data["studentSurname"],
                        patronymic: response.data["studentPatronymic"],
                        email: response.data["studentEmail"],
                        phoneNumber: response.data["studentPhoneNumber"]
                    }
                });
                this.getConfirmPassword(response.data["studentEmail"]);
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goToServerErrorPage();
                } else {
                    this.setState({
                        isInputConfirmed: false
                    });
                }
            })
    }

    checkConfirmPassword() {
        if (this.state.confirmPassword === this.state.values.emailConfirmPassword) {
            this.createStudentAccount();
        } else {
            this.setState({
                values: {
                    emailConfirmPassword: ''
                }
            });
        }
    }

    getConfirmPassword(email) {
        axios.get(this.state.defaultServerURL + this.state.urls.passwordUrl + email)
            .then((response) => {
                this.setState({
                    confirmPassword: response.data["emailConfirmPassword"]
                })
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goToServerErrorPage();
                }
            });
    }

    createStudentAccount() {
        axios.post(this.state.defaultServerURL + this.state.studentsUrl, {
            id: this.state.student.id,
            name: this.state.student.name,
            surname: this.state.student.surname,
            patronymic: this.state.student.patronymic,
            password: this.state.student.password,
            email: this.state.student.email,
            groupId: this.state.student.groupId
        })
            .then((response) => {
                if (this.state.student.id === response.data["id"]) {
                    this.goToSuccessPage();
                }
            })
            .catch((error) => {
            if (error.response.status === 500) {
                this.goToServerErrorPage();
            }
        });
    }

    goToSuccessPage() {
        this.props.history.push('/register/success');
    }

    goToServerErrorPage() {
        this.props.history.push('/500');
    }

    render() {
        return (
            <div className="main_r">
                <div className="small_panel_r">
                    <svg className="img_r"/>
                </div>
                <div className="panel_r">
                    <div className="begin_r">
                        Registration in System
                    </div>
                    <form className="reg_r" onSubmit={(event) => this.handleSubmitRegInput(event)}>
                        <div className="part_r">
                            <div className="description_r">
                                Student ID number
                            </div>
                            <input
                                name="studentID"
                                className="in_data_r"
                                type="text"
                                placeholder="Enter your SID number"
                                value={this.state.values.studentID}
                                onChange={(event) => this.handleRegInputChange(event)}
                            />
                        </div>
                        {this.state.errors.studentID && (
                            <div className="indent_r">
                                {this.state.errors.studentID}
                            </div>
                        )}
                        <div className="part_r">
                            <div className="description_r">
                                Student ID confirmation password
                            </div>
                            <input
                                name="studentIDPassword"
                                className="in_data_r"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Enter your SID confirmation password"
                                value={this.state.values.studentIDPassword}
                                onChange={(event) => this.handleRegInputChange(event)}
                            />
                        </div>
                        {this.state.errors.studentIDPassword && (
                            <div className="indent_r">
                                {this.state.errors.studentIDPassword}
                            </div>
                        )}
                        <div className="part_pass_r">
                            <div className="description_r">
                                Password
                            </div>
                            <input
                                name="password"
                                className="in_data_r"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Enter password"
                                title="≥ one number, ≥ one lower and uppercase letter and ≥ 8 characters"
                                value={this.state.values.password}
                                onChange={(event) => this.handleRegInputChange(event)}
                            />
                            <div className="small_indent"/>
                            <input
                                name="confirmPassword"
                                className="in_data_r"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Reenter password"
                                value={this.state.values.confirmPassword}
                                onChange={(event) => this.handleRegInputChange(event)}
                            />
                        </div>
                        <input type="checkbox"
                               id="check"
                               className="check_rm"
                               onChange={() => this.handleChangePasswordVisibility()}
                        />
                        <label htmlFor="check">Show passwords</label>
                        {this.state.errors.password && (
                            <div className="indent_r_2">
                                {this.state.errors.password}
                            </div>
                        )}
                        <button type="submit" className="btn_r">Confirm</button>
                    </form>
                    {this.state.isSubmitted && this.state.isInputConfirmed && this.state.isReady &&
                    (
                        <React.Fragment>
                            {
                                <div className="modal_rm">
                                    <div className="modal_body_rm success">
                                        <h1>Verification</h1>
                                        <h3>
                                            A message with a code has been sent to your email, enter it to complete
                                            registration.
                                        </h3>
                                        <div>
                                            <input
                                                name="email_password"
                                                className="input_rm"
                                                type="text"
                                                value={this.state.values.emailConfirmPassword}
                                                onChange={(event) =>
                                                    this.handleConfirmPasswordInputChange(event)}
                                            />
                                            <button
                                                className="btn_rm margin_btn_rm"
                                                onClick={() => this.checkConfirmPassword()}
                                            >
                                                Send
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                className="btn_rm btn_rm_success_size"
                                                onClick={() => this.handleCloseButtonClick()}
                                            >
                                                Close
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
                                        <h1>Error</h1>
                                        <h3>Input data is incorrect or such SID has been already registered.</h3>
                                        <button
                                            className="btn_rm"
                                            onClick={() => this.handleCloseButtonClick()}
                                        >
                                            Close
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

export default RegisterPage;