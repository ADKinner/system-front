export default function validateRecPasswordsInput(values) {

    let errors = {}

    if (!values.confirmPassword) {
        errors.confirmPassword = "Confirmation password required"
    }

    if (!values.newPassword && !values.repeatPassword) {
        errors.newPassword = "Passwords are required"
    } else if (!values.newPassword || !values.repeatPassword) {
        errors.newPassword = "Password is required"
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(values.newPassword)) {
        errors.newPassword = "Incorrect password format."
    } else if (values.newPassword !== values.repeatPassword) {
        errors.newPassword = "Passwords do not match"
    }

    return errors;
}