document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = this.email.value.trim();
    const password = this.password.value;
    console.log("Form submitted", { email, password });

    try {
      const response = await fetch("../backend/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log("Server response:", result); // Debugging log

      if (result.success) {
        alert("Login successful!");
        localStorage.setItem("user_id", result.user_id);
        localStorage.setItem("user_name", result.name);
        localStorage.setItem("user_email", email); // Add this line
        // Store join date only if not already stored
        if (!localStorage.getItem("joined_date")) {
          const now = new Date();
          localStorage.setItem("joined_date", now.toISOString());
        }

        window.location.href = "home.html"; // Redirect after login
      } else {
        alert(result.message || "Login failed."); 
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error("Error during login:", err); // Improved error logging
    }
  });
