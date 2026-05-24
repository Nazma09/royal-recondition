import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import heroBike from "../assets/images/hero-bike.png"

function Home() {

  const [featuredBikes, setFeaturedBikes] = useState([])
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const allBikes = JSON.parse(localStorage.getItem('rrb_bikes') || '[]')
    
    const images = allBikes
      .filter(b => !b.typeMedia || b.typeMedia === 'image')
      .slice(-4)
      .reverse()
    
    const vids = allBikes
      .filter(b => b.typeMedia === 'video')
      .slice(-4)
      .reverse()

    setFeaturedBikes(images)
    setVideos(vids)
  }, [])

  return (
    <div className="bg-black text-white overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center bg-linear-to-br from-black via-gray-950 to-black">
        <div className="absolute top-0 left-0 w-full h-full bg-red-600/10 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-red-500 font-bold tracking-[4px] mb-3">
                NEPAL'S TRUSTED BIKE STORE
              </p>
              <h1 className="text-5xl md:text-7xl font-black leading-none">ROYAL</h1>
              <h1 className="text-5xl md:text-7xl font-black text-red-500 leading-none mb-4">RECONDITION</h1>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-2">PREMIUM BIKES</h2>
              <h2 className="text-3xl md:text-5xl font-black text-red-500 mb-6">BEST EXPERIENCE</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
                Buy, Sell & Exchange Old and New Bikes with Trust & Quality.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/bikes" className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105">
                  Explore Bikes
                </Link>
                <Link to="/exchange" className="border border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-black transition-all">
                  Exchange Your Bike
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="absolute w-87.5 h-87.5 bg-red-600/30 rounded-full blur-3xl"></div>
              <img src={heroBike} alt="Bike"
                className="relative z-10 w-full max-w-187.5 drop-shadow-[0_0_40px_rgba(255,0,0,0.4)] hover:scale-105 transition-all duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-[#0d0d0d] border-y border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🛡️", title: "Premium Quality", desc: "Checked & Verified" },
              { icon: "💰", title: "Best Price", desc: "Great Market Value" },
              { icon: "🔄", title: "Easy Exchange", desc: "Hassle Free Process" },
              { icon: "✅", title: "Trusted Dealer", desc: "Reliable & Transparent" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-red-500 transition-all">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BIKES */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-black">
              FEATURED <span className="text-red-500">BIKES</span>
            </h2>
            <Link to="/bikes" className="border border-gray-700 px-5 py-2 rounded-lg hover:border-red-500">
              View All Bikes
            </Link>
          </div>

          {featuredBikes.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No bike uploaded yet by admin.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredBikes.map((bike, i) => (
                <Link to={`/bikes/${bike.id}`} key={i}
                  className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-red-500 hover:-translate-y-2 duration-300">
                  {bike.img ? (
                    <img src={bike.img} alt={bike.name} className="w-full h-56 object-cover" />
                  ) : (
                    <div className="w-full h-56 bg-gray-800 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-lg">{bike.name}</h3>
                    <p className="text-gray-400 text-sm">{bike.year} Model</p>
                    <p className="text-red-500 text-2xl font-black mt-2">Rs. {bike.price}</p>
                    {bike.type === 'exchange' && (
                      <p className="text-green-400 text-sm mt-2">Exchange Available</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EXCHANGE SECTION */}
      <section className="bg-linear-to-r from-[#140000] to-black py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div>
              <h2 className="text-5xl font-black mb-4">
                EXCHANGE YOUR <span className="text-red-500">BIKE</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">Get the Best Value for Your Old Bike</p>
              <Link to="/exchange" className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg font-bold inline-block">
                Start Exchange
              </Link>
            </div>
            <div className="flex justify-center">
              <img src={heroBike} alt="Exchange Bike"
                className="max-w-125 drop-shadow-[0_0_40px_rgba(255,0,0,0.3)]" />
            </div>
          </div>
        </div>
      </section>

      {/* ✅ LATEST VIDEOS — Fixed */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-black">
              LATEST <span className="text-red-500">VIDEOS</span>
            </h2>
            <Link to="/bikes" className="text-red-500 font-bold hover:underline">
              View All →
            </Link>
          </div>

          {videos.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No videos uploaded yet by admin.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {videos.map((bike, i) => (
                <div key={i}
                  className="group bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-red-500 transition-all hover:-translate-y-2">
                  
                  {/* ✅ FIXED VIDEO */}
                 <video
  src={bike.img}
  className="w-full"
  style={{ aspectRatio: '16/9' }}
  muted
  autoPlay
  loop
  playsInline
  controls
/>

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-white group-hover:text-red-500 transition-all">
                      {bike.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">Rs. {bike.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}

export default Home