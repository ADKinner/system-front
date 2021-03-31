import {goLoginPage, goServerErrorPage} from "../redirect";

export default function handleDefaultError(props, status) {
    if (status === 500) {
        goServerErrorPage(props);
    } else if (status === 401) {
        goLoginPage(props);
    }
}

