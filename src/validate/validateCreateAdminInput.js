export default function validateCreateAdminInput(values, admins) {

    let errors = {}

    if (admins.some(a => a.id == values.id)) {
        errors.id = "Такой ID уже используется";
    } else if (values.id == "" || values.id < 1) {
        errors.id = "ID не может быть пустым";
    }

    if (!/[A-Za-z]{2,32}/.test(values.name)) {
        errors.name = "Введите имя правильно";
    }

    if (!/[A-Za-z]{2,32}/.test(values.surname)) {
        errors.surname = "Введите фамилию правильно";
    }

    if (!/[A-Za-z]{2,32}/.test(values.patronymic)) {
        errors.patronymic = "Введите отчество правильно";
    }

    if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(values.email)) {
        errors.email = "Введите почту правильно";
    }

    if (!values.password && !values.confirmPassword) {
        errors.password = "Требуются пароли";
    } else if (!values.password || !values.confirmPassword) {
        errors.password = "Требуется пароль";
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(values.password)) {
        errors.password = "Неправльный формат пароля"
    } else if (values.password !== values.confirmPassword) {
        errors.password = "Пароли не совпадают";
    }

    return errors;
}