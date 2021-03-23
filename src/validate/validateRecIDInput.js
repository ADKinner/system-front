export default function validateRecIDInput(id) {

    let errors = {}

    if (!id) {
        errors.id = "Требуется ID"
    } else if (!/^\d+$/.test(id)) {
        errors.id = "Неверный формат"
    }

    return errors;
}