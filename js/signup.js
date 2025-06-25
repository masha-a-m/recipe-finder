document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
  
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    const users = JSON.parse(localStorage.getItem("users")) || {};
  
    if (users[email]) {
      alert("An account with this email already exists.");
      return;
    }
  
    users[email] = {
      password: password,
      favorites: [],
      preferences: []
    };
  
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", email);
  
    alert("Account created successfully!");
    window.location.href = "index.html";
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