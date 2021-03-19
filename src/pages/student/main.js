import React from "react";
import '../../styles/student/main.css'
import {
    goLoginPage,
    goProfilePage,
    goStudentGroupPage,
    goMainPage,
    goServerErrorPage,
    goStudentTeacherPage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";

class StudentMainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isStart: true,
            subjects: [],
            subjectID: 0,
            subject: {
                name: '',
                planClasses: 0,
                conductClasses: 0,
                skips: 0,
                grades: '',
                average: 0.0
            }
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_STUDENT":
                    this.getStudentSubjects();
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getStudentSubjects() {
        axios.get(constants.DEFAULT_URL + constants.STUDENTS_URL + constants.SLASH + localStorage.getItem("id")
            + constants.SUBJECTS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                this.setState({
                    subjects: response.data
                });
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
                } else if (error.response.status === 404) {
                    this.setState({isEmpty: true});
                }
            });
    }

    getSubjectData(subjectID) {
        axios.get(constants.DEFAULT_URL + constants.STUDENTS_URL + constants.SLASH + localStorage.getItem("id")
            + constants.SUBJECTS_URL + constants.SLASH + subjectID, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                console.log(response.data)
                this.setState({
                    subject: {
                        name: response.data["subjectName"],
                        planClasses: response.data["planClasses"],
                        conductClasses: response.data["conductClasses"],
                        skips: response.data["skips"],
                        grades: response.data["grades"].join(', '),
                        average: this.average(response.data["grades"])
                    }
                });
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
                }
            });
    }

    average(input) {
        this.output = 0;
        for (this.i = 0; this.i < input.length; this.i++) {
            this.output += Number(input[this.i]);
        }
        return this.output / input.length;
    }

    handleSubjectButtonClick(event) {
        this.setState({
            isStart: false,
            subjectID: event.target.value
        });
        this.getSubjectData(event.target.value);
    }

    handleMainClick() {
        this.setState({
            isStart: true,
            subjectID: 0
        })
    }

    renderSubjectButtons() {
        return this.state.subjects.map((subject, index) => {
            const {id, name, form} = subject
            return (
                <div>
                    <button className="btn_st" value={id} onClick={(e) => this.handleSubjectButtonClick(e)}>
                        {name + ' - ' + form}
                    </button>
                </div>
            )
        })
    }

    render() {
        return (
            <div className="main_st">
                <div className="bar_p">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                    <a onClick={() => goProfilePage(this.props, '/student')}>Profile</a>
                    <a onClick={() => goStudentTeacherPage(this.props)}>Teachers</a>
                    <a onClick={() => goStudentGroupPage(this.props)}>Group</a>
                    <a className="active" onClick={() => this.handleMainClick()}>Main</a>
                </div>
                <div className="main_data_st">
                    {this.state.isStart && (
                        <div className="subject_panel_st">
                            {this.renderSubjectButtons()}
                        </div>
                    )}
                    {!this.state.isStart && (
                        <div className="subject_data_panel_st">
                            <div className="subject_data_st">
                                <h1>Subject: {this.state.subject.name}</h1>
                                <div className="subject_detail">
                                    <div className="subject_detail_name">Grades:</div>
                                    <div className="subject_detail_value">{this.state.subject.grades}</div>
                                </div>
                                <div className="subject_detail">
                                    <div className="subject_detail_name">Average mark:</div>
                                    <div className="subject_detail_value">{this.state.subject.average}</div>
                                </div>
                                <div className="subject_detail">
                                    <div className="subject_detail_name">Skips count:</div>
                                    <div className="subject_detail_value">{this.state.subject.skips}</div>
                                </div>
                                <div className="subject_detail">
                                    <div className="subject_detail_name">Сonducted classes:</div>
                                    <div className="subject_detail_value">{this.state.subject.conductClasses}</div>
                                </div>
                                <div className="subject_detail">
                                    <div className="subject_detail_name">Planned classes:</div>
                                    <div className="subject_detail_value">{this.state.subject.planClasses}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default StudentMainPage;

