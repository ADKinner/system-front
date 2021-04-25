import React from "react";
import {goLoginPage, goStudentGroupPage, goStudentProfilePage, goStudentSubjectsPage} from "../../redirect";
import '../../styles/main.css';
import axios from "axios";
import {
    AND_PARAM,
    DEFAULT_URL,
    EXAM_GRADE_URL,
    GROUP_ID_PARAM,
    Q_PARAM,
    STUDENT_ID_PARAM,
    SUBJECT_ID_PARAM,
    SUBJECTS_URL,
    TERM_ID_PARAM,
    TERMS_URL
} from "../../constants";
import handleDefaultError from "../../handle/handleDefaultReuqestError";
import handleStudentMount from "../../handle/handleStudentMount";
import timeout from "../../handle/timeout";

class StudentRecordBookPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            terms: [],
            examGrades: []
        }
    }

    componentDidMount() {
        handleStudentMount(localStorage);
        this.getTerms();
    }

    recordBookBar() {
        if (this.state.part > 0) {
            this.setState((state) => ({
                    part: state.part - 1
                }
            ));
        }
    }

    getTerms() {
        const groupId = localStorage.getItem("groupId");
        axios.get(DEFAULT_URL + TERMS_URL + Q_PARAM + GROUP_ID_PARAM + groupId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                terms: response.data
            });
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getSubjects(termId) {
        axios.get(DEFAULT_URL + SUBJECTS_URL + Q_PARAM + TERM_ID_PARAM + termId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                subjects: response.data
            });
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getGrades(subjectId) {
        const studentId = localStorage.getItem("id");
        axios.get(DEFAULT_URL + EXAM_GRADE_URL + Q_PARAM + SUBJECT_ID_PARAM + subjectId + AND_PARAM
            + STUDENT_ID_PARAM + studentId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.data !== "") {
                this.setState({
                    examGrades: this.state.examGrades.concat(response.data)
                });
            }
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    async view(termId) {
        this.setState({
            TId: termId
        });
        this.getSubjects(termId);
        await timeout(150);
        this.state.subjects.forEach(s => {
            const subjectId = s.id;
            this.getGrades(subjectId)
        });
        await timeout(150);
        this.setState({
            part: 1
        });
    }

    getMark(subjectId) {
        if (this.state.examGrades.length === 0) {
            return 0;
        }
        const grade = this.state.examGrades.find(g => g.subjectId === subjectId);
        if (grade === undefined || grade.mark == null) {
            return "---";
        } else {
            return grade.mark;
        }
    }

    render() {
        return (
            <div className="main">
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a onClick={() => goStudentProfilePage(this.props)}>Профиль</a>
                    <a className="active" onClick={() => this.recordBookBar()}>Зачётка</a>
                    <a onClick={() => goStudentGroupPage(this.props)}>Группа</a>
                    <a onClick={() => goStudentSubjectsPage(this.props)}>Предметы</a>
                </div>
                {this.state.part === 0 && (
                    <div className="main_data">
                        <div className="data_panel">
                            {this.state.terms.map(term => {
                                return (
                                    <div>
                                        <button
                                            className="btn_data"
                                            value={term.id}
                                            onClick={event => this.view(event.target.value)}
                                        >
                                            {term.number}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                {this.state.part === 1 && (
                    <div className="table_panel">
                        <div>
                            <h1 id='title'>Оценки, {this.state.TId} семестр</h1>
                            <table id='data'>
                                <tbody>
                                <tr>
                                    <th>№</th>
                                    <th>Предмет</th>
                                    <th>Тип сдачи</th>
                                    <th>Преподаватель</th>
                                    <th>Оценка</th>
                                </tr>
                                {this.state.subjects.map((subject, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{subject.name}</td>
                                            <td>{subject.offsetForm}</td>
                                            <td>{subject.examTeacher}</td>
                                            <td>{this.getMark(subject.id)}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default StudentRecordBookPage;