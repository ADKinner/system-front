import React from "react";
import '../../styles/teacher/main.css';
import {
    goLoginPage,
    goServerErrorPage,
    goTeacherLessonPage,
    goTeacherMainPage,
    goTeacherProfilePage
} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";

class TeacherInfoPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            subjects: [],
            subject: {

            },
            isSubjectsInfo: false,
            isSubjectInfo: false
        }
    }

    componentDidMount() {
        const role = localStorage.getItem("role");
        if (localStorage.length === 0 || role === null) {
            goLoginPage(this.props);
        } else {
            switch (role) {
                case "ROLE_TEACHER":
                    this.getSubjectsInfo();
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getSubjectsInfo() {
        axios.get(constants.DEFAULT_URL + constants.TEACHERS_URL + constants.SLASH + localStorage.getItem("id")
            + constants.GROUPS_URL + constants.SUBJECTS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                this.setState({
                    subjects: response.data,
                    isSubjectsInfo: true
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

    getSubjectInfo(subjectId) {
        axios.get(constants.DEFAULT_URL + constants.TEACHERS_URL + constants.GROUPS_URL + constants.SUBJECTS_URL
            + constants.SLASH + subjectId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                this.setState({
                    subject: response.data,
                    isSubjectsInfo: false,
                    isSubjectInfo: true
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

    handleInfoClick() {
        if (this.state.isSubjectInfo) {
            this.setState({
                isSubjectsInfo: true,
                isSubjectInfo: false
            });
        }
    }

    handleViewSubjectInfoButtonClick(e) {
        this.getSubjectInfo(e.target.value);
    }

    renderTableData() {
        return this.state.subjects.map((student, index) => {
            const {id, subject, form, term, speciality, groups} = student
            return (
                <tr key={id}>
                    <td>{index + 1}</td>
                    <td>{subject}</td>
                    <td>{form}</td>
                    <td>{term}</td>
                    <td>{speciality}</td>
                    <td>{groups.join(', ')}</td>
                    <td>
                        <button
                            className="btn_view"
                            value={id}
                            onClick={(e) => this.handleViewSubjectInfoButtonClick(e)}
                        >View
                        </button>
                    </td>
                </tr>
            )
        })
    }

    renderTableHeader() {
        let header = Object.keys(this.state.subjects[0])
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    render() {
        return (
            <div className="main_t">
                <div className="bar_p">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                    <a onClick={() => goTeacherProfilePage(this.props)}>Profile</a>
                    <a className="active" onClick={() => this.handleInfoClick()}>Info</a>
                    <a onClick={() => goTeacherLessonPage(this.props)}>Lesson</a>
                    <a onClick={() => goTeacherMainPage(this.props)}>Main</a>
                </div>
                {this.state.isSubjectsInfo && (
                    <div className="student_panel">
                        <h1 id='title'>Subjects</h1>
                        <table id='students'>
                            <tbody>
                            <tr>
                                {this.renderTableHeader()}
                                <th></th>
                            </tr>
                            {this.renderTableData()}
                            </tbody>
                        </table>
                    </div>
                )}
                {this.state.isSubjectInfo && (
                    <div className="subject_data_panel_t">
                        <div className="subject_data_st">
                            <h1>Subject: {this.state.subject.name + ' - ' + this.state.subject.form}</h1>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Term:</div>
                                <div className="subject_detail_value">{this.state.subject.term}</div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Speciality:</div>
                                <div className="subject_detail_value">{this.state.subject.speciality}</div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Average grades mark:</div>
                                <div className="subject_detail_value">
                                    {this.state.subject.averageGrade.toFixed(1)}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Average skips count:</div>
                                <div className="subject_detail_value">
                                    {this.state.subject.averageSkips.toFixed(1)}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Average past lessons:</div>
                                <div className="subject_detail_value">
                                    {this.state.subject.averagePastLessonsCount.toFixed(1)}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Plan lessons count:</div>
                                <div className="subject_detail_value">{this.state.subject.planLessonsCount}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default TeacherInfoPage;

