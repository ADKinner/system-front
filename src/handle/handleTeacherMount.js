import {goLoginPage} from "../redirect";

export default function handleTeacherMount(localStorage) {
    const role = localStorage.getItem("role");
    if (localStorage.length === 0 || role === null) {
        goLoginPage(this.props);
    } else {
        switch (role) {
            case "ROLE_TEACHER":
                break;
            default:
                goLoginPage(this.props);
                break;
        }
    }
}