export default function validateRecPasswordsInput(values) {

    let errors = {}

    if (!values.confirm_password) {
        errors.confirm_password = "Confirmation password required"
    }

    if (!values.new_password && !values.repeat_password) {
        errors.password = "Passwords are required"
    } else if (!values.new_password || !values.repeat_password) {
        errors.password = "Password is required"
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(values.new_password)) {
        errors.new_password = "Incorrect password format."
    } else if (values.new_password !== values.repeat_password) {
        errors.new_password = "Passwords do not match"
    }

    return errors;
}