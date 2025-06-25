# 🍽️ Recipe Finder

> A simple, stylish recipe search app built with HTML, Tailwind CSS, and Vanilla JavaScript.  
> Allows users to search recipes by ingredient or name, filter by dietary preferences, save favorites, and view details using the Spoonacular API.


## 🧾 Features

- 🔍 Search recipes by name or ingredient
- 🥗 Filter by dietary preferences (vegetarian, vegan, gluten-free, dairy-free)
- ❤️ Save favorite recipes (localStorage-based)
- 👤 User authentication: sign up & login
- 👤 Profile page: manage preferences & avatar
- 📱 Responsive design (mobile-friendly)
- 🌙 Dark mode toggle (persistent across pages)
- 💡 Details page: shows full recipe info from Spoonacular
- 🧾 Favorites page: shows all saved recipes
- 🚫 Error handling for missing recipes or failed searches



## 🛠️ Technologies Used

| Tool | Description |
|------|-------------|
| HTML5 | Semantic structure |
| Tailwind CSS | Utility-first styling |
| Vanilla JS | No frameworks, just pure JavaScript |
| LocalStorage | For user auth & preferences |
| Spoonacular API | Recipe data source |



## 📁 Project Structure

```
/recipe-finder
│
├── index.html              ← Home page + search functionality
├── details.html            ← View full recipe details
├── signup.html             ← Register new users
├── login.html              ← Login page
├── profile.html            ← Manage preferences & avatar
├── favorites.html          ← See all saved recipes
├── error.html              ← Friendly error fallback
├── 404.html                ← Optional custom 404 page
│
├── js/
│   ├── main.js             ← Homepage logic
│   ├── api.js              ← Spoonacular integration
│   ├── auth.js             ← Sign-up / Login logic
│   ├── profile.js          ← Preferences + avatar logic
│   └── details.js          ← Full recipe view
│
├── css/
│   └── styles.css          ← Custom Tailwind overrides
│
└── images/                 ← Placeholder / assets
```



## ✅ How to Use

### 1. Clone the repo:

```bash
git clone https://github.com/masha-a-m/recipe-finder.git
```

### 2. Open in browser:

You can open the HTML files directly in your browser — no build tools needed!

Or use a local server:

```bash
npx live-server
```

### 3. Get a free Spoonacular API key:

🔗 [https://spoonacular.com/food-api/console](https://spoonacular.com/food-api/console)

Replace the placeholder key in `js/api.js` or top of each file:

```js
const API_KEY = "YOUR_API_KEY_HERE";
```



## 🧪 Authentication System

User system is localStorage-based (no backend):

- Users can:
  - Sign Up
  - Log In
  - Save favorite recipes
  - Set dietary preferences
  - View profile and avatar



## 🌙 Dark Mode Toggle

Implemented with:

- CSS classes for dark/light themes
- Persistent preference via `localStorage`

Toggle available in:
- All pages



## 🧩 Future Improvements

| Feature | Status |
|--------|--------|
| Backend Integration | ❌ Not implemented yet |
| Real Avatar Upload (file input) | ❌ Coming soon |
| Infinite Scroll or Pagination | ⚠️ Partially done |
| Toast Notifications | ❌ Planned |
| Password Strength Meter | ❌ Planned |
| Offline Support | ⚠️ Mocked with fallback recipes |



## 🙌 Credits

- 🎨 Design inspired by modern food apps
- 🖼️ Images from [Unsplash](https://unsplash.com/)
- 🍽️ Powered by [Spoonacular API](https://spoonacular.com/food-api)



## 📬 Contact

If you have questions, feature requests, or want to contribute, feel free to reach out at:

📧 whisperingcodes@gmail.com  
🐙 GitHub: [github.com/masha-a-m/recipe-finder](https://github.com/masha-a-m/recipe-finder)



## 📜 License

MIT © Maryam Garba – Free to use, modify, and share