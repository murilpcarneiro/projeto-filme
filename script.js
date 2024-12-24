const searchBtn = document.getElementById("search-btn");
const removeBtn = document.querySelector(".remove-btn");
const overlay = document.getElementById("modal-overlay");
const movieName = document.getElementById("movie-name");
const movieYear = document.getElementById("movie-year");
const movieTitle = document.getElementById("movie-title");
const moviePoster = document.getElementById("movie-poster");
const moviePlot = document.getElementById("movie-plot");
const movieCast = document.getElementById("cast");
const movieGenre = document.getElementById("genre");

const movieListContainer = document.getElementById("movie-list");

// let movieList = [];
let movieList = JSON.parse(localStorage.getItem("movieList")) ?? [];

async function searchBtnClickHandler() {
  try {
    let url = `http://www.omdbapi.com/?apikey=${key}&t=${movieNameParameterGenerator()}${movieYearParameterGenerator()}
    `;
    const response = await fetch(url);
    const data = await response.json();
    if (data.Error) {
      throw new Error("Filme não encontrado");
    }
    putMovieOnModal(data);
    overlay.classList.add('open');
  } catch (error) {
    notie.alert({
      type: "error",
      text: error.message,
    });
    console.error(error);
  }
}

function addFilmToList(movieObject) {
  movieList.push(movieObject);
}

function removeFilmFromList(id) {
  notie.confirm({
    text: 'Deseja remover o filme de sua lista?',
    submitText: "Sim",
    cancelText: "Não",
    submitCallback: function removeMovie() {
      movieList = movieList.filter(movie => movie.imdbID !== id);
      document.getElementById(`movie-card-${id}`).remove();
      updateLocalStorage();
    }
  })
}

function verifyRepeatedFilms(id) {
  function doesThisIdBelongToThisMovie(movieObject) {
    return movieObject.imdbID == id;
  }
  return Boolean(movieList.find(doesThisIdBelongToThisMovie));
}

function updateUI(movieObject) {
  movieListContainer.innerHTML +=
    `<article id="movie-card-${movieObject.imdbID}">
        <img
          src="${movieObject.Poster}"
          alt="Poster de ${movieObject.Title}.">
        <button class="remove-btn" onclick="{removeFilmFromList('${movieObject.imdbID}')}"><i class="bi bi-trash"></i> Remover</button>
      </article>`;
}



function movieNameParameterGenerator() {
  if (movieName.value === "") {
    throw new Error("O nome do filme deve ser informado");
  }
  return movieName.value.replaceAll(" ", "+");
}

function movieYearParameterGenerator() {
  if (movieYear.value === "") {
    return "";
  }
  if (movieYear.value.length !== 4 || isNaN(movieYear.value)) {
    throw new Error("Ano do filme inválido.");
  }
  return `&y=${movieYear.value}`;
}

function updateLocalStorage() {
  localStorage.setItem('movieList', JSON.stringify(movieList));
}

for (const movieInfo of movieList) {
  updateUI(movieInfo);
}

searchBtn.addEventListener('click', searchBtnClickHandler);

movieName.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtnClickHandler();
  }
})