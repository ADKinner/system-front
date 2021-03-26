export default function validateCreateGroupInput(id) {

    let errors = {};

    if (id == "" || id < 1) {
        errors.id = "ID не может быть пустым";
    }

    return errors;
}