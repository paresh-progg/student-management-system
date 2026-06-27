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
        // ✅ ADD THIS - Log what's happening
        console.log('🌐 Protocol:', window.location.protocol);
        console.log('🌐 Origin:', window.location.origin);
        console.log('🌐 Full URL:', `${window.location.origin}/api/login`);

        // Check if we're using file:// protocol
        if (window.location.protocol === "file:") {
            throw new Error("Please open the login page through http://localhost:3000/login.html instead of file://");
        }

        const response = await fetch(`${window.location.origin}/api/login`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"  // ✅ ADD THIS
            },
            body: JSON.stringify({ username, password })
        });

        // ✅ LOG THE RESPONSE
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);

        const contentType = response.headers.get("content-type") || "";
        const responseText = await response.text();
        
        console.log('📄 Response text (first 200 chars):', responseText.substring(0, 200));

        if (!contentType.includes("application/json")) {
            console.error("❌ Non-JSON response received!");
            console.error("Status:", response.status);
            console.error("Content-Type:", contentType);
            console.error("Full response:", responseText);
            
            // Check if it's a 404 page
            if (response.status === 404) {
                throw new Error("API endpoint not found (404). Is the server running correctly?");
            }
            
            throw new Error(`Server returned ${contentType || 'HTML'} instead of JSON. Status: ${response.status}`);
        }

        const data = JSON.parse(responseText);
        console.log('✅ Parsed JSON:', data);

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
        console.error("❌ Login error:", err);
        errorMessage.innerText = err.message || "Connection error. Please try again.";
        errorMessage.style.display = "block";
    }
});

// ✅ ADD THIS - Log when the page loads
console.log('🔐 Login page loaded');
console.log('📍 Current URL:', window.location.href);
console.log('📍 Protocol:', window.location.protocol);
