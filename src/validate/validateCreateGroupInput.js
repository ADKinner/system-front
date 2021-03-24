export default function validateCreateGroupInput(id, groups) {

    let errors = {}

    if (groups.some(g => g.id == id)) {
        errors.id = "Такой ID уже используется";
    } else if (id == "" || id < 1) {
        errors.id = "ID не может быть пустым";
    }

    return errors;
}