import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Bikes() {
  const [bikes, setBikes] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  // ✅ localStorage from data load
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('rrb_bikes') || '[]')
    setBikes(stored)
  }, [])

  const filtered = bikes.filter(b => {
    const matchFilter = filter === 'all' || b.type === filter
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="bg-gray-950 min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white">
            ALL <span className="text-red-500">BIKES</span>
          </h1>
          <div className="h-1 w-20 bg-red-500 mt-2"></div>
          <p className="text-gray-400 mt-2">{filtered.length} bikes found</p>
        </div>

        {/* Filter + Search */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search bike..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-red-500 outline-none w-64"
          />
          {['all', 'sell', 'exchange'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded font-bold capitalize ${
                filter === f ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All Bikes' : f === 'sell' ? 'For Sale' : 'For Exchange'}
            </button>
          ))}
        </div>

        {/* ✅ Empty State */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🏍️</p>
            <p className="text-gray-400 text-xl">No bikes found.</p>
            <p className="text-gray-600 text-sm mt-2">
             Go to the admin dashboard to add bikes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map(bike => (
              <div
                key={bike.id}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-red-500 transition-all hover:-translate-y-1"
              >
                <div className="relative">
                  {/* ✅ Image or Video */}
                  {bike.typeMedia === 'video' ? (
                    <video
                    src={bike.img}
  className="w-full"
  style={{ aspectRatio: '16/9' }}
  muted
  autoPlay
  loop
  playsInline
  controls
                      onMouseOver={e => e.target.play()}
                      onMouseOut={e => { e.target.pause(); e.target.currentTime = 0 }}
                    />
                  ) : bike.img ? (
                    <img src={bike.img} alt={bike.name} className="w-full h-52 object-cover" />
                  ) : (
                    <div className="w-full h-52 bg-gray-800 flex items-center justify-center text-gray-500 text-4xl">
                      🏍️
                    </div>
                  )}

                  <span className={`absolute top-3 left-3 px-3 py-1 rounded text-xs font-bold text-white ${
                    bike.type === 'sell' ? 'bg-red-600' : 'bg-green-600'
                  }`}>
                    {bike.type === 'sell' ? 'FOR SALE' : 'EXCHANGE'}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-black text-white text-lg">{bike.name}</h3>

                  <div className="grid grid-cols-2 gap-2 my-3 text-sm">
                    {bike.year && <p className="text-gray-400">📅 {bike.year}</p>}
                    {bike.engine && <p className="text-gray-400">⚡ {bike.engine}</p>}
                    {bike.km && <p className="text-gray-400">🛣️ {bike.km} km</p>}
                    {bike.condition && <p className="text-gray-400">✨ {bike.condition}</p>}
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <p className="text-red-500 font-black text-xl">Rs. {bike.price}</p>
                    <Link
                      to={`/bikes/${bike.id}`}
                      className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Bikes