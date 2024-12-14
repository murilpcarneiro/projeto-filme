const background = document.getElementById("modal-background");
const addBtn = document.getElementById("add-to-list");
let currentMovie = {};

function backgroundClickHandler() {
  overlay.classList.remove("open");
}

function addCurrentMovieToList() {
  movieName.value = "";
  movieYear.value = "";
  if (verifyRepeatedFilms(currentMovie.imdbID)) {
    notie.alert({ type: "error", text: "filme já está na sua lista!" });
    return;
  }
  addFilmToList(currentMovie);
  updateUI(currentMovie);
  updateLocalStorage();
  overlay.classList.remove('open');
}

addBtn.addEventListener('click', addCurrentMovieToList);

function putMovieOnModal(data) {
  currentMovie = data;

  movieTitle.textContent = `${data.Title} - ${data.Year}`;
  moviePoster.src = data.Poster;
  moviePlot.textContent = data.Plot;
  movieCast.textContent = data.Actors;
  movieGenre.textContent = data.Genre;
}

background.addEventListener('click', backgroundClickHandler);