// DOM elements
const gallery = document.getElementsByClassName("gallery")[0];

// Using fetch to grap the work from API
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((work) => {
      // Create a new figure element for each work
      const figure = document.createElement("figure");
      figure.classList.add("work");

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
    });
  })
  .catch((error) => console.error("Error fetching works: ", error));

// create a funtion that generate a single work and attach it to 	<div class="gallery"> in line 40 index.html
const work = {
  id: 1,
  title: "Tahina lampshade",
  imageUrl: "http://localhost:5678/images/abajour-tahina1651286843956.png",
  categoryId: 1,
  userId: 1,
  category: {
    id: 1,
    name: "Objects",
  },
};
