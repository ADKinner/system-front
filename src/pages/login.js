import React from "react";
import '../styles/login.css';

class LoginPage extends React.Component {

    goToStudentPage() {
        this.props.history.push('/student');
    }

    render() {
        return (
            <div className="main_l">
                <div className="small_panel_l">
                    <svg className="img_l"/>
                </div>
                <div className="panel_l">
                    <div className="begin_l">
                        Sign in to System
                    </div>
                    <form className="login_l">
                        <div className="part_l">
                            <div className="description_l">
                                Username
                            </div>
                            <input className="in_data_l"/>
                        </div>
                        <div className="part_l">
                            <div className="description_l">
                                Password
                            </div>
                            <input className="in_data_l"/>
                        </div>
                        <button type="submit" className="btn_l" onClick={this.goToStudentPage}>Login</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default LoginPage;