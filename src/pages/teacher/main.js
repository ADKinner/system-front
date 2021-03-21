import React from "react";
import '../../styles/teacher/main.css';
import {goLoginPage, goProfilePage, goServerErrorPage, goTeacherInfoPage, goTeacherLessonPage} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";

class MainTeacherPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFindGroup: true,
            isSubjects: false,
            isGroupInfo: false,
            isGroupStudents: false,
            isStudentInfo: false,
            isError: false,
            errorMessage: '',
            groupId: '',
            subjectId: '',
            subjects: [],
            students: [],
            groupInfo: {
                subjectName: '',
                planLessonsCount: 0,
                pastLessonsCount: 0,
                averageSkipsCount: 0.0,
                averageGrade: 0.0
            },
            studentInfo: {
                cred: '',
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
                case "ROLE_TEACHER":
                    break;
                default:
                    goLoginPage(this.props);
                    break;
            }
        }
    }

    getSubjects() {
        axios.get(constants.DEFAULT_URL + constants.TEACHERS_URL + constants.SLASH + localStorage.getItem("id")
            + constants.GROUPS_URL + constants.SLASH + this.state.groupId + constants.SUBJECTS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                if (response.data.length === 0) {
                    this.setState({
                        isError: true,
                        errorMessage: 'You not work with this group'
                    });
                } else {
                    this.setState({
                        isSubjects: true,
                        isFindGroup: false,
                        isError: false,
                        subjects: response.data
                    });
                }
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
                } else if (error.response.status === 404 || error.response.status === 400) {
                    this.setState({
                        isError: true,
                        errorMessage: 'Group ID is incorrect'
                    });
                }
            });
    }

    getGroupInfo(subjectId) {
        axios.get(constants.DEFAULT_URL + constants.TEACHERS_URL + constants.GROUPS_URL + constants.SLASH
            + this.state.groupId + constants.SUBJECTS_URL + constants.SLASH + subjectId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                this.setState({
                    groupInfo: {
                        name: response.data["subjectName"],
                        planLessonsCount: response.data["planLessonsCount"],
                        pastLessonsCount: response.data["pastLessonsCount"],
                        averageSkipsCount: response.data["averageSkipsCount"].toFixed(1),
                        averageGrade: response.data["averageGrade"].toFixed(1)
                    },
                    isGroupInfo: true,
                    isSubjects: false,
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

    getGroupStudents() {
        axios.get(constants.DEFAULT_URL + constants.TEACHERS_URL + constants.GROUPS_URL + constants.SLASH
            + this.state.groupId + constants.STUDENTS_URL, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                this.setState({
                    students: response.data,
                    isGroupInfo: false,
                    isGroupStudents: true
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

    getStudentInfo(studentId) {
        axios.get(constants.DEFAULT_URL + constants.TEACHERS_URL + constants.GROUPS_URL + constants.STUDENTS_URL + constants.SLASH
            + studentId + constants.SUBJECTS_URL + constants.SLASH + this.state.subjectId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                this.setState({
                    studentInfo: {
                        cred: response.data["cred"],
                        planLessonsCount: response.data["planLessonsCount"],
                        pastLessonsCount: response.data["pastLessonsCount"],
                        skipsCount: response.data["skipsCount"],
                        grades: response.data["grades"].join(', '),
                        averageGrade: response.data["averageGrade"].toFixed(1)
                    },
                    isStudentInfo: true,
                    isGroupStudents: false,
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

    handleGroupInputChange(event) {
        this.setState({
            groupId: event.target.value,
        });
    }

    handleMainClick() {
        if (this.state.isSubjects) {
            this.setState({
                isFindGroup: true,
                isSubjects: false
            });
        } else if (this.state.isGroupInfo) {
            this.setState({
                isSubjects: true,
                isGroupInfo: false
            });
        } else if (this.state.isGroupStudents) {
            this.setState({
                isGroupInfo: true,
                isGroupStudents: false
            });
        } else if (this.state.isStudentInfo) {
            this.setState({
                isGroupStudents: true,
                isStudentInfo: false
            });
        }
    }

    handleSearchGroupButtonClick() {
        this.getSubjects();
    }

    handleSubjectButtonClick(event) {
        this.setState({
            subjectId: event.target.value
        });
        this.getGroupInfo(event.target.value);
    }

    handleViewGroupButtonClick() {
        this.getGroupStudents();
    }

    handleViewStudentButtonClick(event) {
        this.getStudentInfo(event.target.value);
    }

    renderSubjectsButtons() {
        return this.state.subjects.map((subject, index) => {
            const {id, name, form} = subject
            return (
                <div>
                    <button
                        className="btn_s_t"
                        value={id}
                        onClick={(e) => this.handleSubjectButtonClick(e)}
                    >
                        {name + ' - ' + form}
                    </button>
                </div>
            );
        });
    }

    renderTableData() {
        return this.state.students.map((student, index) => {
            const {id, surname, name, patronymic, email} = student
            return (
                <tr key={id}>
                    <td>{index + 1}</td>
                    <td>{name}</td>
                    <td>{surname}</td>
                    <td>{patronymic}</td>
                    <td>{email}</td>
                    <td>
                        <button
                            className="btn_view"
                            value={id}
                            onClick={(e) => this.handleViewStudentButtonClick(e)}
                        >View
                        </button>
                    </td>
                </tr>
            )
        })
    }

    renderTableHeader() {
        let header = Object.keys(this.state.students[0])
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
                    <a onClick={() => goProfilePage(this.props, '/teacher')}>Profile</a>
                    <a onClick={() => goTeacherInfoPage(this.props)}>Info</a>
                    <a onClick={() => goTeacherLessonPage(this.props)}>Lessons</a>
                    <a onClick={() => this.handleMainClick()} className="active">Main</a>
                </div>
                {this.state.isFindGroup && (
                    <div className="panel_t">
                        <div className="begin_t">
                            Find group
                        </div>
                        <div className="find_panel_t">
                            <div className="part_t">
                                <div className="description_t">
                                    Group ID
                                </div>
                                <input
                                    name="groupId"
                                    type="text"
                                    placeholder="Enter group ID"
                                    className="in_data_t"
                                    value={this.state.groupId}
                                    onChange={(event) => this.handleGroupInputChange(event)}
                                />
                            </div>
                            {this.state.isError && (
                                <div className="indent_t">
                                    {this.state.errorMessage}
                                </div>
                            )}
                            <button onClick={() => this.handleSearchGroupButtonClick()} className="btn">Search
                            </button>
                        </div>
                    </div>
                )}
                {this.state.isSubjects && (
                    <div className="subjects_panel_t">
                        {this.renderSubjectsButtons()}
                    </div>
                )}
                {this.state.isGroupInfo && (
                    <div className="subject_data_panel_t">
                        <div className="subject_data_st">
                            <h1>Group: {this.state.groupId}</h1>
                            <h2>Subject: {this.state.groupInfo.name}</h2>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Average mark:</div>
                                <div className="subject_detail_value">{this.state.groupInfo.averageGrade}</div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Average skips count:</div>
                                <div className="subject_detail_value">{this.state.groupInfo.averageSkipsCount}</div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Past classes:</div>
                                <div className="subject_detail_value">{this.state.groupInfo.pastLessonsCount}</div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Planned classes:</div>
                                <div className="subject_detail_value">{this.state.groupInfo.planLessonsCount}</div>
                            </div>
                            <button onClick={() => this.handleViewGroupButtonClick()} className="btn_st_t">
                                View group students
                            </button>
                        </div>
                    </div>
                )}
                {this.state.isGroupStudents && (
                    <div className="student_panel">
                        <h1 id='title'>Group: {this.state.groupId}</h1>
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
                {this.state.isStudentInfo && (
                    <div className="subject_data_panel_t">
                        <div className="subject_data_st">
                            <h1>Student: {this.state.studentInfo.cred}</h1>
                            <h2>Subject: {this.state.groupInfo.name}</h2>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Grades:</div>
                                <div className="subject_detail_value">{this.state.studentInfo.grades}</div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Average mark:</div>
                                <div className="subject_detail_value">{this.state.studentInfo.averageGrade}</div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Skips count:</div>
                                <div className="subject_detail_value">{this.state.studentInfo.skipsCount}</div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Past classes:</div>
                                <div className="subject_detail_value">{this.state.studentInfo.pastLessonsCount}</div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Planned classes:</div>
                                <div className="subject_detail_value">{this.state.studentInfo.planLessonsCount}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default MainTeacherPage;

