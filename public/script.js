const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");

loadStudents();

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const student = {
        roll_no: document.getElementById("roll").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        course: document.getElementById("course").value,
        semester: document.getElementById("semester").value
    };

    let response;

    if(editingId){

        response = await fetch(
            `/api/students/${editingId}`,
            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(student)
            }
        );

        editingId = null;

    }else{

        response = await fetch(
            "/api/students",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(student)
            }
        );

    }

    const data = await response.json();

    alert(data.message);

    form.reset();

    loadStudents();

});

async function loadStudents(){

    const response =
        await fetch("/api/students");

    const students =
        await response.json();

    tableBody.innerHTML = "";

    students.forEach(student => {

        tableBody.innerHTML += `
        <tr>
            <td>${student.id}</td>
            <td>${student.roll_no}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.semester}</td>
            <td>
                <button
                    class="edit-btn"
                    onclick="editStudent(
                    ${student.id},
                    '${student.roll_no}',
                    '${student.name}',
                    '${student.email}',
                    '${student.course}',
                    '${student.semester}'
                    )">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    Delete
                 </button>
            </td>
        </tr>
        `;
    });
}

async function deleteStudent(id){

    await fetch(`/api/students/${id}`,{
        method:"DELETE"
    });

    loadStudents();
}
let editingId = null;

function editStudent(
    id,
    roll_no,
    name,
    email,
    course,
    semester
){

    editingId = id;

    document.getElementById("roll").value = roll_no;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("course").value = course;
    document.getElementById("semester").value = semester;

}
const searchInput =
    document.getElementById("searchInput");

if(searchInput){

    searchInput.addEventListener(
        "keyup",
        function(){

            const value =
                this.value.toLowerCase();

            const rows =
                document.querySelectorAll(
                    "#studentTableBody tr"
                );

            rows.forEach(row => {

                row.style.display =
                    row.innerText
                    .toLowerCase()
                    .includes(value)
                    ? ""
                    : "none";

            });

        }
    );

}