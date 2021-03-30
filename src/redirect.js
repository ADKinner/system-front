export function goLoginPage(props) {
    localStorage.clear();
    props.history.push("/login");
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

export function goStudentSubjectsPage(props) {
    props.history.push('/student/subjects')
}

export function goStudentGroupPage(props) {
    props.history.push("/student/group");
}

export function goStudentRecordBookPage(props) {
    props.history.push("/student/record-book");
}

export function goTeacherMainPage(props) {
    props.history.push("/teacher");
}

export function goTeacherLessonPage(props) {
    props.history.push("/teacher/lesson");
}

export function goTeacherExamPage(props) {
    props.history.push("/teacher/exam")
}

export function goAdminStudentsPage(props) {
    props.history.push('/admin/students');
}

export function goAdminRegisterStudentsPage(props) {
    props.history.push('/admin/register/students');
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

export function goAdminsPage(props) {
    props.history.push('/admins');
}

export function goChangePasswordPage(props, email) {
    localStorage.setItem("email", email);
    props.history.push("/change-password")
}

export function goServerErrorPage(props) {
    props.history.push("/500")
}
