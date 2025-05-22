import { useNavigate } from 'react-router-dom'
import React, { forwardRef } from 'react'

const MovieCard = forwardRef(({ movie, onAdd, onRemove, isFavorite }, ref) => {
  const navigate = useNavigate()

  const mediaType = movie.media_type || 'movie'
  const title = movie.title || movie.name || movie.original_title || movie.original_name || 'Untitled'
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4)
  const id = movie.id || movie.imdbID

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : movie.Poster && movie.Poster !== 'N/A'
    ? movie.Poster
    : 'https://via.placeholder.com/300x450?text=No+Image'

  const handleCardClick = () => {
    if (mediaType === 'tv') {
      navigate(`/tv/${id}`)
    } else {
      navigate(`/movie/${id}`)
    }
  }

  return (
    <div ref={ref} className="group perspective-[1000px]">
      <div
        className="transform transition duration-300 group-hover:scale-105 group-hover:-rotate-x-1 group-hover:rotate-y-1 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg"
      >
        <div onClick={handleCardClick} className="cursor-pointer">
          <img
            src={posterUrl}
            alt={title}
            className="rounded-md mb-4 w-full h-auto"
          />
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-sm mb-2 text-gray-600 dark:text-gray-300">
            {mediaType === 'tv' ? '📺 TV Show' : '🎬 Movie'} {year && ` • ${year}`}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          {movie.trailerUrl && (
            <a
              href={movie.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-center"
            >
              🎞️ Watch Trailer
            </a>
          )}

          {movie.watchUrl && (
            <a
              href={movie.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-center"
            >
              📺 Watch Online
            </a>
          )}

          {movie.downloadUrl && (
            <a
              href={movie.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-center"
            >
              ⬇️ Download
            </a>
          )}

          {isFavorite ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              ❌ Remove
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAdd()
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              ⭐ Add to Favorites
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

export default MovieCard

