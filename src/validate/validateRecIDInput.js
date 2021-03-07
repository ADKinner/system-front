export default function validateRecIDInput(id) {

    let errors = {}

    if (!id) {
        errors.id = "ID required"
    } else if (!/^\d+$/.test(id)) {
        errors.id = "Wrong ID format"
    }

    return errors;
}