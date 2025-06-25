const currentUser = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const authLink = document.getElementById("auth-link");

    if (currentUser) {
      authLink.textContent = "Profile";
      authLink.setAttribute("href", "profile.html");
    } else {
      authLink.textContent = "Login";
      authLink.setAttribute("href", "login.html");
    }

    const favoritesList = document.getElementById("favorites-list");
    const noFavorites = document.getElementById("no-favorites");

    if (!currentUser || !users[currentUser]) {
      noFavorites.classList.remove("hidden");
      noFavorites.textContent = "Please log in to view your favorites.";
    } else {
      const favoriteIds = users[currentUser].favorites || [];

      if (favoriteIds.length === 0) {
        noFavorites.classList.remove("hidden");
      } else {
        const API_KEY = "2c8ddad6f0a64c0895691828727758d8";
      }
    }

    const API_KEY = "2c8ddad6f0a64c0895691828727758d8";

    async function loadFavoriteRecipes() {
      if (!currentUser) {
        noFavorites.classList.remove("hidden");
        return;
      }

      const user = users[currentUser];
      const favoriteIds = user.favorites || [];

      if (favoriteIds.length === 0) {
        noFavorites.classList.remove("hidden");
        return;
      }

      for (const id of favoriteIds) {
        const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${API_KEY}`;
        try {
          const response = await fetch(url);
          const data = await response.json();

          const card = document.createElement("div");
          card.className = "bg-white rounded shadow overflow-hidden flex flex-col h-full";
          card.innerHTML = `
            <img src="${data.image}" alt="${data.title}" class="w-full h-48 object-cover">
            <div class="p-4 flex-grow">
              <h3 class="font-bold text-lg">${data.title}</h3>
              <p class="text-sm text-gray-600">Ready in ${data.readyInMinutes} mins</p>
              <div class="mt-4">
                <a href="details.html?id=${id}" class="text-blue-600 hover:underline">View Details</a>
              </div>
            </div>
          `;
          favoritesList.appendChild(card);
        } catch (error) {
          console.error("Error fetching recipe:", error);
        }
      }
    }

    loadFavoriteRecipes();


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