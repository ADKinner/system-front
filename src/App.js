import './App.css';

function App() {

    return (
        <div className="main">
            <div className="small_panel">
                <svg className="img"/>
            </div>
            <div className="panel">
                <div className="begin">
                    Sign in to System
                </div>
                <form className="login">
                    <div className="part">
                        <div className="description">
                            Username
                        </div>
                        <input className="in_data"/>
                    </div>
                    <div className="part">
                        <div className="description">
                            Password
                        </div>
                        <input className="in_data"/>
                    </div>
                    <button type="submit" className="btn">Login</button>
                </form>
                <form className="register">
                    <div className="information">
                        New to System? Create an account.
                    </div>
                    <button className="btn style">Register</button>
                </form>
            </div>
        </div>
    );
}

export default App;
