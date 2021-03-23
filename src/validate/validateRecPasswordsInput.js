export default function validateRecPasswordsInput(values) {

    let errors = {}

    if (!values.confirmPassword) {
        errors.confirmPassword = "Требуется пароль-подтверждение"
    }

    if (!values.newPassword && !values.repeatPassword) {
        errors.newPassword = "Требуются пароли"
    } else if (!values.newPassword || !values.repeatPassword) {
        errors.newPassword = "Требуется пароль"
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(values.newPassword)) {
        errors.newPassword = "Неправльный формат пароля"
    } else if (values.newPassword !== values.repeatPassword) {
        errors.newPassword = "Пароли не совпадают"
    }

    return errors;
}