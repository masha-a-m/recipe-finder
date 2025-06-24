document.addEventListener("DOMContentLoaded", () => {
  const authLink = document.getElementById("auth-link");
  const favoritesLink = document.getElementById("favorites-link");

  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    authLink.textContent = "Profile";
    authLink.setAttribute("href", "profile.html");
    favoritesLink.classList.remove("hidden");
  } else {
    authLink.textContent = "Login";
    authLink.setAttribute("href", "login.html");
    favoritesLink.classList.add("hidden");
  }

  document.getElementById("search-btn").addEventListener("click", () => {
    const query = document.getElementById("search-input").value;
    const filters = Array.from(document.querySelectorAll(".form-checkbox:checked")).map(cb => cb.value);
    const diet = filters.includes("vegetarian") ? "vegetarian" :
                 filters.includes("vegan") ? "vegan" :
                 filters.includes("glutenfree") ? "gluten free" :
                 filters.includes("dairyfree") ? "dairy free" : "";

    fetchRecipes(query, diet);
  });

  loadPopularRecipes();
});


// search functionality
const API_KEY = "97fe6f97cfe646259683f8961b36bf43";

async function fetchRecipes(query = "chicken", diet = "") {
  const url = new URL("https://api.spoonacular.com/recipes/complexSearch"); 
  url.searchParams.append("query", query);
  url.searchParams.append("number", 6);
  url.searchParams.append("apiKey", API_KEY);

  if (diet) {
    url.searchParams.append("diet", diet);
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    displayRecipes(data.results || []);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    document.getElementById("results").innerHTML = "<p>Error loading recipes</p>";
  }
}


// display recipe cards
function displayRecipes(recipes) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  const currentUser = localStorage.getItem("currentUser");

  if (!recipes.length) {
    resultsDiv.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "bg-white rounded shadow overflow-hidden flex flex-col h-full";
    const ingredients = recipe.extendedIngredients?.map(i => i.originalName || i.name).slice(0, 4) || [];

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-48 object-cover">
      <div class="p-4 flex-grow">
        <h3 class="font-bold text-lg">${recipe.title}</h3>
        <p class="text-sm text-gray-600">Ready in ${recipe.readyInMinutes} mins</p>
        <ul class="mt-2 list-disc pl-5 text-sm text-gray-700">
          ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
        </ul>
        <div class="mt-4 flex justify-between items-center pt-2 mt-auto">
          <a href="details.html?id=${recipe.id}" class="text-blue-600 hover:underline">View Details</a>
          ${currentUser ? `<button class="save-btn text-xs text-white bg-green-500 px-2 py-1 rounded hover:bg-green-600">Save</button>` : ""}
        </div>
      </div>
    `;

    // Save functionality
    if (currentUser && card.querySelector(".save-btn")) {
      card.querySelector(".save-btn").addEventListener("click", () => {
        let users = JSON.parse(localStorage.getItem("users")) || {};
        const recipeId = recipe.id;

        if (!users[currentUser].favorites.includes(recipeId)) {
          users[currentUser].favorites.push(recipeId);
          alert("Saved!");
        } else {
          alert("Already saved.");
        }

        localStorage.setItem("users", JSON.stringify(users));
      });
    }

    resultsDiv.appendChild(card);
  });
}


// load random recipe on page load
async function loadPopularRecipes() {
  const url = `https://api.spoonacular.com/recipes/random?number=3&apiKey=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayRecipes(data.recipes);
  } catch (error) {
    console.error("Error loading popular recipes:", error);
    document.getElementById("results").innerHTML = "<p>Error loading popular recipes</p>";
  }
}

//  show only 6 cards
let currentSearchResults = [];

function displayRecipes(recipes) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  // Store all results globally
  currentSearchResults = recipes;

  // Display only 6 on homepage
  const displayedRecipes = recipes.slice(0, 6);
  const currentUser = localStorage.getItem("currentUser");

  displayedRecipes.forEach(recipe => {
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
        const recipeId = recipe.id;
        if (!users[currentUser].favorites.includes(recipeId)) {
          users[currentUser].favorites.push(recipeId);
          alert("Saved!");
        } else {
          alert("Already saved.");
        }
        localStorage.setItem("users", JSON.stringify(users));
      });
    }

    resultsDiv.appendChild(card);
  });

  // Show/Hide Show More button
  const showMoreContainer = document.getElementById("show-more-container");
  if (recipes.length > 6) {
    showMoreContainer.classList.remove("hidden");
  } else {
    showMoreContainer.classList.add("hidden");
  }
}

// Handle Show More click
document.getElementById("show-more-btn").addEventListener("click", () => {
  localStorage.setItem("searchResults", JSON.stringify(currentSearchResults));
  window.location.href = "search-results.html";
});