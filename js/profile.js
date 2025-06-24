document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
  
    if (!currentUser || !users[currentUser]) {
      alert("You must be logged in to view this page.");
      window.location.href = "login.html";
      return;
    }
  
    document.getElementById("user-email").textContent = currentUser;
  
    const prefs = ["vegetarian", "vegan", "glutenFree", "dairyFree"];
    prefs.forEach(pref => {
      const checkbox = document.getElementById(pref);
      checkbox.checked = users[currentUser].preferences.includes(pref);
  
      checkbox.addEventListener("change", () => {
        const selected = prefs.filter(p => document.getElementById(p).checked);
        users[currentUser].preferences = selected;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Preferences saved!");
      });
    });
  
    // Load favorite recipes
    const favorites = users[currentUser].favorites || [];
    const favoritesList = document.getElementById("favorites-list");
    const noFavorites = document.getElementById("no-favorites");
  
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


// save preferences
document.getElementById("save-preferences").addEventListener("click", () => {
  const prefs = ["vegetarian", "vegan", "glutenFree", "dairyFree"];
  const selected = prefs.filter(pref => document.getElementById(pref).checked);

  users[currentUser].preferences = selected;
  localStorage.setItem("users", JSON.stringify(users));

  // Feedback: Change button text to "Saved!"
  const saveBtn = document.getElementById("save-preferences");
  saveBtn.textContent = "Saved!";
  saveBtn.disabled = true;
  saveBtn.classList.replace("bg-blue-600", "bg-green-500");

  // Revert back after 2 seconds
  setTimeout(() => {
    saveBtn.textContent = "Save Preferences";
    saveBtn.disabled = false;
    saveBtn.classList.replace("bg-green-500", "bg-blue-600");
  }, 2000);
});



// logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    alert("Logged out.");
    window.location.href = "index.html";
  });


// Dark mode toggle
const darkToggle = document.getElementById("dark-mode-toggle");
const html = document.documentElement;

// Load saved preference
if (localStorage.getItem("darkMode") === "enabled") {
  html.classList.add("dark");
  darkToggle.checked = true;
}

// Toggle dark mode
darkToggle.addEventListener("change", () => {
  if (darkToggle.checked) {
    html.classList.add("dark");
    localStorage.setItem("darkMode", "enabled");
  } else {
    html.classList.remove("dark");
    localStorage.setItem("darkMode", "disabled");
  }
});