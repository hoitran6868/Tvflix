'use strict';

import { api_key, fetchDataFromServer } from './api.js';
import { sidebar } from './sidebar.js';
import { createMovieCard } from './movie-card.js';
import { search } from './search.js';

//  Collect genre name & url parameter from localStorage
const genreName = window.localStorage.getItem('genreName');
const urlParam = window.localStorage.getItem('urlParam');

const pageContent = document.querySelector('[page-content]');

sidebar();

let currentPage = 1;
let totalPages = 0;

const fetchURL = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`;

fetchDataFromServer(fetchURL, function ({ results: movieList, total_pages }) {
  totalPages = total_pages;

  document.title = `${genreName} Movies - Tvflix`;

  const movieListElement = document.createElement('section');
  movieListElement.classList.add('movie-list', 'gene-list');
  movieListElement.ariaLabel = `${genreName} Movies`;

  movieListElement.innerHTML = `
      <div class="title-wrapper">
        <h1 class="heading">All ${genreName} Movies</h1>
      </div>

      <div class="grid-list"></div>

      <button class="btn load-more" load-more>Load More</button>
    `;

  // add movie card based on fetched item
  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);

    movieListElement.querySelector('.grid-list').appendChild(movieCard);
  }

  pageContent.appendChild(movieListElement);

  // load more button functionality
  document.querySelector('[load-more]').addEventListener('click', function () {
    if (currentPage >= totalPages) {
      this.style.display = 'none'; // this == loading-btn
      return;
    }

    currentPage++;
    this.classList.add('loading'); // this == loading-btn

    fetchDataFromServer(fetchURL, ({ results: movieList }) => {
      this.classList.remove('loading'); // this == loading-btn

      for (const movie of movieList) {
        const movieCard = createMovieCard(movie);

        movieListElement.querySelector('.grid-list').appendChild(movieCard);
      }
    });
  });
});

search();
