import React from "react";
import '../../styles/student/main.css';
import {
    goLoginPage,
    goServerErrorPage,
    goStudentGroupPage,
    goStudentProfilePage,
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
            subject: {
                name: '',
                planLessonsCount: 0,
                pastLessonsCount: 0,
                skipsCount: 0,
                grades: '',
                averageGrade: 0.0
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
                }
            });
    }

    getStudentInfo(subjectId) {
        axios.get(constants.DEFAULT_URL + constants.STUDENTS_URL + constants.SLASH + localStorage.getItem("id")
            + constants.SUBJECTS_URL + constants.SLASH + subjectId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                this.setState({
                    subject: {
                        name: response.data["subjectName"],
                        planLessonsCount: response.data["planLessonsCount"],
                        pastLessonsCount: response.data["pastLessonsCount"],
                        skipsCount: response.data["skipsCount"],
                        grades: response.data["grades"].join(', '),
                        averageGrade: response.data["averageGrade"].toFixed(1)
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

    handleSubjectButtonClick(event) {
        this.setState({
            isStart: false,
            subjectID: event.target.value
        });
        this.getStudentInfo(event.target.value);
    }

    handleMainClick() {
        this.setState({
            isStart: true
        });
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
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                    <a onClick={() => goStudentProfilePage(this.props)}>Profile</a>
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
                                    <div className="subject_detail_value">{this.state.subject.averageGrade}</div>
                                </div>
                                <div className="subject_detail">
                                    <div className="subject_detail_name">Skips count:</div>
                                    <div className="subject_detail_value">{this.state.subject.skipsCount}</div>
                                </div>
                                <div className="subject_detail">
                                    <div className="subject_detail_name">Past classes:</div>
                                    <div className="subject_detail_value">{this.state.subject.pastLessonsCount}</div>
                                </div>
                                <div className="subject_detail">
                                    <div className="subject_detail_name">Planned classes:</div>
                                    <div className="subject_detail_value">{this.state.subject.planLessonsCount}</div>
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

