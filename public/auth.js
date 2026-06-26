function getSessionId() {
    return localStorage.getItem("sessionId");
}

function checkAuth() {
    if (!getSessionId()) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("role");
    localStorage.removeItem("studentId");
    window.location.href = "login.html";
}

function getAuthHeaders(isJson = false) {
    const headers = {};
    const sessionId = getSessionId();
    if (sessionId) {
        headers["Authorization"] = `Bearer ${sessionId}`;
    }
    if (isJson) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
}

// Run auth check automatically when this script is loaded on protected pages
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAuth);
} else {
    checkAuth();
}
