export default function validateCreateTeacherInput(id, name, surname, patronymic, email, password, confirmPassword) {

    let errors = {};

    if (id == "" || id < 1) {
        errors.id = "ID не может быть пустым или < 0";
    } else if (!/[0-9]{2,25}/.test(id)) {
        errors.id = "Неправильный формат ID";
    }

    if (!/[A-Za-z]{2,32}/.test(name)) {
        errors.name = "Введите имя правильно";
    }

    if (!/[A-Za-z]{2,32}/.test(surname)) {
        errors.surname = "Введите фамилию правильно";
    }

    if (!/[A-Za-z]{2,32}/.test(patronymic)) {
        errors.patronymic = "Введите отчество правильно";
    }

    if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
        errors.email = "Введите почту правильно";
    }

    if (!password && !confirmPassword) {
        errors.password = "Требуются пароли";
    } else if (!password || !confirmPassword) {
        errors.password = "Требуется пароль";
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) {
        errors.password = "Неправльный формат пароля"
    } else if (password !== confirmPassword) {
        errors.password = "Пароли не совпадают";
    }

    return errors;
}