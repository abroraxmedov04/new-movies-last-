// Get elements
const fragment = document.createDocumentFragment();
const elTemplateCard = document.querySelector(".js-template").content;
const elCardWrapper = document.querySelector(".js-movie-list");
const elFormForFunctionality = document.querySelector(
  ".js-form-for-functionality"
);
const elInputSearch = document.querySelector(".js-input-search");
const elSelectCategory = document.querySelector(".js-select-option-input");
const elInputMinYear = document.querySelector(".js-min-year-input");
const elInputMaxYear = document.querySelector(".js-max-year-input");
const elSortSElect = document.querySelector(".js-select-option-input-sort");
const elCanvasBtnModal = document.querySelector(".js-canvas-btn");
const elModalcanvas = document.querySelector(".js-bookmar-lists-canvas");
const elTemplateCanvasCard = document.querySelector(
  ".js-canvas-template-card"
).content;
const canvasFragment = document.createDocumentFragment();
const elCanvasWrapperUl = document.querySelector(".js-canvas-wrapper");
const elCanvasBtn = document.querySelector(".js-canvas-btn");
const elCanvasCloseBtn = document.querySelector(".js-canvas-modal-close-btn");
const elCanvasModal = document.querySelector(".js-canvas-modal-right");
const elModal = document.querySelector(".js-modal");
const elCloseModal = document.querySelector(".js-modal-close");
const elframe = document.querySelector(".js-frame-modal");
const elModalTitle = document.querySelector(".js-movie-title-modal");
const elMovierating = document.querySelector(".js-movie-rating-modal");
const elMovieYear = document.querySelector(".js-movie-year-modal");
const elMovieRuntime = document.querySelector(".js-movie-watch-time-modal");
const elModalSummary = document.querySelector(".js-summary-modal");
const elMovieModalLink = document.querySelector(".js-movie-link-modal");
let bedge = document.querySelector(".js-bedge");

let uniqCategories = [];
console.log(uniqCategories);

// Array to store bookmarked movies
let bookmarksArray =
  JSON.parse(window.localStorage.getItem("bookmarkmovie")) || [];

// Function to update local storage with the latest bookmarks
function updateLocalStorage() {
  localStorage.setItem("bookmarkmovie", JSON.stringify(bookmarksArray));
}

function updateBookmarkBadge() {
  const bookmarkCount = bookmarksArray.length;
  bedge.textContent = bookmarkCount;
}

// Retrieve bookmarks from local storage on page load
const storedBookmarks = localStorage.getItem("bookmarkmovie");
if (storedBookmarks) {
  bookmarksArray = JSON.parse(storedBookmarks);
}

// Function to render unique genres for category filtering
function uniqueGenres(arr) {
  for (const movie of arr) {
    let categories = movie.categories;
    for (const category of categories) {
      if (!uniqCategories.includes(category)) {
        uniqCategories.push(category);
      }
    }
  }
}
uniqueGenres(movies);

// Function to sort movies based on selected values
function sortByValues(elSortSElect, allFunctionality) {
  if (elSortSElect.value == "AtoZ") {
    allFunctionality.sort((a, b) => a.title.localeCompare(b.title));
  } else if (elSortSElect.value == "ZtoA") {
    allFunctionality.sort((a, b) => b.title.localeCompare(a.title));
  } else if (elSortSElect.value == "NewToOld") {
    allFunctionality.sort((a, b) => a.movie_year - b.movie_year);
  } else if (elSortSElect.value == "OldToNewd") {
    allFunctionality.sort((a, b) => b.movie_year - a.movie_year);
  } else if (elSortSElect.value == "TopYoLow") {
    allFunctionality.sort((a, b) => a.imdb_rating - b.imdb_rating);
  } else if (elSortSElect.value == "lowtoTop") {
    allFunctionality.sort((a, b) => b.imdb_rating - a.imdb_rating);
  }
}

// Function to render category options in the filter dropdown
function renderCategory(category) {
  category.forEach((item) => {
    let option = document.createElement("option");
    option.textContent = item;
    option.value = item;
    option.classList.add("js-option-category", "font-bold");
    elSelectCategory.appendChild(option);
  });
}
renderCategory(uniqCategories);

// Function to convert minutes to hours and minutes format
function getHourAndMin(data) {
  let hour = Math.floor(data / 60);
  let min = Math.floor(data % 60);
  return `${hour} h ${min} min`;
}

// Function to render movies on the page
function renderMovies(arr, node, regex = "") {
  arr.forEach((item) => {
    let cloneNode = elTemplateCard.cloneNode(true);
    cloneNode.querySelector(".js-movie-image").src = item.image_url;
    if (regex && regex.source !== "(?:)") {
      cloneNode.querySelector(
        ".js-movie-name"
      ).innerHTML = `${item.title.replace(
        regex,
        (match) =>
          `<mark class="bg-warning py-0 rounded-1 text-light text-capitalize">${match}</mark>`
      )}`;
    } else {
      cloneNode.querySelector(".js-movie-name").textContent =
        item.title.length > 15
          ? `${item.title.substring(0, 15)}...`
          : item.title;
    }
    cloneNode.querySelector(".js-movie-rating").textContent = item.imdb_rating;
    cloneNode.querySelector(".js-movie-year").textContent = item.movie_year;
    cloneNode.querySelector(".js-movie-watch-time").textContent = getHourAndMin(
      item.runtime
    );
    cloneNode.querySelector(".js-movie-genres").textContent =
      item.categories.length > 3
        ? item.categories.slice(0, 3).join(", ")
        : item.categories.join(", ");
    cloneNode.querySelector(".js-modal-btn").dataset.imdbId = item.imdb_id;

    // Check if the movie is bookmarked
    const isBookmarked = bookmarksArray.some((bookmarkedMovie) => {
      return bookmarkedMovie.imdb_id === item.imdb_id;
    });

    // Adjust button and styling based on bookmark status
    const bookmarkButton = cloneNode.querySelector(".js-bookmark-btn");
    const buttonText = bookmarkButton.querySelector(".button-text");
    if (isBookmarked) {
      buttonText.innerText = "Bookmarked";
      bookmarkButton.classList.add(
        "bookmarked",
        "bg-yellow-400",
        "hover:bg-yellow-400",
        "active:bg-yellow-400"
      );
    } else {
      bookmarkButton.dataset.imdbId = item.imdb_id;
    }

    fragment.appendChild(cloneNode);
  });

  // Check if there are no results
  if (arr.length === 0) {
    let noResultsMessage = document.createElement("p");
    noResultsMessage.textContent = "No matching movies found";
    noResultsMessage.classList.add("text-center", "text-gray-500", "my-4");
    node.appendChild(noResultsMessage);
  } else {
    node.appendChild(fragment);
  }
}

// Initial rendering of movies
renderMovies(movies.slice(0, 15), elCardWrapper);

// Event listener for the search form
elFormForFunctionality.addEventListener("submit", (event) => {
  event.preventDefault();
  let inputValue = elInputSearch.value.trim();
  let searchRegex = new RegExp(inputValue, "gi");
  let allFunctionality = movies.filter((item) => {
    return (
      item.title.match(searchRegex) &&
      (elSelectCategory.value == "all" ||
        item.categories.includes(elSelectCategory.value)) &&
      (elInputMinYear.value == "" || item.movie_year >= elInputMinYear.value) &&
      (elInputMaxYear.value == "" || item.movie_year <= elInputMaxYear.value)
    );
  });
  elCardWrapper.innerHTML = "";
  if (allFunctionality.length > 0) {
    sortByValues(elSortSElect, allFunctionality);
    renderMovies(allFunctionality, elCardWrapper, searchRegex);
    console.log("hi Im woriking 🤞");
  } else {
    renderMovies(movies.slice(0, 15), elCardWrapper);
    console.log("No matching movies found");
  }
});

// Event listener for opening the movie details modal
elCardWrapper.addEventListener("click", (event) => {
  if (event.target.classList.contains("js-modal-btn")) {
    let imdb = event.target.dataset.imdbId;
    let getMovie = movies.find((movie) => movie.imdb_id == imdb);
    renderModal(getMovie);
  }
});

// Function to render movie details in the modal
function renderModal(movie) {
  elModal.classList.remove("hidden");
  elCloseModal.addEventListener("click", (event) => {
    elModal.classList.add("hidden");
  });
  elframe.src = movie.movie_frame;
  elModalTitle.textContent = movie.fulltitle;
  elMovierating.textContent = movie.imdb_rating;
  elMovieYear.textContent = movie.movie_year;
  elMovieRuntime.textContent = getHourAndMin(movie.runtime);
  elModalSummary.textContent = movie.summary;
  elMovieModalLink.href = movie.imdb_link;
}

// Event listener for bookmarking movies
elCardWrapper.addEventListener("click", (event) => {
  if (event.target.classList.contains("js-bookmark-btn")) {
    let imdb = event.target.dataset.imdbId;
    const bookmarkedObj = movies.find((item) => item.imdb_id == imdb);
    const buttonText = event.target.querySelector(".button-text");

    if (event.target.classList.contains("bookmarked")) {
      // If already bookmarked, unbookmark
      event.target.classList.remove(
        "bookmarked",
        "bg-yellow-400",
        "hover:bg-yellow-400",
        "active:bg-yellow-400"
      );
      buttonText.innerText = "Add to List";
      const index = bookmarksArray.findIndex((item) => item.imdb_id == imdb);
      if (index !== -1) {
        bookmarksArray.splice(index, 1);
        updateBookmarkBadge();
        updateLocalStorage(); // Update local storage after removing
      }
    } else {
      // If not bookmarked, bookmark
      event.target.classList.add(
        "bookmarked",
        "bg-yellow-400",
        "hover:bg-yellow-400",
        "active:bg-yellow-400"
      );
      buttonText.innerText = "Bookmarked";
      bookmarksArray.push(bookmarkedObj);
      updateBookmarkBadge();
      updateLocalStorage();
    }

    renderBookmarkedMovies(bookmarksArray, elCanvasWrapperUl);
    renderMovies(movies.slice(0, 15), elCardWrapper);
  }
});

// Function to render bookmarked movies in the canvas
function renderBookmarkedMovies(arr, node) {
  node.innerHTML = "";
  arr.forEach((item) => {
    let cloneNode = elTemplateCanvasCard.cloneNode(true);
    cloneNode.querySelector(".canvas-iframe").src = item.movie_frame;
    cloneNode.querySelector(".canvas-title").textContent =
      item.title.split(" ").slice(0, 2) + "...";
    cloneNode.querySelector(".canvas-delete-btn").dataset.imdbId = item.imdb_id;
    node.appendChild(cloneNode);
  });
  updateBookmarkBadge();
}

// Function to toggle the canvas modal
const toggleCanvasModal = () => {
  elCanvasModal.classList.toggle("hidden");
  document.body.classList.toggle("overflow-hidden");
};

// Event listeners for canvas modal
elCanvasBtn.addEventListener("click", toggleCanvasModal);
elCanvasCloseBtn.addEventListener("click", toggleCanvasModal);

// Initial rendering of bookmarked movies
renderBookmarkedMovies(bookmarksArray, elCanvasWrapperUl);

// Event listener for deleting bookmarked movies from the canvas
elCanvasWrapperUl.addEventListener("click", (event) => {
  if (event.target.classList.contains("canvas-delete-btn")) {
    let imdb = event.target.dataset.imdbId;
    console.log("Clicked IMDb ID:", imdb);
    // Find the index of the movie with the given imdb_id in bookmarksArray
    const index = bookmarksArray.findIndex((item) => item.imdb_id === imdb);
    if (index !== -1) {
      bookmarksArray.splice(index, 1);
      updateBookmarkBadge();
      updateLocalStorage();
      renderBookmarkedMovies(bookmarksArray, elCanvasWrapperUl);
    }
  }
});

// Update local storage and re-render bookmarked movies
updateLocalStorage();
renderBookmarkedMovies(bookmarksArray, elCanvasWrapperUl);
renderMovies(movies.slice(0, 15), elCardWrapper);
