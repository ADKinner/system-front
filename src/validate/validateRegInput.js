export default function validateRegInput(values) {

    let errors = {}

    if (!values.studentID) {
        errors.studentID = "Требуется ID";
    }

    if (!values.studentIDPassword) {
        errors.studentIDPassword = "Требуется пароль для подтверждения ID";
    }

    if (!values.password && !values.confirmPassword) {
        errors.password = "Требуются пароли";
    } else if (!values.password || !values.confirmPassword) {
        errors.password = "Требуется пароль";
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(values.password)) {
        errors.password = "Неправльный формат пароля";
    } else if (values.password !== values.confirmPassword) {
        errors.password = "Пароли не совпадают";
    }

    return errors;
}