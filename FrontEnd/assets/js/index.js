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

    // Step 3.1: Adding Edit and edit icon for Modal Window
    // Add the edit icon and Edit text next to "My Projects"
    const portfolioSection = document.getElementById("portfolio");
    const editButton = document.createElement("div");
    editButton.classList.add("edit-button");
    editButton.style.display = "flex";
    editButton.style.alignItems = "end";
    editButton.style.marginLeft = "10px"; // Adjust the margin as needed

    const editIcon = document.createElement("img");
    editIcon.src = "./assets/icons/pen-to-square-regular.svg";
    editIcon.alt = "Edit icon";
    editIcon.style.width = "15.58px";
    editIcon.style.height = "15.58px";
    editIcon.style.marginRight = "5px";

    const editText = document.createElement("span");
    editText.textContent = "Edit";
    editText.style.fontFamily = "Work Sans";
    editText.style.fontSize = "14px";
    editText.style.fontWeight = "400";
    editText.style.color = "#000000";

    editButton.appendChild(editIcon);
    editButton.appendChild(editText);
    editButton.style.marginLeft = "30px";
    portfolioSection.querySelector("h2").style.display = "flex";
    portfolioSection.querySelector("h2").style.justifySelf = "center";
    portfolioSection.querySelector("h2").appendChild(editButton);

    // Add event listener to open the modal
    editButton.addEventListener("click", openModal);
  }
}

// Check if the user is already logged in and update the nav item accordingly
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");
  if (token) {
    updateNavItem();
  }
});

// Function to open the modal
function openModal() {
  let modal = document.getElementById("modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "2";

    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "#FFFFFF";
    modalContent.style.padding = "50px";
    modalContent.style.borderRadius = "10px";
    modalContent.style.width = "500px";
    modalContent.style.position = "relative";

    const closeButton = document.createElement("span");
    closeButton.textContent = "×";
    closeButton.style.position = "absolute";
    closeButton.style.top = "20px";
    closeButton.style.right = "20px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "24px";
    closeButton.addEventListener("click", closeModal);

    const modalTitle = document.createElement("h2");
    modalTitle.textContent = "Photo Gallery";
    modalTitle.style.fontFamily = "Work Sans";
    modalTitle.style.fontSize = "26px";
    modalTitle.style.fontWeight = "400";
    modalTitle.style.textAlign = "center";
    modalTitle.style.marginBottom = "30px";

    const galleryContainer = document.createElement("div");
    galleryContainer.style.display = "flex";
    galleryContainer.style.flexWrap = "wrap";
    galleryContainer.style.justifyContent = "flex-start";
    galleryContainer.style.marginTop = "20px";
    galleryContainer.style.gap = "10px";
    galleryContainer.style.marginLeft = "35px";

    const works = document.querySelectorAll(".gallery .work img");
    works.forEach((img) => {
      const imgClone = img.cloneNode(true);
      const imgContainer = document.createElement("div");
      imgContainer.style.width = "76.86px";
      imgContainer.style.height = "102.57px";
      imgContainer.style.overflow = "hidden";
      imgContainer.style.display = "flex";
      imgContainer.style.justifyContent = "center";
      imgContainer.style.alignItems = "center";
      imgClone.style.width = "100%";
      imgClone.style.height = "100%";
      imgClone.style.objectFit = "cover";
      imgContainer.appendChild(imgClone);
      galleryContainer.appendChild(imgContainer);
    });

    const separator = document.createElement("hr");
    separator.style.width = "429px";
    separator.style.border = "1px solid #B3B3B3";
    separator.style.margin = "50px auto";

    const addPhotoButton = document.createElement("button");
    addPhotoButton.textContent = "Add a photo";
    addPhotoButton.style.fontFamily = "Syne";
    addPhotoButton.style.fontSize = "14px";
    addPhotoButton.style.fontWeight = "700";
    addPhotoButton.style.color = "#fff";
    addPhotoButton.style.backgroundColor = "#1d6154";
    addPhotoButton.style.border = "none";
    addPhotoButton.style.borderRadius = "60px";
    addPhotoButton.style.width = "193px";
    addPhotoButton.style.height = "35px";
    addPhotoButton.style.margin = "20px auto";
    addPhotoButton.style.display = "block";
    addPhotoButton.style.cursor = "pointer";

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(galleryContainer);
    modalContent.appendChild(separator);
    modalContent.appendChild(addPhotoButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }

  modal.style.display = "flex";

  // Close modal when clicking outside of it
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "none";
  }
}
