import React from "react";

export default function validateRegInfo(values) {

    let errors = {}

    if (!values.student_id_number) {
        errors.student_id_number = "Student ID number required"
    }

    if (!values.student_id_password) {
        errors.student_id_password = "Student ID confirmation password required"
    }

    if (!values.password || !values.confirm_password) {
        errors.password = "Password is required"
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(values.password)) {
        errors.password = "Incorrect password format."
    } else if (values.password  !== values.confirm_password) {
        errors.password = "Passwords do not match"
    }

    return errors;
}