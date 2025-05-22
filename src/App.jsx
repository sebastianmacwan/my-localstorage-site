// import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import SearchBar from './components/SearchBar'
// import MovieCard from './components/MovieCard'
// import Favorites from './components/Favorites'
// import MovieDetail from './components/MovieDetail'

// function AppContent() {
//   const location = useLocation()

//   const [movies, setMovies] = useState([])
//   const [featured, setFeatured] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
//   const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || [])
//   const [currentQuery, setCurrentQuery] = useState('')
//   const [currentType, setCurrentType] = useState('')
//   const [currentYear, setCurrentYear] = useState('')
//   const [page, setPage] = useState(1)
//   const [hasMore, setHasMore] = useState(true)
//   const [showTopBtn, setShowTopBtn] = useState(false)
//   const [searchKey, setSearchKey] = useState(0)

//   const fetchFeatured = async () => {
//     try {
//       const queries = ['superman', 'avengers', 'harry potter', 'spiderman', 'matrix']
//       const randomQuery = queries[Math.floor(Math.random() * queries.length)]
//       const res = await axios.get(`https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&s=${randomQuery}`)
//       setFeatured(res.data.Search || [])
//     } catch (error) {
//       console.error("Error fetching featured movies", error)
//     }
//   }

//   useEffect(() => {
//     fetchFeatured()
//   }, [])

//   useEffect(() => {
//     localStorage.setItem('favorites', JSON.stringify(favorites))
//   }, [favorites])

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark')
//       localStorage.setItem('theme', 'dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//       localStorage.setItem('theme', 'light')
//     }
//   }, [darkMode])

//   const toggleFavorite = (movie) => {
//     const exists = favorites.find(fav => fav.imdbID === movie.imdbID)
//     if (exists) {
//       setFavorites(favorites.filter(fav => fav.imdbID !== movie.imdbID))
//     } else {
//       setFavorites([...favorites, movie])
//     }
//   }

//   const searchMovies = async (query, pageNumber = 1, type = '', year = '') => {
//     if (!query) return
//     setLoading(true)
//     try {
//       const res = await axios.get(`https://www.omdbapi.com/`, {
//         params: {
//           apikey: import.meta.env.VITE_OMDB_API_KEY,
//           s: query,
//           page: pageNumber,
//           type,
//           y: year
//         }
//       })
//       if (pageNumber === 1) {
//         setMovies(res.data.Search || [])
//         setFeatured([])
//       } else {
//         setMovies(prev => [...prev, ...(res.data.Search || [])])
//       }
//       setHasMore((res.data.Search?.length || 0) > 0)
//     } catch (error) {
//       console.error(error)
//     }
//     setLoading(false)
//   }

//   const handleSearch = (query, type = '', year = '') => {
//     setCurrentQuery(query)
//     setCurrentType(type)
//     setCurrentYear(year)
//     setPage(1)
//     setHasMore(true)

//     if (!query) {
//       setMovies([])
//       fetchFeatured()
//     } else {
//       searchMovies(query, 1, type, year)
//     }
//   }

//   useEffect(() => {
//     const handleScroll = () => {
//       setShowTopBtn(window.scrollY > 300)
//       if (
//         window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
//         hasMore && !loading && currentQuery
//       ) {
//         const nextPage = page + 1
//         setPage(nextPage)
//         searchMovies(currentQuery, nextPage, currentType, currentYear)
//       }
//     }

//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [page, hasMore, loading, currentQuery, currentType, currentYear])

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' })
//   }

//   const clearHome = () => {
//     setCurrentQuery('')
//     setCurrentType('')
//     setCurrentYear('')
//     setMovies([])
//     setPage(1)
//     setHasMore(true)
//     setSearchKey(prev => prev + 1)
//     fetchFeatured()
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-all">
//       <header className="p-4 flex flex-wrap justify-between items-center gap-4">
//         <Link to="/" className="text-l font-bold hover:text-blue-600"><span className='hover:text-xl'>🎬 Movie Search</span></Link>
//         <div className="flex gap-3 items-center">
//           <Link to="/" className="hover:text-xl">🏠 Home</Link>
//           {location.pathname === '/' && (
//             <button
//               onClick={clearHome}
//               className="text-sm px-2 py-1 bg-blue-100 dark:bg-gray-700 rounded hover:bg-blue-200 dark:hover:bg-gray-600"
//             >
//               🔄 Clear Home
//             </button>
//           )}
//           <Link to="/favorites" className="hover:text-xl">⭐ Favorites</Link>
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="px-2 py-1 rounded bg-gray-300 dark:bg-gray-700"
//           >
//             {darkMode ? '🌞 Light' : '🌙 Dark'}
//           </button>
//         </div>
//       </header>

//       <main className="flex-grow px-6">
//         <Routes>
//           <Route path="/" element={
//             <>
//               <SearchBar onSearch={handleSearch} key={searchKey} />
//               {loading && movies.length === 0 ? (
//                 <p className="text-center mt-10">Loading...</p>
//               ) : movies.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
//                   {movies.map((movie) => (
//                     <MovieCard
//                       key={movie.imdbID}
//                       movie={movie}
//                       isFavorite={favorites.some(fav => fav.imdbID === movie.imdbID)}
//                       onAdd={() => toggleFavorite(movie)}
//                       onRemove={() => toggleFavorite(movie)}
//                     />
//                   ))}
//                   {loading && <p className="col-span-full text-center">Loading more...</p>}
//                 </div>
//               ) : featured.length > 0 ? (
//                 <>
//                   <h2 className="text-2xl font-semibold text-center mt-10">🎥 Suggested Movies</h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
//                     {featured.map((movie) => (
//                       <MovieCard
//                         key={movie.imdbID}
//                         movie={movie}
//                         isFavorite={favorites.some(fav => fav.imdbID === movie.imdbID)}
//                         onAdd={() => toggleFavorite(movie)}
//                         onRemove={() => toggleFavorite(movie)}
//                       />
//                     ))}
//                   </div>
//                 </>
//               ) : null}
//             </>
//           } />
//           <Route path="/favorites" element={
//             <Favorites
//               favorites={favorites}
//               onRemove={(id) => toggleFavorite({ imdbID: id })}
//             />
//           } />
//           <Route path="/movie/:imdbID" element={<MovieDetail />} />
//         </Routes>
//       </main>

//       <footer className="bg-gray-100 dark:bg-gray-800 text-center py-6 mt-10 text-sm text-gray-600 dark:text-gray-300">
//         <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
//           <div>
//             <span className="font-semibold">🎬 Movie Search</span> — Made with ❤️ using React & OMDb API
//           </div>
//           <div className="flex gap-4 text-lg">
//             <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="hover:text-blue-500">🐱 GitHub</a>
//             <a href="https://twitter.com/yourusername" target="_blank" rel="noreferrer" className="hover:text-blue-400">🐦 Twitter</a>
//             <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer" className="hover:text-blue-600">💼 LinkedIn</a>
//           </div>
//         </div>
//         <div className="mt-2 text-xs">&copy; {new Date().getFullYear()} Movie Search App. All rights reserved.</div>
//       </footer>

//       {showTopBtn && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
//           title="Back to Top"
//         >
//           ⬆️
//         </button>
//       )}
//     </div>
//   )
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   )
// }

// export default App
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import SearchBar from './components/SearchBar'
import MovieCard from './components/MovieCard'
import Favorites from './components/Favorites'
import MovieDetail from './components/MovieDetail'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

function AppContent() {
  const location = useLocation()

  const [movies, setMovies] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || [])
  const [currentQuery, setCurrentQuery] = useState('')
  const [currentType, setCurrentType] = useState('')
  const [currentYear, setCurrentYear] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const [searchKey, setSearchKey] = useState(0)

  const fetchFeatured = async () => {
    try {
      const queries = ['superman', 'avengers', 'harry potter', 'spiderman', 'matrix']
      const randomQuery = queries[Math.floor(Math.random() * queries.length)]
      const res = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: randomQuery,
        },
      })
      setFeatured(res.data.results || [])
    } catch (error) {
      console.error("Error fetching featured movies", error)
    }
  }

  useEffect(() => { fetchFeatured() }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleFavorite = (movie) => {
    const exists = favorites.find(fav => fav.id === movie.id)
    if (exists) {
      setFavorites(favorites.filter(fav => fav.id !== movie.id))
    } else {
      setFavorites([...favorites, movie])
    }
  }

  const fetchExtraData = async (item) => {
    if (item.media_type === 'person') return item // Skip people
    const id = item.id
    const type = item.media_type || 'movie'

    try {
      const [videoRes, providerRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/${type}/${id}/videos`, {
          params: { api_key: TMDB_API_KEY },
        }),
        axios.get(`https://api.themoviedb.org/3/${type}/${id}/watch/providers`, {
          params: { api_key: TMDB_API_KEY },
        }),
      ])

      const trailer = videoRes.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
      const watchLink = providerRes.data.results?.IN?.link || null

      return {
        ...item,
        trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
        watchUrl: watchLink,
        downloadUrl: watchLink,
      }
    } catch (err) {
      console.error('Error enriching movie:', err)
      return item
    }
  }

  const searchMovies = async (query, pageNumber = 1, type = '', year = '') => {
    if (!query) return
    setLoading(true)

    try {
      const res = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
        params: {
          api_key: TMDB_API_KEY,
          query,
          page: pageNumber,
        },
      })

      const results = (res.data.results || [])
        .filter(item => item.media_type !== 'person') // skip people

      const filtered = results.filter(item => {
        if (type && item.media_type !== type) return false
        if (year) {
          const date = item.release_date || item.first_air_date || ''
          return date.startsWith(year)
        }
        return true
      })

      const enriched = await Promise.all(filtered.map(fetchExtraData))

      if (pageNumber === 1) {
        setMovies(enriched)
        setFeatured([])
      } else {
        setMovies(prev => [...prev, ...enriched])
      }

      setHasMore(enriched.length > 0)
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  const handleSearch = (query, type = '', year = '') => {
    setCurrentQuery(query)
    setCurrentType(type)
    setCurrentYear(year)
    setPage(1)
    setHasMore(true)

    if (!query) {
      setMovies([])
      fetchFeatured()
    } else {
      searchMovies(query, 1, type, year)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300)
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
        hasMore && !loading && currentQuery
      ) {
        const nextPage = page + 1
        setPage(nextPage)
        searchMovies(currentQuery, nextPage, currentType, currentYear)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [page, hasMore, loading, currentQuery, currentType, currentYear])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const clearHome = () => {
    setCurrentQuery('')
    setCurrentType('')
    setCurrentYear('')
    setMovies([])
    setPage(1)
    setHasMore(true)
    setSearchKey(prev => prev + 1)
    fetchFeatured()
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-all">
      <header className="p-4 flex flex-wrap justify-between items-center gap-4">
        <Link to="/" className="text-l font-bold hover:text-blue-600"><span className='hover:text-xl'>🎬 Movie Search</span></Link>
        <div className="flex gap-3 items-center">
          <Link to="/" className="hover:text-xl">🏠 Home</Link>
          {location.pathname === '/' && (
            <button
              onClick={clearHome}
              className="text-sm px-2 py-1 bg-blue-100 dark:bg-gray-700 rounded hover:bg-blue-200 dark:hover:bg-gray-600"
            >
              🔄 Clear Home
            </button>
          )}
          <Link to="/favorites" className="hover:text-xl">⭐ Favorites</Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-2 py-1 rounded bg-gray-300 dark:bg-gray-700"
          >
            {darkMode ? '🌞 Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      <main className="flex-grow px-6">
        <Routes>
          <Route path="/" element={
            <>
              <SearchBar onSearch={handleSearch} key={searchKey} />
              {loading && movies.length === 0 ? (
                <p className="text-center mt-10">Loading...</p>
              ) : movies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                  {movies.map((movie) => (
                    <MovieCard
                      key={`${movie.media_type}-${movie.id}`}
                      movie={movie}
                      isFavorite={favorites.some(fav => fav.id === movie.id)}
                      onAdd={() => toggleFavorite(movie)}
                      onRemove={() => toggleFavorite(movie)}
                    />
                  ))}
                  {loading && <p className="col-span-full text-center">Loading more...</p>}
                </div>
              ) : featured.length > 0 ? (
                <>
                  <h2 className="text-2xl font-semibold text-center mt-10">🎥 Suggested Movies</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                    {featured.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        isFavorite={favorites.some(fav => fav.id === movie.id)}
                        onAdd={() => toggleFavorite(movie)}
                        onRemove={() => toggleFavorite(movie)}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </>
          } />
          <Route path="/favorites" element={
            <Favorites
              favorites={favorites}
              onRemove={(id) => toggleFavorite({ id })}
            />
          } />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 text-center py-6 mt-10 text-sm text-gray-600 dark:text-gray-300">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <span className="font-semibold">🎬 Movie Search</span> — Made with ❤️ using React & TMDb API
          </div>
          <div className="flex gap-4 text-lg">
            <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="hover:text-blue-500">🐱 GitHub</a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noreferrer" className="hover:text-blue-400">🐦 Twitter</a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer" className="hover:text-blue-600">💼 LinkedIn</a>
          </div>
        </div>
        <div className="mt-2 text-xs">&copy; {new Date().getFullYear()} Movie Search App. All rights reserved.</div>
      </footer>

      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          title="Back to Top"
        >
          ⬆️
        </button>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
