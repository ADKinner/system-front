export default function validateRegInput(values) {

    let errors = {}

    if (!values.studentID) {
        errors.studentID = "Student ID number required"
    }

    if (!values.studentIDPassword) {
        errors.studentIDPassword = "Student ID confirmation password required"
    }

    if (!values.password && !values.confirmPassword) {
        errors.password = "Passwords are required"
    } else if (!values.password || !values.confirmPassword) {
        errors.password = "Password is required"
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(values.password)) {
        errors.password = "Incorrect password format."
    } else if (values.password !== values.confirmPassword) {
        errors.password = "Passwords do not match"
    }

    return errors;
}