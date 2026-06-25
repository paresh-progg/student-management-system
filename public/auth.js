// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
}

// Logout function
function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

// Call on page load for protected pages
checkAuth();
