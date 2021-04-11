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
    STUDENT_ID_PARAM, SUBJECT_ID_PARAM, SUBJECTS_URL,
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
            this.setState({
                examGrades: response.data
            });
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    async view(termId) {
        this.getGrades(termId);
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
        const grade = this.state.examGrades.find(g => g.id === subjectId);
        if (grade === undefined) {
            return 0;
        } else {
            return grade.value;
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
                                const {termId, termNumber} = term
                                return (
                                    <div>
                                        <button
                                            className="btn_data"
                                            value={termId}
                                            onClick={event => this.view(event.target.value)}
                                        >
                                            {termNumber}
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
                                    <th>Фамилия преподавателя</th>
                                    <th>Имя преподавателя</th>
                                    <th>Отчество преподавателя</th>
                                    <th>Оценка</th>
                                </tr>
                                {this.state.subjects.map((subject, index) => {
                                    const {id, name, examinationTeacher, examinationType} = subject;
                                    const mark = this.getMark(id);
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{name}</td>
                                            <td>{examinationType.name}</td>
                                            <td>{examinationTeacher.surname}</td>
                                            <td>{examinationTeacher.name}</td>
                                            <td>{examinationTeacher.patronymic}</td>
                                            <td>{mark}</td>
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