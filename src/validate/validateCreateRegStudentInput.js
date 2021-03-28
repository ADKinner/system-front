export default function validateCreateRegStudentInput(id, name, surname, patronymic, email, password) {

    let errors = {}

    if (id == "" || id < 1) {
        errors.id = "ID не может быть пустым";
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

    if (!password) {
        errors.password = "Требуется пароль";
    } else if (password.length < 8) {
        errors.password = "Пароль слишком короткий";
    }

    return errors;
}