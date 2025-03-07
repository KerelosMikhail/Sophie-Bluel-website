// DOM elements
const gallery = document.getElementsByClassName("gallery")[0];
const categoriesContainer = document.getElementById("categories");
const navItem = document.getElementById("navItem"); // Needed to update the navigation item from "Log In" to "Log Out"

//Step 1.1: Retrieving Jobs from the Back-End
// Using fetch to grap the work from API

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    // console.log("works: ", data);
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
  figure.setAttribute("id", work.id);

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
    // Add the edit icon and text next to "My Projects"
    const portfolioSection = document.getElementById("portfolio");
    const editButton = document.createElement("div");
    editButton.classList.add("edit-button");

    const editIcon = document.createElement("img");
    editIcon.src = "./assets/icons/pen-to-square-regular.svg";
    editIcon.alt = "Edit icon";
    editIcon.classList.add("edit-icon");

    const editText = document.createElement("span");
    editText.textContent = "Edit";
    editText.classList.add("edit-text");

    editButton.appendChild(editIcon);
    editButton.appendChild(editText);
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
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const closeButton = document.createElement("span");
    closeButton.textContent = "×";
    closeButton.classList.add("close-button");
    closeButton.addEventListener("click", closeModal);

    const modalTitle = document.createElement("h2");
    modalTitle.textContent = "Photo Gallery";
    modalTitle.classList.add("modal-title");

    const galleryContainer = document.createElement("div");
    galleryContainer.classList.add("gallery-container");

    const works = document.querySelectorAll(".gallery .work img");
    works.forEach((img) => {
      const imgClone = img.cloneNode(true);
      imgClone.classList.add("img-clone");
      const imgContainer = document.createElement("div");
      imgContainer.classList.add("img-container");

      const trashIconContainer = document.createElement("div");
      trashIconContainer.classList.add("trash-icon-container");

      const trashIcon = document.createElement("img");
      trashIcon.src = "./assets/icons/trash-can-solid.png";
      trashIcon.alt = "Delete";
      trashIcon.classList.add("trash-icon");

      trashIcon.addEventListener("click", function () {
        const workId = img.closest(".work").getAttribute("id");
        showDeleteConfirmation(workId, imgContainer);
      });

      trashIconContainer.appendChild(trashIcon);
      imgContainer.appendChild(imgClone);
      imgContainer.appendChild(trashIconContainer);
      galleryContainer.appendChild(imgContainer);
    });

    const separator = document.createElement("hr");
    separator.classList.add("separator");

    const addPhotoButton = document.createElement("button");
    addPhotoButton.textContent = "Add a photo";
    addPhotoButton.classList.add("add-photo-button");
    addPhotoButton.addEventListener("click", openAddPhotoModal);

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

// Function to open the "Add a photo" modal
function openAddPhotoModal() {
  let modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "none";
  }

  let newModal = document.getElementById("new-modal");
  if (!newModal) {
    newModal = document.createElement("div");
    newModal.id = "new-modal";
    newModal.classList.add("modal");

    const newModalContent = document.createElement("div");
    newModalContent.classList.add("new-modal-content");

    const closeButton = document.createElement("span");
    closeButton.textContent = "×";
    closeButton.classList.add("close-button");
    closeButton.addEventListener("click", closeNewModal);

    // New back button container
    const backButtonContainer = document.createElement("div");
    backButtonContainer.classList.add("back-button-container");

    const backButton = document.createElement("img");
    backButton.src = "./assets/icons/arrow-left-solid.svg";
    backButton.alt = "Back";
    backButton.classList.add("back-button");
    backButton.addEventListener("click", function () {
      closeNewModal();
      openModal();
    });

    backButtonContainer.appendChild(backButton);

    const newModalTitle = document.createElement("h2");
    newModalTitle.textContent = "Add photo";
    newModalTitle.classList.add("new-modal-title");

    const rectangle = document.createElement("div");
    rectangle.classList.add("rectangle");

    const imageIcon = document.createElement("img");
    imageIcon.src = "./assets/icons/image-regular.svg";
    imageIcon.alt = "Image";
    imageIcon.classList.add("image-icon");

    const addPhotoBtn = document.createElement("button");
    addPhotoBtn.textContent = "+ Add photo";
    addPhotoBtn.classList.add("add-photo-btn");

    const photoInfo = document.createElement("span");
    photoInfo.textContent = "jpg, png: max 4 MB";
    photoInfo.classList.add("photo-info");

    rectangle.appendChild(imageIcon);
    rectangle.appendChild(addPhotoBtn);
    rectangle.appendChild(photoInfo);

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title";
    titleLabel.classList.add("form-label");

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.classList.add("input-box");

    const categoryLabel = document.createElement("label");
    categoryLabel.textContent = "Category";
    categoryLabel.classList.add("form-label");

    const categoryDropdown = document.createElement("select");
    categoryDropdown.classList.add("dropdown");

    const separator = document.createElement("hr");
    separator.classList.add("separator");

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    confirmButton.classList.add("confirm-button");

    newModalContent.appendChild(closeButton);
    newModalContent.appendChild(backButtonContainer);
    newModalContent.appendChild(newModalTitle);
    newModalContent.appendChild(rectangle);
    newModalContent.appendChild(titleLabel);
    newModalContent.appendChild(titleInput);
    newModalContent.appendChild(categoryLabel);
    newModalContent.appendChild(categoryDropdown);
    newModalContent.appendChild(separator);
    newModalContent.appendChild(confirmButton);
    newModal.appendChild(newModalContent);
    document.body.appendChild(newModal);
  }

  newModal.style.display = "flex";

  // Close newModal when clicking outside of it
  newModal.addEventListener("click", function (event) {
    if (event.target === newModal) {
      closeNewModal();
    }
  });
}

// Function to close the "Add a photo" modal
function closeNewModal() {
  const newModal = document.getElementById("new-modal");
  if (newModal) {
    newModal.style.display = "none";
  }
}

//Step 3.2: Deleting Existing Jobs
// Function to show delete confirmation
function showDeleteConfirmation(workId, imgContainer) {
  const confirmationModal = document.createElement("div");
  confirmationModal.classList.add("modal");

  const confirmationContent = document.createElement("div");
  confirmationContent.classList.add("modal-content");

  const confirmationText = document.createElement("p");
  confirmationText.textContent = "Are you sure you want to delete this item?";

  const yesButton = document.createElement("button");
  yesButton.textContent = "Yes";
  yesButton.classList.add("confirm-button");
  yesButton.addEventListener("click", function () {
    deleteWork(workId, imgContainer, confirmationModal);
  });

  const noButton = document.createElement("button");
  noButton.textContent = "No";
  noButton.classList.add("confirm-button");
  noButton.addEventListener("click", function () {
    confirmationModal.style.display = "none";
  });

  confirmationContent.appendChild(confirmationText);
  confirmationContent.appendChild(yesButton);
  confirmationContent.appendChild(noButton);
  confirmationModal.appendChild(confirmationContent);
  document.body.appendChild(confirmationModal);

  confirmationModal.style.display = "flex";

  // Close confirmationModal when clicking outside of it
  confirmationModal.addEventListener("click", function (event) {
    if (event.target === confirmationModal) {
      confirmationModal.style.display = "none";
    }
  });
}

// Function to delete work
function deleteWork(workId, imgContainer, confirmationModal) {
  // Retrieve the authentication token from local storage
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("Unauthorized: No authentication token found.");
    return;
  }

  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200 || response.status === 204) {
        // Remove the image container from the modal
        imgContainer.remove();
        // Remove the corresponding work element from the gallery
        const workElement = document.getElementById(workId);
        if (workElement) {
          workElement.remove();
        }
        confirmationModal.style.display = "none";
      } else if (response.status === 401) {
        alert("Unauthorized: You do not have permission to delete this item.");
      } else if (response.status === 500) {
        alert("Unexpected Behaviour: Please try again later.");
      } else {
        console.error("Error deleting work: ", response.status);
      }
    })
    .catch((error) => console.error("Error deleting work: ", error));
}
