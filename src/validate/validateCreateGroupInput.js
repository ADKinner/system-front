export default function validateCreateGroupInput(id) {

    let errors = {};

    if (id == "" || id < 1) {
        errors.id = "ID не может быть пустым";
    } else if (!/[0-9]{2,25}/.test(id)) {
        errors.id = "Неправильный формат ID";
    }

    return errors;
}