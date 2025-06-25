const currentUser = localStorage.getItem("currentUser");

// Update nav links
const authLink = document.getElementById("auth-link");
const favoritesLink = document.getElementById("favorites-link");

if (currentUser) {
  authLink.textContent = "Profile";
  authLink.setAttribute("href", "profile.html");
  favoritesLink.classList.remove("hidden");
} else {
  authLink.textContent = "Login";
  authLink.setAttribute("href", "login.html");
  favoritesLink.classList.add("hidden");
}

// Load search results from localStorage
const resultsDiv = document.getElementById("results");
const recipes = JSON.parse(localStorage.getItem("searchResults")) || [];

if (recipes.length === 0) {
  resultsDiv.innerHTML = "<p>No recipes found.</p>";
} else {
  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "bg-white rounded shadow overflow-hidden";
    const ingredients = recipe.extendedIngredients?.map(i => i.original).slice(0, 4) || [];

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="font-bold text-lg">${recipe.title}</h3>
        <p class="text-sm text-gray-600">Ready in ${recipe.readyInMinutes} mins</p>
        <ul class="mt-2 list-disc pl-5 text-sm text-gray-700">
          ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
        </ul>
        <div class="mt-4 flex justify-between items-center">
          <a href="details.html?id=${recipe.id}" class="text-blue-600 hover:underline">View Details</a>
          ${currentUser ? `<button class="save-btn text-xs text-white bg-green-500 px-2 py-1 rounded hover:bg-green-600">Save</button>` : ""}
        </div>
      </div>
    `;

    if (currentUser && card.querySelector(".save-btn")) {
      card.querySelector(".save-btn").addEventListener("click", () => {
        let users = JSON.parse(localStorage.getItem("users")) || {};
        if (!users[currentUser]) return;

        const recipeId = recipe.id;
        if (!users[currentUser].favorites.includes(recipeId)) {
          users[currentUser].favorites.push(recipeId);
          localStorage.setItem("users", JSON.stringify(users));
          alert("Saved!");
        } else {
          alert("Already saved.");
        }
      });
    }

    resultsDiv.appendChild(card);
  });
}


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