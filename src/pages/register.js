import React, {useState} from "react";
import '../styles/register.css'

import useForm from "../hooks/useForm";
import validate from "../validate/validateRegInfo";

const RegPage = () => {

    const [isSubmitted, setIsSubmitted] = useState(false);

    const [isCorrect, setIsCorrect] = useState(false);

    const {handleChange, values, handleSubmit, errors} = useForm(submit, validate);

    function submit() {
        setIsSubmitted(true);
    }

    function checkData(values) {
        return true;
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
                            type="password"
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
                            type="password"
                            placeholder="Enter password for your account"
                            value={values.password}
                            onChange={handleChange}
                        />
                        <div className="small_indent"/>
                        <input
                            name="confirm_password"
                            className="in_data_r"
                            type="password"
                            placeholder="Reenter password"
                            value={values.confirm_password}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.password && <div className="indent_r_2">{errors.password}</div>}
                    <button type="submit" className="btn_r">Confirm</button>
                    {/*{*/}
                    {/*    isSubmitted ? (() => {*/}
                    {/*            setIsCorrect(checkData())*/}
                    {/*        })*/}
                    {/*        : ({})*/}
                    {/*}*/}
                    {/*{*/}
                    {/*    isCorrect ? ({}) : (*/}
                    {/*        <div>*/}
                    {/*            Data is incorrect*/}
                    {/*        </div>*/}
                    {/*    )*/}
                    {/*}*/}
                </form>
            </div>
        </div>
    )
};

export default RegPage;