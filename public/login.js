const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorMessage.style.display = "none";
    errorMessage.innerText = "";

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        errorMessage.innerText = "Username and password are required";
        errorMessage.style.display = "block";
        return;
    }

    try {
        if (window.location.protocol === "file:") {
            throw new Error("Please open the login page through http://localhost:3000/login.html instead of file://");
        }

        const baseOrigin = window.location.origin || "http://localhost:3000";
        const response = await fetch(`${baseOrigin}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const contentType = response.headers.get("content-type") || "";
        const responseText = await response.text();

        if (!contentType.includes("application/json")) {
            console.error("Unexpected non-JSON response:", responseText);
            throw new Error("Server returned HTML instead of JSON. Open the login page from http://localhost:3000/login.html and make sure the server is running.");
        }

        const data = JSON.parse(responseText);

        if (response.ok) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", username);
            localStorage.setItem("sessionId", data.sessionId);
            localStorage.setItem("role", data.role);
            if (data.studentId) localStorage.setItem("studentId", data.studentId);
            window.location.href = "dashboard.html";
        } else {
            errorMessage.innerText = data.message || "Login failed";
            errorMessage.style.display = "block";
        }
    } catch (err) {
        console.error("Login error details:", err);
        errorMessage.innerText = err.message || "Connection error. Please try again.";
        errorMessage.style.display = "block";
    }
});
