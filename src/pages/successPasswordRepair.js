import React from "react";
import {Link} from "react-router-dom";
import "../styles/success.css";

class SuccessRegistrationPage extends React.Component {

    render() {
        return (
            <div className="main_success">
                <div className="panel_success">
                    <svg className="img_success"/>
                </div>
                <div className="text_success">
                    <h1>Password successfully change</h1>
                    <Link to="/login">Click to go to login page.</Link>
                </div>
            </div>
        )
    }
}

export default SuccessRegistrationPage;