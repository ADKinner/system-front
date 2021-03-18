import React from "react";
import axios from "axios";
import {goLoginPage, goMainPage, goProfilePage, goStudentGrades, goServerErrorPage} from "../redirect";
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
                    this.setState({isStudent: true});
                    break;
                case "ROLE_TEACHER":
                    this.setState({isTeacher: true});
                    break;
                case "ROLE_ADMIN":
                    this.setState({isAdmin: true});
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
        if (role.localeCompare(constants.STUDENT_ROLE)) {
            url += constants.STUDENTS_URL;
        } else if (role.localeCompare(constants.TEACHER_ROLE)) {
            url += constants.TEACHERS_URL;
        } else if (role.localeCompare(constants.ADMIN_ROLE)) {
            url += constants.ADMINS_URL;
        }
        axios.put(url, {
            id: localStorage.getItem("id"),
            password: this.state.data.newPassword
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
        if (role.localeCompare(constants.STUDENT_ROLE)) {
            goProfilePage(this.props, '/student');
        } else if (role.localeCompare(constants.TEACHER_ROLE)) {
            goProfilePage(this.props, '/student');
        } else if (role.localeCompare(constants.ADMIN_ROLE)) {
            goProfilePage(this.props, '/student');
        }
    }

    handleMainClick(role) {
        if (role.localeCompare(constants.STUDENT_ROLE)) {
            goMainPage(this.props, '/student');
        } else if (role.localeCompare(constants.TEACHER_ROLE)) {
            goMainPage(this.props, '/teacher');
        } else if (role.localeCompare(constants.ADMIN_ROLE)) {
            goMainPage(this.props, '/admin');
        }
    }

    render() {
        return (
            <div className="main_rec">
                {this.state.isStudent && (
                    <div className="bar_p">
                        <div className="sys_image"/>
                        <div className="sys_name">SYSTEM</div>
                        <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                        <a onClick={() => this.goToProfilePage()}>Profile</a>
                        <a onClick={() => goStudentGrades(this.props)}>Grades</a>
                        <a onClick={() => this.handleMainClick(localStorage.getItem("role"))}>Main</a>
                    </div>
                )}
                {this.state.isTeacher && (
                    <div className="bar_p">
                        <div className="sys_image"/>
                        <div className="sys_name">SYSTEM</div>
                        <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                        <a onClick={() => this.goToProfilePage()}>Profile</a>
                        <a onClick={() => this.handleMainClick(localStorage.getItem("role"))}>Main</a>
                    </div>
                )}
                {this.state.isAdmin && (
                    <div className="bar_p">
                        <div className="sys_image"/>
                        <div className="sys_name">SYSTEM</div>
                        <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                        <a onClick={() => this.goToProfilePage()}>Profile</a>
                        <a onClick={() => this.handleMainClick(localStorage.getItem("role"))}>Main</a>
                    </div>
                )}
                <div className="small_panel_rec">
                    <svg className="img_rec"/>
                </div>
                <div className="panel_second_rec panel_ch">
                    <div className="begin_rec">
                        Password change
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
                        <button type="submit" className="btn_rec">Change password</button>
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
                {this.state.isSuccess && (
                    <React.Fragment>
                        {
                            <div className="modal_rm">
                                <div className="modal_body_rm success_rec">
                                    <h1>Success</h1>
                                    <h3>
                                        Password successfully updated.
                                        Click on return button to go to profile page.
                                    </h3>
                                    <button
                                        className="btn_rm"
                                        onClick={() => this.goToProfilePage()}
                                    >
                                        Return
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