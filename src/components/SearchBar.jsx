// import { useState, useEffect, useRef } from 'react'

// function SearchBar({ onSearch }) {
//   const [query, setQuery] = useState('')
//   const [suggestions, setSuggestions] = useState([])
//   const containerRef = useRef(null)

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (containerRef.current && !containerRef.current.contains(event.target)) {
//         setSuggestions([])
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [])

//   const handleChange = async (e) => {
//     const value = e.target.value
//     setQuery(value)

//     if (value.trim() === '') {
//       onSearch('')
//       setSuggestions([])
//       return
//     }

//     if (value.length > 2) {
//       try {
//         const res = await fetch(`https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&s=${value}`)
//         const data = await res.json()
//         setSuggestions(data.Search || [])
//       } catch (err) {
//         console.error('Error fetching suggestions:', err)
//         setSuggestions([])
//       }
//     } else {
//       setSuggestions([])
//     }
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (query.trim()) {
//       onSearch(query)
//     } else {
//       onSearch('')
//     }
//     setSuggestions([])
//   }

//   const handleSuggestionClick = (suggestion) => {
//     setQuery(suggestion.Title)
//     onSearch(suggestion.Title)
//     setSuggestions([])
//   }

//   return (
//     <div className="relative max-w-xl mx-auto" ref={containerRef}>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={query}
//           onChange={handleChange}
//           placeholder="Search for movies..."
//           className="w-full px-4 py-2 rounded shadow border dark:bg-gray-800 dark:text-white"
//         />
//       </form>

//       {suggestions.length > 0 && (
//         <ul className="absolute bg-white dark:bg-gray-800 border mt-1 w-full z-10 rounded shadow max-h-80 overflow-y-auto">
//           {suggestions.map((movie, i) => (
//             <li
//               key={i}
//               className="flex items-center px-4 py-2 gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
//               onClick={() => handleSuggestionClick(movie)}
//             >
//               <img
//                 src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/50x70?text=No+Image'}
//                 alt={movie.Title}
//                 className="w-10 h-14 object-cover rounded"
//               />
//               <span>{movie.Title}</span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   )
// }

// export default SearchBar
import { useState, useEffect, useRef } from 'react'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [type, setType] = useState('')
  const [year, setYear] = useState('')
  const wrapperRef = useRef(null)

  const handleChange = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim() === '') {
      onSearch('', '', '')
      setSuggestions([])
      return
    }

    if (value.length > 2) {
      try {
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(value)}`
        const res = await fetch(url)
        const data = await res.json()

        // Filter by type if selected (movie, tv, person)
        let filtered = data.results || []
        if (type) {
          filtered = filtered.filter(item => item.media_type === type)
        }

        setSuggestions(filtered)
      } catch (err) {
        console.error('Error fetching TMDb suggestions:', err)
        setSuggestions([])
      }
    } else {
      setSuggestions([])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query, type, year)
    setSuggestions([])
  }

  const handleSuggestionClick = (item) => {
    const title = item.title || item.name
    setQuery(title)
    onSearch(title, item.media_type, year)
    setSuggestions([])
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for movies, TV shows, or people..."
          className="flex-1 px-4 py-2 rounded shadow border-2 dark:bg-gray-800 dark:text-white hover:border-green-500"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 rounded border dark:bg-gray-800 dark:text-white"
        >
          <option value="">All</option>
          <option value="movie">Movie</option>
          <option value="tv">TV Show</option>
          <option value="person">Person</option>
        </select>

        <input
          type="number"
          min="1900"
          max="2025"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          className="w-24 px-3 py-2 rounded border dark:bg-gray-800 dark:text-white"
        />

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Search
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="absolute bg-white dark:bg-gray-800 border mt-1 w-full z-10 rounded shadow max-h-80 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={`${item.id}-${item.media_type}`}
              className="flex items-center px-4 py-2 gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSuggestionClick(item)}
            >
              <img
                src={
                  item.poster_path || item.profile_path
                    ? `https://image.tmdb.org/t/p/w92${item.poster_path || item.profile_path}`
                    : 'https://via.placeholder.com/50x70?text=No+Image'
                }
                alt={item.title || item.name}
                className="w-10 h-14 object-cover rounded"
              />
              <span>
                {item.title || item.name} ({item.media_type})
                {item.release_date || item.first_air_date
                  ? ` (${(item.release_date || item.first_air_date).slice(0, 4)})`
                  : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar
