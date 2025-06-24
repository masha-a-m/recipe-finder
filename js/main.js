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





// load random recipe on page load
async function loadPopularRecipes() {
  const API_KEY = "97fe6f97cfe646259683f8961b36bf43";
  const url = `https://api.spoonacular.com/recipes/random?number=3&apiKey=${API_KEY}`;
  try {
    const response = await fetch(url);
    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // Fallback in case data.recipes is undefined
    if (data && Array.isArray(data.recipes)) {
      displayRecipes(data.recipes);
    } else {
      console.warn("No recipes found in API response", data);
      document.getElementById("results").innerHTML = "<p>No popular recipes found.</p>";
    } 
  } catch (error) {
    console.error("Error loading popular recipes:", error);
    document.getElementById("results").innerHTML = 
    `<p class="text-center text-red-500">Error loading popular recipes</p>`;
    displayRecipes(mockPopularRecipes);

  }
}



let currentSearchResults = [];

function displayRecipes(recipes) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  const currentUser = localStorage.getItem("currentUser");

  if (!recipes || recipes.length === 0) {
    resultsDiv.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  // Store all search results globally for Show More
  currentSearchResults = recipes;

  // Display only first 6 on homepage
  const displayedRecipes = recipes.slice(0, 6);

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
        if (!users[currentUser]) return;

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

  // Show/Hide Show More Button
  const showMoreContainer = document.getElementById("show-more-container");
  if (recipes.length > 6) {
    showMoreContainer.classList.remove("hidden");
  } else {
    showMoreContainer.classList.add("hidden");
  }
}


// show mock recipes
const mockPopularRecipes = [
  {
    id: 1,
    title: "Vegetarian Stir Fry",
    image: "https://media.istockphoto.com/id/600073988/photo/vegetable-stir-fry.webp?a=1&b=1&s=612x612&w=0&k=20&c=xenuWRkahvIbJIzGHUwh-TAl4Rx8Q5-bAcBO08SxkoQ=",
    ingredients: ["Broccoli", "Bell Pepper", "Tofu", "Soy Sauce"],
    readyInMinutes: 25,
  },
  {
    id: 2,
    title: "Gluten-Free Banana Bread",
    image: "https://images.unsplash.com/photo-1592029780368-c1fff15bcfd5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2x1dGVuJTIwZnJlZSUyMGJhbm5hJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D",
    ingredients: ["Bananas", "Almond Flour", "Eggs", "Honey"],
    readyInMinutes: 50,
  },
  {
    id: 3,
    title: "Vegan Chickpea Curry",
    image: "https://plus.unsplash.com/premium_photo-1726769145769-7ff764c537c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dmVnYW4lMjBjaGlja2VucGVhJTIwY3Vycnl8ZW58MHx8MHx8fDA%3D",
    ingredients: ["Chickpeas", "Coconut Milk", "Onion", "Spices"],
    readyInMinutes: 40,
  }
];

// In your catch block:
document.getElementById("results").innerHTML = "<p>Loading failed. Showing popular recipes offline:</p>";
displayRecipes(mockPopularRecipes);




 // Handle Show More click
 document.getElementById("show-more-btn").addEventListener("click", () => {
  localStorage.setItem("searchResults", JSON.stringify(currentSearchResults));
  window.location.href = "search-results.html";
});

document.addEventListener("DOMContentLoaded", () => {
  loadPopularRecipes();
});