document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (!currentUser || !users[currentUser]) {
    alert("You must be logged in to view this page.");
    window.location.href = "login.html";
    return;
  }

  // Populate form fields
  document.getElementById("user-email-input").value = currentUser;
  document.getElementById("username").value = users[currentUser].username || "";
  document.getElementById("avatar").value = users[currentUser].avatar || "";

  // Avatar Preview
  const avatarInput = document.getElementById("avatar");
  const avatarPreview = document.getElementById("avatar-preview");

  avatarInput.addEventListener("input", () => {
    const url = avatarInput.value.trim();
    avatarPreview.src = url || "https://via.placeholder.com/80";    
  });

  // Load dietary preferences (no instant save)
  const prefs = ["vegetarian", "vegan", "glutenFree", "dairyFree"];
  prefs.forEach(pref => {
    const checkbox = document.getElementById(pref);
    checkbox.checked = users[currentUser].preferences.includes(pref);
  });

  // Save Profile Button
  document.getElementById("save-profile").addEventListener("click", () => {
    const emailInput = document.getElementById("user-email-input").value.trim();
    const username = document.getElementById("username").value.trim();
    const avatar = document.getElementById("avatar").value.trim();

    // Change email if needed
    if (emailInput !== currentUser) {
      if (users[emailInput]) {
        alert("That email is already taken.");
        return;
      }

      users[emailInput] = { ...users[currentUser], email: emailInput };
      delete users[currentUser];
      localStorage.setItem("currentUser", emailInput);
      window.location.reload();
    }

    users[emailInput].username = username;
    users[emailInput].avatar = avatar;

    // Save selected preferences
    users[emailInput].preferences = prefs.filter(p => document.getElementById(p).checked);

    localStorage.setItem("users", JSON.stringify(users));
    alert("Settings saved!");
  });

  // Save Preferences Button (Dietary Only)
  const saveBtn = document.getElementById("save-preferences");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const selectedPreferences = prefs
        .filter(pref => document.getElementById(pref).checked);

      // Update user data
      users[currentUser].preferences = selectedPreferences;
      localStorage.setItem("users", JSON.stringify(users));

      // Optional: Show feedback
      saveBtn.textContent = "Saved!";
      saveBtn.classList.replace("bg-blue-600", "bg-green-500");

      setTimeout(() => {
        saveBtn.textContent = "Save Preferences";
        saveBtn.classList.replace("bg-green-500", "bg-blue-600");
      }, 2000);

      alert("Preferences saved!");
    });
  }

  // Logout Button
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    alert("Logged out successfully!");
    window.location.href = "index.html";
  });

  // Dark Mode Toggle
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

  // Load favorite recipes into cards
  const favorites = users[currentUser].favorites || [];
  const favoritesList = document.getElementById("favorites-list");
  const noFavorites = document.getElementById("no-favorites");
  const API_KEY = "97fe6f97cfe646259683f8961b36bf43";

  if (favorites.length === 0) {
    noFavorites.classList.remove("hidden");
  } else {
    favorites.forEach(async (id) => {
      const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${API_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const card = document.createElement("div");
        card.className = "bg-white p-2 rounded shadow text-center text-sm cursor-pointer hover:shadow-md transition";
        card.innerHTML = `
          <img src="${data.image}" alt="${data.title}" class="w-full h-20 object-cover rounded mb-2">
          <p>${data.title}</p>
        `;
        card.addEventListener("click", () => {
          window.location.href = `details.html?id=${id}`;
        });

        favoritesList.appendChild(card);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    });
  }
});