import React from "react";
import axios from "axios";
import validateRecPasswordsInput from "../validate/validateRecPasswordsInput";
import * as constants from '../constants';
import '../styles/recovery.css';
import '../styles/modal.css';

class ChangePasswordPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: true,
            isIDError: false,
            isPasswordVisibility: false,
            id: '',
            data: {},
            errors: {}
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (role === null) {
            this.goToLoginPage();
        } else {
            console.log(localStorage.getItem("email"));
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
                    this.goToServerErrorPage();
                } else if (error.response.status === 401) {
                    this.goToLoginPage();
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
                    this.goToServerErrorPage();
                }
            })
    }

    goToProfilePage() {
        localStorage.removeItem("email");
        const role = localStorage.getItem("role");
        if (role.localeCompare(constants.STUDENT_ROLE)) {
            this.props.history.push('/student/profile');
        } else if (role.localeCompare(constants.TEACHER_ROLE)) {
            this.props.history.push('/teacher/profile');
        } else if (role.localeCompare(constants.ADMIN_ROLE)) {
            this.props.history.push('/admin/profile');
        }
    }

    goToServerErrorPage() {
        this.props.history.push('/500');
    }

    goToLoginPage() {
        localStorage.clear();
        this.props.history.push('/login');
    }

    render() {
        return (
            <div className="main_rec">
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
                        <button onClick={()=>this.goToProfilePage()} className="btn_rec btn_ch">Return</button>
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
                                        Back
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