import React from "react";
import axios from "axios";
import {
    goAdminSubjectsPage,
    goLoginPage,
    goServerErrorPage,
    goStudentSubjectsPage,
    goTeacherMainPage
} from "../redirect";
import {
    ADMIN_ROLE,
    AUTHENTICATION_URL,
    DEFAULT_URL,
    GROUPS_URL,
    Q_PARAM, STUDENT_ID_PARAM,
    STUDENT_ROLE,
    TEACHER_ROLE
} from '../constants';
import '../styles/main.css';
import timeout from "../handle/timeout";

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

    change(event) {
        this.setState({
            values: {
                ...this.state.values,
                [event.target.name]: event.target.value
            }
        });
    }

    async saveDetails(role, id, token) {
        localStorage.clear();
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("id", id);
        if (role === STUDENT_ROLE) {
            this.getGroup(id, token);
            await timeout(250);
        }
    }

    changeVisibility() {
        this.setState((state) => ({
            isPasswordVisibility: !state.isPasswordVisibility
        }));
    }

    authenticate() {
        axios.post(DEFAULT_URL + AUTHENTICATION_URL, {
            id: this.state.values.id,
            password: this.state.values.password
        }).then(response => {
            const role = response.data["role"];
            const token = response.data["jwtToken"];
            const id = this.state.values.id;
            this.saveDetails(role, id, token);
            this.redirect(role);
        }).catch((error) => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 400) {
                this.setState({
                    isError: true
                })
            }
        });
    }

    getGroup(id, token) {
        axios.get(DEFAULT_URL + GROUPS_URL + Q_PARAM + STUDENT_ID_PARAM + id, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            localStorage.setItem("groupId", response.data["id"]);
        }).catch((error) => {
            if (error.response.status === 500) {
                goServerErrorPage(this.props);
            } else if (error.response.status === 401) {
                goLoginPage(this.props);
            }
        });
    }


    async redirect(role) {
        switch (role) {
            case STUDENT_ROLE:
                goStudentSubjectsPage(this.props);
                break;
            case TEACHER_ROLE:
                goTeacherMainPage(this.props);
                break;
            case ADMIN_ROLE:
                goAdminSubjectsPage(this.props);
                break
            default:
                break;
        }
    }

    render() {
        return (
            <div className="main">
                <div className="image">
                    <svg className="img"/>
                </div>
                <div className="panel_add big">
                    <div className="begin_add">
                        Вход в систему
                    </div>
                    <div className="part_add">
                        <div className="description_add">
                            ID
                        </div>
                        <input
                            name="id"
                            type="text"
                            placeholder="Введите ваш ID"
                            className="in_data_add"
                            value={this.state.values.id}
                            onChange={event => this.change(event)}
                        />
                    </div>
                    <div className="part_add">
                        <div className="description_add">
                            Пароль
                        </div>
                        <input
                            name="password"
                            className="in_data_add"
                            type={this.state.isPasswordVisibility ? "text" : "password"}
                            placeholder="Введите ваш пароль"
                            value={this.state.values.password}
                            onChange={event => this.change(event)}
                        />
                    </div>
                    <input type="checkbox"
                           id="check"
                           className="check_recovery"
                           onChange={() => this.changeVisibility()}
                    />
                    <label htmlFor="check">Посмотреть пароль</label>
                    {this.state.isError && (
                        <div className="error_panel_add">
                            ID или пароль не верны
                        </div>
                    )}
                    <button
                        className="btn_add"
                        onClick={() => this.authenticate()}
                    >
                        Войти
                    </button>
                </div>
            </div>
        )
    }
}

export default LoginPage;