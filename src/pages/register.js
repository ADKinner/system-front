import React, {useState} from "react";
import axios from 'axios';
import '../styles/register.css'
import '../styles/modalReg.css'

import useForm from "../hooks/useForm";
import validate from "../validate/validateRegInfo";

const RegPage = () => {

    const first_part_request = '/data?id=';

    const second_part_request = '&password=';

    const [isSubmitted, setIsSubmitted] = useState(false);

    const [isCorrect, setIsCorrect] = useState(false);

    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const {handleChange, values, handleSubmit, errors} = useForm(submit, validate);

    function submit() {
        setIsSubmitted(true);
        checkData();
    }

    function checkData() {
        const url = first_part_request + values.student_id_number + second_part_request +
            values.student_id_password;
        console.log(url)
        axios.get(url)
            .then(data => console.log(data))
            .catch((error) => {
                console.error("Error - " + error)
            })
        setIsCorrect(true);
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
                    {isSubmitted && isCorrect && (
                        <React.Fragment>
                            {
                                <div className="modal_rm">
                                    <div className="modal_body_rm success">
                                        <h1>Verification</h1>
                                        <h3>
                                            A message with a code has been sent to your phone, enter it to complete
                                            registration.
                                        </h3>
                                        <form>
                                            <div>
                                                <input
                                                    className="input_rm"
                                                    type="text"
                                                    min="0"
                                                    on
                                                />
                                                <button
                                                    className="btn_rm margin_btn_rm"
                                                    onClick={() => setIsSubmitted(false)}
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </form>
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
                </form>
            </div>
        </div>
    )
};

export default RegPage;