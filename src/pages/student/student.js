import React from "react";
import '../../styles/student.css'

class StudentPage extends React.Component {

    handleProfileClick() {
        this.props.history.push('student/profile');
    }

    render() {
        return (
            <div className="main_st">
                <h2 color="red">Student Page</h2>
                <button onClick={() => this.handleProfileClick()}>Go to profile</button>
            </div>
        )
    }
}

export default StudentPage;

