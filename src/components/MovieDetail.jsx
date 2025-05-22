// import { useParams } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import axios from 'axios'

// const MovieDetail = () => {
//   const { imdbID } = useParams()
//   const [movie, setMovie] = useState(null)

//   useEffect(() => {
//     const fetchMovie = async () => {
//       const res = await axios.get(`https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=${imdbID}`)
//       setMovie(res.data)
//     }
//     fetchMovie()
//   }, [imdbID])

//   if (!movie) return <p className="text-center">Loading...</p>

//   return (
//     <div className="p-4">
//       <h1 className="text-3xl font-bold">{movie.Title}</h1>
//       <img src={movie.Poster} alt={movie.Title} className="my-4" />
//       <p><strong>Year:</strong> {movie.Year}</p>
//       <p><strong>Genre:</strong> {movie.Genre}</p>
//       <p><strong>Plot:</strong> {movie.Plot}</p>
//       {/* Add more details as needed */}
//     </div>
//   )
// }

// export default MovieDetail

// src/pages/MovieDetail.jsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const MovieDetail = () => {
  const { id } = useParams() // TMDb movie ID
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trailerKey, setTrailerKey] = useState('')
  const [providers, setProviders] = useState([])

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [detailsRes, videosRes, providerRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`)
        ])

        setMovie(detailsRes.data)

        const trailer = videosRes.data.results.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        )
        if (trailer) setTrailerKey(trailer.key)

        const providerData = providerRes.data.results?.IN?.flatrate || []
        setProviders(providerData)
      } catch (error) {
        console.error('Error loading movie details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  if (loading) return <p className="text-center mt-10">Loading movie details...</p>
  if (!movie) return <p className="text-center mt-10">Movie not found.</p>

  return (
    <div className="max-w-5xl mx-auto p-6 text-black dark:text-white">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg w-full md:w-1/3 object-cover"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="italic text-sm mb-2">
            {movie.release_date} | {movie.runtime} mins | {movie.genres.map(g => g.name).join(', ')}
          </p>
          <p className="mb-4">{movie.overview}</p>
          <p className="text-sm text-gray-500 mb-4">⭐ Rating: {movie.vote_average} / 10</p>

          {trailerKey && (
            <a
              href={`https://www.youtube.com/watch?v=${trailerKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              ▶️ Watch Trailer
            </a>
          )}

          {providers.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Available on:</h3>
              <div className="flex gap-4 flex-wrap">
                {providers.map(p => (
                  <div key={p.provider_id} className="flex items-center gap-2">
                    <img
                      src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                      alt={p.provider_name}
                      className="w-8 h-8 rounded"
                    />
                    <span>{p.provider_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetail
