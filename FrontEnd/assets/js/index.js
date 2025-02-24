// DOM elements
const gallery = document.getElementsByClassName("gallery")[0];
const categoriesContainer = document.getElementById("categories");
const navItem = document.getElementById("navItem"); // Needed to update the navigation item from "Log In" to "Log Out"

//Step 1.1: Retrieving Jobs from the Back-End
// Using fetch to grap the work from API

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((work) => {
      // Create a new figure element for each work
      createWork(work);
    });
  })
  .catch((error) => console.error("Error fetching works: ", error));

//Step 1.2: Implementing the Job Filter: Adding Filters to Display Jobs by Category
// Using fetch to grap the categories from API

fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((data) => {
    // Create "All" button
    const allButton = document.createElement("button");
    allButton.textContent = "All";
    allButton.addEventListener("click", () => {
      filterGallery(null);
      setSelectedButton(allButton);
    });
    categoriesContainer.appendChild(allButton);

    // Create button for each category
    data.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.addEventListener("click", () => {
        filterGallery(category.id);
        setSelectedButton(button);
      });
      categoriesContainer.appendChild(button);
    });
  })
  .catch((error) => console.error("Error fetching categories: ", error));

function createWork(work) {
  const figure = document.createElement("figure");
  figure.classList.add("work");
  figure.setAttribute("data-category", work.categoryId);

  // Create an image element
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  // Create a title element
  const title = document.createElement("h3");
  title.textContent = work.title;

  // Append image and title to the work element
  figure.appendChild(img);
  figure.appendChild(title);

  // Append the work element to the gallery
  gallery.appendChild(figure);
}

// Function to filter gallery based on category
function filterGallery(categoryId) {
  const works = document.querySelectorAll(".gallery .work");
  works.forEach((work) => {
    if (
      categoryId === null ||
      work.getAttribute("data-category") == categoryId
    ) {
      work.style.display = "block";
    } else {
      work.style.display = "none";
    }
  });
}

// Function to set the selected button
function setSelectedButton(selectedButton) {
  const buttons = document.querySelectorAll("#categories button");
  buttons.forEach((button) => {
    button.classList.remove("selected");
  });
  selectedButton.classList.add("selected");
}

//Step 2.2: Authentifying a User part 2
// Function to update "Log in" navigation item to "Log Out"
function updateNavItem() {
  if (navItem) {
    navItem.textContent = "Log Out";
    navItem.href = "#";
    navItem.addEventListener("click", function () {
      localStorage.removeItem("authToken"); // Remove the authentication token
      window.location.href = "index.html"; // Redirect to the login page
    });
  }
}

// Check if the user is already logged in and update the nav item accordingly
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");
  if (token) {
    updateNavItem();
  }
});
