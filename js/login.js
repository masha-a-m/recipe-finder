document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
  
    const users = JSON.parse(localStorage.getItem("users")) || {};
  
    if (users[email] && users[email].password === password) {
      localStorage.setItem("currentUser", email);
      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert("Invalid email or password.");
    }
  });
  
  // Password toggle
  document.getElementById("toggle-password")?.addEventListener("click", () => {
    const pwd = document.getElementById("password");
    const eyeOpen = document.getElementById("eye-open");
    const eyeClosed = document.getElementById("eye-closed");
  
    if (pwd.type === "password") {
      pwd.type = "text";
      eyeOpen.classList.add("hidden");
      eyeClosed.classList.remove("hidden");
    } else {
      pwd.type = "password";
      eyeOpen.classList.remove("hidden");
      eyeClosed.classList.add("hidden");
    }
  });


  const darkToggle = document.getElementById("dark-mode-toggle");
  const html = document.documentElement;

  if (localStorage.getItem("darkMode") === "enabled") {
    html.classList.add("dark");
    darkToggle.checked = true;
  }

  darkToggle.addEventListener("change", () => {
    if (darkToggle.checked) {
      html.classList.add("dark");
      localStorage.setItem("darkMode", "enabled");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("darkMode", "disabled");
    }
  });