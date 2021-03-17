import React from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import * as constants from '../constants';
import '../styles/login.css';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isPasswordVisibility: false,
            values: {
                id: '',
                password: ''
            }
        }
    }

    handleSubmitLoginInput(event) {
        event.preventDefault();
        this.checkInputOnServer();
    }

    handleLoginInputChange(event) {
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

    checkInputOnServer() {
        axios.post(constants.DEFAULT_URL + constants.AUTHENTICATION_URL, {
            id: this.state.values.id,
            password: this.state.values.password
        })
            .then((response) => {
                localStorage.clear();
                const role = response.data["role"];
                const token = response.data["jwtToken"];
                localStorage.setItem("role", role);
                localStorage.setItem("token", token);
                localStorage.setItem("id", this.state.values.id);
                this.goToUserPageByRole(role);
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    this.goToServerErrorPage();
                } else if (error.response.status === 400) {
                    this.setState({
                        isError: true
                    })
                }
            });
    }

    goToUserPageByRole(role) {
        if (role.localeCompare(constants.STUDENT_ROLE)) {
            this.props.history.push('/student');
        } else if (role.localeCompare(constants.TEACHER_ROLE)) {
            this.props.history.push('/teacher');
        } else if (role.localeCompare(constants.ADMIN_ROLE)) {
            this.props.history.push('/admin');
        }
    }

    render() {
        return (
            <div className="main_l">
                <div className="small_panel_l">
                    <svg className="img_l"/>
                </div>
                <div className="panel_l">
                    <div className="begin_l">
                        Sign in to System
                    </div>
                    <form className="login_l" onSubmit={(event) => this.handleSubmitLoginInput(event)}>
                        <div className="part_l">
                            <div className="description_l">
                                ID
                            </div>
                            <input
                                name="id"
                                type="text"
                                placeholder="Enter your ID number"
                                className="in_data_l"
                                value={this.state.values.id}
                                onChange={(event) => this.handleLoginInputChange(event)}
                            />
                        </div>
                        <div className="part_l part_password_l">
                            <div className="description_l">
                                Password
                            </div>
                            <input
                                name="password"
                                className="in_data_l"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Enter your password"
                                value={this.state.values.password}
                                onChange={(event) => this.handleLoginInputChange(event)}
                            />
                        </div>
                        <input type="checkbox"
                               id="check"
                               className="check_l"
                               onChange={() => this.handleChangePasswordVisibility()}
                        />
                        <label htmlFor="check">Show password</label>
                        {this.state.isError && (
                            <div className="indent_l">
                                ID or password are incorrect
                            </div>
                        )}
                        <div className="repair_panel">
                            <Link to="/recovery">Forgot password? Restore it.</Link>
                        </div>
                        <button type="submit" className="btn_l">Login</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default LoginPage;