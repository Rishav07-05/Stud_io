(async () => {
  try {
    const res = await fetch("../backend/auth_check.php");
    const data = await res.json();

    if (!data.loggedIn) {
      alert(
        data.message || "You are not logged in. Redirecting to login page..."
      );
      window.location.href = "login.html";
    } else {
      console.log("✅ User is logged in:", data.user_id, data.name);
      document.getElementById("userName").textContent = `👤 ${data.name}`;
    }
  } catch (err) {
    console.error("Failed to check login status:", err);
    alert("An error occurred. Redirecting to login page...");
    window.location.href = "login.html";
  }
})();
