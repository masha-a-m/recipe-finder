  const currentUser = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  // Update nav links based on login status
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

  // Save button logic
  const saveBtn = document.getElementById("save-btn");

  if (currentUser && saveBtn) {
      saveBtn.classList.remove("hidden");

      // Check if already saved
      const isSaved = users[currentUser].favorites.includes(parseInt(recipeId));
      saveBtn.textContent = isSaved ? "Saved!" : "Save";

      saveBtn.addEventListener("click", () => {
          const index = users[currentUser].favorites.indexOf(parseInt(recipeId));

          if (index === -1) {
              users[currentUser].favorites.push(parseInt(recipeId));
              saveBtn.textContent = "Saved!";
              alert("Added to your favorites!");
          } else {
              users[currentUser].favorites.splice(index, 1);
              saveBtn.textContent = "Save";
              alert("Removed from favorites.");
          }

          localStorage.setItem("users", JSON.stringify(users));
      });
  }

  // Fetch recipe data
  async function loadRecipeDetails(id) {
      const API_KEY = "2c8ddad6f0a64c0895691828727758d8";
      const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${API_KEY}`;

      try {
          const response = await fetch(url);
          const data = await response.json();

          // Populate page
          document.getElementById("recipe-title").textContent = data.title;
          document.getElementById("recipe-image").src = data.image;

          // Ingredients
          const ingredientsList = document.getElementById("ingredients-list");
          data.extendedIngredients.forEach(ing => {
              const li = document.createElement("li");
              li.textContent = `${ing.original}`;
              ingredientsList.appendChild(li);
          });

          // Instructions
          const instructionsDiv = document.getElementById("instructions");
          instructionsDiv.innerHTML = data.instructions || "<p>No instructions available.</p>";

      } catch (error) {
          console.error("Error fetching recipe:", error);
          document.getElementById("recipe-details").innerHTML = "<p>Error loading recipe details.</p>";
      }
  }

  // Run on page load
  if (!recipeId) {
      document.getElementById("recipe-details").innerHTML = "<p>No recipe selected.</p>";
  } else {
      loadRecipeDetails(recipeId);
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