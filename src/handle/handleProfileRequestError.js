import {goLoginPage, goServerErrorPage} from "../redirect";

export default function handleProfileDefaultError(props, status) {
    if (status === 500) {
        goServerErrorPage(props);
    } else if (status === 401 || status === 404) {
        goLoginPage(props);
    }
}