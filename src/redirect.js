export function goLoginPage(props) {
    localStorage.clear();
    props.history.push("/login");
}

export function goProfilePage(props, url) {
    props.history.push(url + '/profile');
}

export function goMainPage(props, url) {
    props.history.push(url);
}

export function goStudentGroup(props) {
    props.history.push("student/group");
}

export function goChangePasswordPage(props, email) {
    localStorage.setItem("email", email);
    props.history.push("/change-password")
}

export function goServerErrorPage(props) {
    props.history.push("/500")
}
