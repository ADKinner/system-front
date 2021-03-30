import React from "react";
import '../../styles/teacher.css';
import {goLoginPage} from "../../redirect";

class TeacherExamPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

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

    render() {
        return (
            <div className="main">

            </div>
        )
    }
}

export default TeacherExamPage;

