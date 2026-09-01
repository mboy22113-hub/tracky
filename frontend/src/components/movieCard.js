export function renderMovieCard(movie, inWishlist = false) {
  const isWishlisted = inWishlist || movie.inWishlist;
  const posterUrl = movie.posterUrl || movie.poster_url || movie.poster || '';
  const matchScore = movie.matchScore || movie.match || 92;
  const platform = movie.ottPlatform || movie.platform_name || movie.platform || 'Prime Video';
  const releaseDate = movie.releaseDate || movie.release_date || 'Sep 2026';
  const genre = movie.genre || 'Action / Drama';
  const trailerUrl = movie.trailerUrl || movie.trailer_url || '';

  return `
    <div class="movie-card" data-movie-id="${movie.id}">
      <div class="movie-poster">
        ${posterUrl ? `
          <img src="${posterUrl}" alt="${movie.title}" class="movie-poster-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'" />
        ` : ''}
        <div class="movie-poster-overlay"></div>
        
        <div class="movie-poster-top">
          <span class="movie-match-tag">${matchScore}% Match</span>
          <button class="movie-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                  data-wishlist-id="${movie.id}" 
                  data-wishlist-title="${movie.title}" 
                  data-wishlist-poster="${posterUrl}" 
                  data-wishlist-platform="${platform}" 
                  title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>

        <div class="movie-poster-bottom">
          <span class="movie-for-you">${platform}</span>
          <div class="movie-poster-title" title="${movie.title}">${movie.title}</div>
        </div>
      </div>

      <div class="movie-meta">
        <div class="movie-genre">${genre}</div>
        <div class="movie-avail">📅 ${releaseDate}</div>
        <div class="movie-platform">
          <span>${platform}</span>
          ${trailerUrl ? `<a class="movie-trailer-link" data-trailer-url="${trailerUrl}" data-trailer-title="${movie.title}">▶ Trailer</a>` : ''}
        </div>
      </div>
    </div>
  `;
}
