//Step 2.2: Authentifying a User part 1
// Define DOM elements
const loginForm = document.getElementById("loginSubForm");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const loginButton = document.querySelector("#loginSubForm button");

// Create an error message element
const errorMessage = document.createElement("p");
errorMessage.style.color = "red";
errorMessage.style.display = "none";
loginForm.appendChild(errorMessage);

// Add event listener to the login button
loginButton.addEventListener("click", async function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the email and password values
  const email = emailInput.value;
  const password = passwordInput.value;

  // Validate the email format
  if (!validateEmail(email)) {
    showError("Invalid email format");
    return;
  }

  // Make the API POST call to login
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if the response is successful
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("authToken", data.token); // Store the authentication token
      localStorage.setItem("userId", data.userId); // Store the user ID which is used to identify the user when posting work
      alert(`Welcome back, ${email}!`); // Show welcome message
      window.location.href = "index.html"; // Redirect to the home page
    } else if (response.status === 401) {
      showError("Not Authorized: Incorrect email or password"); // Show error message for incorrect credentials
    } else if (response.status === 404) {
      showError("User not found"); // Show error message for user not found
    } else {
      showError("An error occurred. Please try again later."); // Show error message for any other errors
    }
  } catch (error) {
    showError("An error occurred. Please try again later."); // Show error message for any other errors
  }
});

// Function to validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Function to show error messages
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}
