import React, {useState} from "react";
import axios from 'axios';
import '../styles/register.css'
import '../styles/modalReg.css'

import useForm from "../hooks/useForm";
import validate from "../validate/validateRegInfo";
import {useHistory} from "react-router-dom";

const RegPage = () => {

    const history = useHistory();

    const base_url = 'http://localhost:8080';

    const f_reg_request = '/data?id=';

    const s_reg_request = '&password=';

    const password_request = '/password?email=';

    const [confirmPassword, setConfirmPassword] = useState('');

    const [isSubmitted, setIsSubmitted] = useState(false);

    const [isCorrect, setIsCorrect] = useState(false);

    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const {handleChange, values, handleSubmit, errors} = useForm(submit, validate);

    const [checkPassword, setCheckPassword] = useState('');

    let data;

    const [id, setId] = useState(0n);

    const [password, setPassword] = useState('');

    const [name, setName] = useState('');

    const [surname, setSurname] = useState('');

    const [patronymic, setPatronymic] = useState('');

    const [email, setEmail] = useState('');

    const [phoneNumber, setPhoneNumber] = useState('');

    function submit() {
        setIsSubmitted(true);
        checkData();
    }

    function checkData() {
        const url = base_url + f_reg_request + values.student_id_number + s_reg_request + values.student_id_password;
        values.student_id_password = '';
        values.password = '';
        values.confirm_password = '';
        axios.get(url)
            .then(response => {
                setIsCorrect(true);
                data = response.data;
                setId(response.data["studentId"]);
                setPassword(response.data["studentIdPassword"]);
                setName(response.data["studentName"]);
                setSurname(response.data["studentSurname"]);
                setPatronymic(response.data["studentPatronymic"]);
                setEmail(response.data["studentEmail"]);
                setPhoneNumber(response.data["studentPhoneNumber"]);
                console.log(response.data.type);
                const second_url = base_url + password_request + data["studentEmail"];
                axios.get(second_url)
                    .then(res => {
                        setCheckPassword(res.data["password"]);
                    })
            })
            .catch((error) => {
                console.error("Error");
                setIsCorrect(false);
            })
    }

    function onInputPasswordChange(event) {
        setConfirmPassword(event.target.value);
    }

    return (
        <div className="main_r">
            <div className="small_panel_r">
                <svg className="img_r"/>
            </div>
            <div className="panel_r">
                <div className="begin_r">
                    Registration in System
                </div>
                <form className="reg_r" onSubmit={handleSubmit}>
                    <div className="part_r">
                        <div className="description_r">
                            Student ID number
                        </div>
                        <input
                            name="student_id_number"
                            className="in_data_r"
                            type="text"
                            placeholder="Enter your SID number"
                            value={values.student_id_number}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.student_id_number && <div className="indent_r">{errors.student_id_number}</div>}
                    <div className="part_r">
                        <div className="description_r">
                            Student ID confirmation password
                        </div>
                        <input
                            name="student_id_password"
                            className="in_data_r"
                            type={passwordVisibility ? "text" : "password"}
                            placeholder="Enter your SID confirmation password"
                            value={values.student_id_password}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.student_id_password && <div className="indent_r">{errors.student_id_password}</div>}
                    <div className="part_pass_r">
                        <div className="description_r">
                            Password
                        </div>
                        <input
                            name="password"
                            className="in_data_r"
                            type={passwordVisibility ? "text" : "password"}
                            placeholder="Enter password"
                            title="≥ one number, ≥ one lower and uppercase letter and ≥ 8 characters"
                            value={values.password}
                            onChange={handleChange}
                        />
                        <div className="small_indent"/>
                        <input
                            name="confirm_password"
                            className="in_data_r"
                            type={passwordVisibility ? "text" : "password"}
                            placeholder="Reenter password"
                            value={values.confirm_password}
                            onChange={handleChange}
                        />
                    </div>
                    <input type="checkbox"
                           id="check_1"
                           className="check_rm"
                           onClick={() => setPasswordVisibility(!passwordVisibility)}
                    />
                    <label htmlFor="check_1">Show passwords</label>
                    {errors.password && <div className="indent_r_2">{errors.password}</div>}
                    <button type="submit" className="btn_r">Confirm</button>
                </form>
                {isSubmitted && isCorrect &&
                (
                    <React.Fragment>
                        {
                            <div className="modal_rm">
                                <div className="modal_body_rm success">
                                    <h1>Verification</h1>
                                    <h3>
                                        A message with a code has been sent to your phone, enter it to complete
                                        registration.
                                    </h3>
                                    <div>
                                        <input
                                            name="email_password"
                                            className="input_rm"
                                            type="text"
                                            value={confirmPassword}
                                            onChange={onInputPasswordChange}
                                        />
                                        <button
                                            className="btn_rm margin_btn_rm"
                                            onClick={() => {
                                                setConfirmPassword('');
                                                if (confirmPassword === checkPassword) {
                                                    // axios.post(base_url+"/students",{
                                                    //     id: id,
                                                    //     name: name,
                                                    //     surname: surname,
                                                    //     patronymic: patronymic,
                                                    //     password: password,
                                                    //     phoneNumber: phoneNumber,
                                                    //     email: email
                                                    // }).then();
                                                    history.push("/success");
                                                }
                                            }}
                                        >
                                            Send
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="btn_rm btn_rm_success_size"
                                            onClick={() => setIsSubmitted(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </React.Fragment>
                )}
                {isSubmitted && !isCorrect &&
                (
                    <React.Fragment>
                        {
                            <div className="modal_rm">
                                <div className="modal_body_rm">
                                    <h1>Error</h1>
                                    <h3>Input data is incorrect or such SID has been already registered.</h3>
                                    <button
                                        className="btn_rm"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        }
                    </React.Fragment>
                )}
            </div>
        </div>
    )
};

export default RegPage;