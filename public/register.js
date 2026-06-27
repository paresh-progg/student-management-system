const registerForm = document.getElementById("registerForm");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const roleSelect = document.getElementById("role");

const studentIdInput = document.getElementById("studentId");
const studentIdGroup = document.getElementById("studentIdGroup");

const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

roleSelect.addEventListener("change", () => {

    if (roleSelect.value === "student") {

        studentIdGroup.style.display = "block";

    } else {

        studentIdGroup.style.display = "none";

    }

});

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    errorMessage.style.display = "none";
    successMessage.style.display = "none";

    const username = usernameInput.value.trim();

    const password = passwordInput.value.trim();

    const confirmPassword = confirmPasswordInput.value.trim();

    const role = roleSelect.value;

    const studentId = studentIdInput.value.trim();

    if (!username || !password || !confirmPassword) {

        errorMessage.innerText = "Please fill all fields.";

        errorMessage.style.display = "block";

        return;

    }

    if (username.length < 3) {

        errorMessage.innerText = "Username must be at least 3 characters.";

        errorMessage.style.display = "block";

        return;

    }

    if (password.length < 6) {

        errorMessage.innerText = "Password must be at least 6 characters.";

        errorMessage.style.display = "block";

        return;

    }

    if (password !== confirmPassword) {

        errorMessage.innerText = "Passwords do not match.";

        errorMessage.style.display = "block";

        return;

    }

    if (role === "student" && studentId === "") {

        errorMessage.innerText = "Student ID is required.";

        errorMessage.style.display = "block";

        return;

    }

    try {

        const response = await fetch("/api/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                username,

                password,

                role,

                studentId: role === "student" ? Number(studentId) : null

            })

        });

        const data = await response.json();

        if (response.ok) {

            successMessage.innerText = "Registration Successful!";

            successMessage.style.display = "block";

            registerForm.reset();

            setTimeout(() => {

                window.location.href = "login.html";

            }, 1500);

        } else {

            errorMessage.innerText = data.message || "Registration failed.";

            errorMessage.style.display = "block";

        }

    } catch (err) {

        console.error(err);

        errorMessage.innerText = "Cannot connect to server.";

        errorMessage.style.display = "block";

    }

});
