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

export function goStudentMainPage(props) {
    props.history.push('/student')
}

export function goStudentGroupPage(props) {
    props.history.push("/student/group");
}

export function goStudentTeacherPage(props) {
    props.history.push("/student/teachers");
}

export function goChangePasswordPage(props, email) {
    localStorage.setItem("email", email);
    props.history.push("/change-password")
}

export function goServerErrorPage(props) {
    props.history.push("/500")
}
