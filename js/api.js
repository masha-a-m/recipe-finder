const API_KEY = "2c8ddad6f0a64c0895691828727758d8";

async function fetchRecipes(query = "chicken", diet = "") {
  const url = new URL("https://api.spoonacular.com/recipes/complexSearch"); 
  url.searchParams.append("query", query);
  url.searchParams.append("number", 6);
  url.searchParams.append("apiKey", API_KEY);
  if (diet) url.searchParams.append("diet", diet);

  try {
    const response = await fetch(url);
    const data = await response.json();

    displayRecipes(data.results || []);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    document.getElementById("results").innerHTML = "<p>Error loading recipes</p>";
  }
}

function displayRecipes(recipes) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  const currentUser = localStorage.getItem("currentUser");

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "bg-white rounded shadow overflow-hidden";
    const ingredients = recipe.extendedIngredients?.map(ing => ing.original).slice(0, 4) || [];

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

        if (!users[currentUser].favorites) {
          users[currentUser].favorites = [];
        }

        if (!users[currentUser].favorites.includes(recipeId)) {
          users[currentUser].favorites.push(recipeId);
          alert("Saved!");
        } else {
          alert("Already saved.");
        }

        localStorage.setItem("users", JSON.stringify(users));
      });
    }

    document.getElementById("results").appendChild(card);
  });
}

async function loadPopularRecipes() {
  const url = `https://api.spoonacular.com/recipes/random?number=3&apiKey=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayRecipes(data.recipes);
  } catch (error) {
    console.error("Error loading popular recipes:", error);
  }
}