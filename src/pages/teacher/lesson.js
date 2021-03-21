import React from "react";
import '../../styles/teacher/main.css';
import {goLoginPage, goProfilePage, goServerErrorPage, goTeacherInfoPage, goTeacherMainPage} from "../../redirect";
import axios from "axios";
import * as constants from "../../constants";

class TeacherLessonPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFindGroup: true,
            isSubjects: false,
            isLessonData: false,
            groupId: '',
            subjectId: '',
            subjects: [],
            students: []
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

    handleGroupInputChange(event) {
        this.setState({
            groupId: event.target.value,
        });
    }

    handleSearchGroupButtonClick() {
        this.getSubjects();
    }

    handleSubjectButtonClick(event) {
        this.setState({
            subjectId: event.target.value,
            isSubjects: false,
            isLessonData: true //add logic tomorrow
        });
    }

    handleLessonButtonClick() {
        if (this.state.isSubjects) {
            this.setState({
                isFindGroup: true,
                isSubjects: false
            });
        } else if (this.state.isLessonData) {
            this.setState({
                isSubjects: true,
                isLessonData: false
            });
        }
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

    render() {
        return (
            <div className="main_t">
                <div className="bar_p">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Logout</a>
                    <a onClick={() => goProfilePage(this.props, '/teacher')}>Profile</a>
                    <a onClick={() => goTeacherInfoPage(this.props)}>Info</a>
                    <a onClick={() => this.handleLessonButtonClick()} className="active">Lessons</a>
                    <a onClick={() => goTeacherMainPage(this.props)}>Main</a>
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
                    <div>
                        <h1>Tomorrow</h1>
                    </div>
                )}
            </div>
        )
    }
}

export default TeacherLessonPage;

