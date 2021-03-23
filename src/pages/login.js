import React from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {goMainPage, goServerErrorPage} from "../redirect";
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
            .then(response => {
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
                    goServerErrorPage(this.props);
                } else if (error.response.status === 400) {
                    this.setState({
                        isError: true
                    })
                }
            });
    }

    goToUserPageByRole(role) {
        if (role === constants.STUDENT_ROLE) {
            goMainPage(this.props, '/student');
        } else if (role === constants.TEACHER_ROLE) {
            goMainPage(this.props, '/teacher');
        } else if (role === constants.ADMIN_ROLE) {
            goMainPage(this.props, '/admin');
        }
    }

    render() {
        return (
            <div className="main">
                <div className="image">
                    <svg className="img"/>
                </div>
                <div className="big_panel">
                    <div className="title">
                        Вход в систему
                    </div>
                    <form className="login_form" onSubmit={event => this.handleSubmitLoginInput(event)}>
                        <div className="form_part">
                            <div className="description">
                                ID
                            </div>
                            <input
                                name="id"
                                type="text"
                                placeholder="Введите ваш ID"
                                className="input"
                                value={this.state.values.id}
                                onChange={event => this.handleLoginInputChange(event)}
                            />
                        </div>
                        <div className="form_part form_part_password">
                            <div className="description">
                                Пароль
                            </div>
                            <input
                                name="password"
                                className="input"
                                type={this.state.isPasswordVisibility ? "text" : "password"}
                                placeholder="Введите ваш пароль"
                                value={this.state.values.password}
                                onChange={event => this.handleLoginInputChange(event)}
                            />
                        </div>
                        <input type="checkbox"
                               id="check"
                               className="check_box"
                               onChange={() => this.handleChangePasswordVisibility()}
                        />
                        <label htmlFor="check">Посмотреть пароль</label>
                        {this.state.isError && (
                            <div className="error_panel">
                                ID или пароль не верны
                            </div>
                        )}
                        <div className="repair_panel">
                            <Link to="/recovery">Забыли пароль? Восстановите его.</Link>
                        </div>
                        <button type="submit" className="btn">Войти</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default LoginPage;