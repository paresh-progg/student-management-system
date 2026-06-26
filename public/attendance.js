const attendanceForm = document.getElementById("attendanceForm");
const attendanceStudent = document.getElementById("attendanceStudent");
const attendanceDate = document.getElementById("attendanceDate");
const attendanceStatus = document.getElementById("attendanceStatus");
const attendanceTableBody = document.getElementById("attendanceTableBody");
const attendanceSearch = document.getElementById("attendanceSearch");
const role = localStorage.getItem("role");

function getAuthHeaders(isJson = false) {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("sessionId")}`
    };
    if (isJson) headers["Content-Type"] = "application/json";
    return headers;
}

if (role !== "teacher" && attendanceForm) {
    attendanceForm.style.display = "none";
}

loadAttendance();
loadStudentOptions(attendanceStudent);

attendanceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const record = {
        student_id: attendanceStudent.value,
        attendance_date: attendanceDate.value,
        status: attendanceStatus.value
    };

    const response = await fetch("/api/attendance", {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(record)
    });

    const data = await response.json();
    alert(data.message);
    attendanceForm.reset();
    loadAttendance();
});

async function loadStudentOptions(selectElement) {
    const response = await fetch("/api/students", {
        headers: getAuthHeaders()
    });
    const students = await response.json();
    selectElement.innerHTML = '<option value="">Select Student</option>';
    students.forEach(student => {
        selectElement.innerHTML += `
            <option value="${student.id}">${student.roll_no} - ${student.name}</option>
        `;
    });
}

async function loadAttendance() {
    const response = await fetch("/api/attendance", {
        headers: getAuthHeaders()
    });
    const records = await response.json();
    attendanceTableBody.innerHTML = "";

    records.forEach(record => {
        attendanceTableBody.innerHTML += `
            <tr>
                <td>${record.id}</td>
                <td>${record.roll_no}</td>
                <td>${record.name}</td>
                <td>${record.date}</td>
                <td>${record.status}</td>
                <td>
                    ${role === "teacher" ? `<button class="delete-btn" onclick="deleteAttendance(${record.id})">Delete</button>` : ""}
                </td>
            </tr>
        `;
    });
}

async function deleteAttendance(id) {
    await fetch(`/api/attendance/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
    loadAttendance();
}

if (attendanceSearch) {
    attendanceSearch.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        const rows = document.querySelectorAll("#attendanceTableBody tr");
        rows.forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
        });
    });
}
