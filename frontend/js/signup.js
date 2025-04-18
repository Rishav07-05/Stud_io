document
  .getElementById("signupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const password = this.password.value;
    const confirmPassword = this.confirm_password.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {document
      .getElementById("signupForm")
      .addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = this.name.value.trim();
        const email = this.email.value.trim();
        const password = this.password.value;
        const confirmPassword = this.confirm_password.value;

        if (password !== confirmPassword) {
          alert("Passwords do not match.");
          return;
        }

        try {
          const response = await fetch("../backend/signup.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
          });

          const result = await response.json();

          if (result.success) {
            alert("Signup successful!");
            window.location.href = "login.html";
          } else {
            alert(result.message || "Signup failed.");
          }
        } catch (err) {
          alert("Something went wrong. Please try again.");
          console.error(err);
        }
      });

      const response = await fetch("../backend/signup.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Signup successful!");
        window.location.href = "login.html";
      } else {
        alert(result.message || "Signup failed.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    }
  });
