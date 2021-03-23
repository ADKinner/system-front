export function goLoginPage(props) {
    localStorage.clear();
    props.history.push("/login");
}

export function goProfilePage(props, url) {
    props.history.push(url + '/profile');
}

export function goStudentProfilePage(props) {
    props.history.push('/student/profile');
}

export function goTeacherProfilePage(props) {
    props.history.push('/teacher/profile');
}

export function goAdminProfilePage(props) {
    props.history.push('/admin/profile');
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

export function goTeacherMainPage(props) {
    props.history.push("/teacher");
}

export function goTeacherLessonPage(props) {
    props.history.push("/teacher/lessons");
}

export function goTeacherInfoPage(props) {
    props.history.push("/teacher/info")
}

export function goAdminStudentsPage(props) {
    props.history.push('/admin/students');
}

export function goAdminSubjectsPage(props) {
    props.history.push('/admin/subjects');
}

export function goAdminTeachersPage(props) {
    props.history.push('/admin/teachers');
}

export function goAdminGroupsPage(props) {
    props.history.push('/admin/groups');
}

export function goChangePasswordPage(props, email) {
    localStorage.setItem("email", email);
    props.history.push("/change-password")
}

export function goServerErrorPage(props) {
    props.history.push("/500")
}
