// import React from 'react';
// import MovieCard from './MovieCard';

// function Favorites({ favorites, toggleFavorite }) {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Your Favorites</h2>
//       {favorites.length === 0 ? (
//         <p>You have no favorite movies yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {favorites.map((movie) => (
//             <MovieCard
//               key={movie.imdbID}
//               movie={movie}
//               isFavorite={true}
//               toggleFavorite={toggleFavorite}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Favorites;

import { useState } from 'react'
import MovieCard from './MovieCard'

const Favorites = ({ favorites, onRemove }) => {
  const [removingIds, setRemovingIds] = useState([])

  const handleRemove = (imdbID) => {
    setRemovingIds((prev) => [...prev, imdbID])
    setTimeout(() => {
      onRemove(imdbID)
      setRemovingIds((prev) => prev.filter(id => id !== imdbID))
    }, 300) // matches transition duration
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">⭐ Your Favorites</h2>

      {favorites.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
          <p className="text-lg">You have no favorite movies yet.</p>
          <p className="text-sm mt-2">Go to the home page and start exploring!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((movie) => (
            <div
              key={movie.imdbID}
              className={`transition-all duration-300 transform ${
                removingIds.includes(movie.imdbID)
                  ? 'opacity-0 scale-95'
                  : 'opacity-100 scale-100'
              }`}
            >
              <MovieCard
                movie={movie}
                isFavorite={true}
                onRemove={() => handleRemove(movie.imdbID)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
