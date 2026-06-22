const reportStudentSelect = document.getElementById("reportStudentSelect");
const studentReportDetails = document.getElementById("studentReportDetails");

loadSummaryReport();
loadReportStudentOptions();

async function loadSummaryReport() {
    const response = await fetch("/api/reports/summary");
    const summary = await response.json();

    document.getElementById("reportTotalStudents").innerText = summary.totalStudents;
    document.getElementById("reportTotalAttendance").innerText = summary.totalAttendance;
    document.getElementById("reportTotalMarks").innerText = summary.totalMarks;
    document.getElementById("reportAttendanceRate").innerText = `${summary.attendanceRate}%`;
    document.getElementById("reportAverageScore").innerText = `${summary.averageScore}%`;
}

async function loadReportStudentOptions() {
    const response = await fetch("/api/students");
    const students = await response.json();

    reportStudentSelect.innerHTML = '<option value="">Select Student</option>';
    students.forEach(student => {
        reportStudentSelect.innerHTML += `
            <option value="${student.id}">${student.roll_no} - ${student.name}</option>
        `;
    });
}

reportStudentSelect.addEventListener("change", async () => {
    const studentId = reportStudentSelect.value;
    if (!studentId) {
        studentReportDetails.innerHTML = "";
        return;
    }

    const response = await fetch(`/api/reports/student/${studentId}`);
    const report = await response.json();

    const attendanceRows = report.attendance.map(row => `
            <li>${row.date}: ${row.status}</li>
        `).join("");

    const marksRows = report.marks.map(row => `
            <li>${row.subject} - ${row.score}/${row.max_score} (${row.semester})</li>
        `).join("");

    studentReportDetails.innerHTML = `
        <div class="report-section">
            <h4>Student</h4>
            <p><strong>Name:</strong> ${report.student.name}</p>
            <p><strong>Roll No:</strong> ${report.student.roll_no}</p>
            <p><strong>Course:</strong> ${report.student.course}</p>
            <p><strong>Semester:</strong> ${report.student.semester}</p>
        </div>
        <div class="report-section">
            <h4>Attendance History</h4>
            <ul>${attendanceRows || '<li>No attendance records</li>'}</ul>
        </div>
        <div class="report-section">
            <h4>Marks History</h4>
            <ul>${marksRows || '<li>No marks records</li>'}</ul>
        </div>
    `;
});
