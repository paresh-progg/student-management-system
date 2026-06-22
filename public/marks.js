const marksForm = document.getElementById("marksForm");
const marksStudent = document.getElementById("marksStudent");
const marksSubject = document.getElementById("marksSubject");
const marksScore = document.getElementById("marksScore");
const marksMaxScore = document.getElementById("marksMaxScore");
const marksSemester = document.getElementById("marksSemester");
const marksTableBody = document.getElementById("marksTableBody");
const marksSearch = document.getElementById("marksSearch");

loadMarks();
loadStudentOptions(marksStudent);

marksForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const record = {
        student_id: marksStudent.value,
        subject: marksSubject.value,
        score: marksScore.value,
        max_score: marksMaxScore.value,
        semester: marksSemester.value
    };

    const response = await fetch("/api/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record)
    });

    const data = await response.json();
    alert(data.message);
    marksForm.reset();
    loadMarks();
});

async function loadStudentOptions(selectElement) {
    const response = await fetch("/api/students");
    const students = await response.json();
    selectElement.innerHTML = '<option value="">Select Student</option>';
    students.forEach(student => {
        selectElement.innerHTML += `
            <option value="${student.id}">${student.roll_no} - ${student.name}</option>
        `;
    });
}

async function loadMarks() {
    const response = await fetch("/api/marks");
    const records = await response.json();
    marksTableBody.innerHTML = "";

    records.forEach(record => {
        marksTableBody.innerHTML += `
            <tr>
                <td>${record.id}</td>
                <td>${record.roll_no}</td>
                <td>${record.name}</td>
                <td>${record.subject}</td>
                <td>${record.score}</td>
                <td>${record.max_score}</td>
                <td>${record.semester}</td>
                <td>
                    <button class="delete-btn" onclick="deleteMarks(${record.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function deleteMarks(id) {
    await fetch(`/api/marks/${id}`, {
        method: "DELETE"
    });
    loadMarks();
}

if (marksSearch) {
    marksSearch.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        const rows = document.querySelectorAll("#marksTableBody tr");
        rows.forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
        });
    });
}
