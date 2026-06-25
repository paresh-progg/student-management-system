function checkAuth() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

// Run auth check automatically when this script is loaded on protected pages
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAuth);
} else {
    checkAuth();
}
