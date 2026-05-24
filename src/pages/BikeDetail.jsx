import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function BikeDetail() {
  const { id } = useParams()
  const [bike, setBike] = useState(null)
  const [allBikes, setAllBikes] = useState([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  // ✅ localStorage from data load
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('rrb_bikes') || '[]')
    setAllBikes(stored)

    const found = stored.find(b => String(b.id) === String(id))
    setBike(found)
    setLoading(false)
  }, [id])

  const handleInquiry = () => {
    if (!form.name || !form.phone) {
      alert('Name and phone required!')
      return
    }

    const msgs = JSON.parse(localStorage.getItem('rrb_messages') || '[]')
    msgs.push({
      ...form,
      id: Date.now(),
      message: `Inquiry for: ${bike.name} (Rs. ${bike.price}) — ${form.message}`,
      date: new Date().toLocaleDateString(),
      read: false,
      reply: ''
    })
    localStorage.setItem('rrb_messages', JSON.stringify(msgs))
    setSent(true)
    setForm({ name: '', phone: '', message: '' })
  }

  // Loading
  if (loading) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <p className="text-white text-2xl font-black animate-pulse">Loading...</p>
      </div>
    )
  }

  // Not found
  if (!bike) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🏍️</p>
          <p className="text-white text-2xl font-black mb-4">Bike फेला परेन!</p>
          <Link to="/bikes" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-bold">
            Back to Bikes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-950 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <Link to="/bikes" className="text-red-500 font-bold hover:underline mb-6 inline-block">
          ← Back to All Bikes
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">

          {/* LEFT — Image or Video */}
          <div>
            {bike.typeMedia === 'video' ? (
              <video
                src={bike.img}
                controls
                className="w-full rounded-lg border border-gray-800 object-cover"
              />
            ) : bike.img ? (
              <img
                src={bike.img}
                alt={bike.name}
                className="w-full rounded-lg border border-gray-800 object-cover hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="w-full h-72 bg-gray-800 rounded-lg flex items-center justify-center text-6xl">
                🏍️
              </div>
            )}

            <span className={`inline-block mt-4 px-4 py-2 rounded font-bold text-white text-sm ${
              bike.type === 'sell' ? 'bg-red-600' : 'bg-green-600'
            }`}>
              {bike.type === 'sell' ? '🏷️ FOR SALE' : '🔄 FOR EXCHANGE'}
            </span>
          </div>

          {/* RIGHT — Details */}
          <div>
            <h1 className="text-4xl font-black text-white mb-2">{bike.name}</h1>
            <p className="text-red-500 font-black text-3xl mb-6">Rs. {bike.price}</p>

            {/* SPECS */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Year', value: bike.year, icon: '📅' },
                { label: 'Engine', value: bike.engine, icon: '⚡' },
                { label: 'KM Run', value: bike.km ? `${bike.km} km` : '-', icon: '🛣️' },
                { label: 'Condition', value: bike.condition, icon: '✨' },
                { label: 'Color', value: bike.color, icon: '🎨' },
                { label: 'Type', value: bike.type === 'sell' ? 'For Sale' : 'Exchange', icon: '🏷️' },
              ].map((s, i) => (
                <div key={i} className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-gray-400 text-xs">{s.icon} {s.label}</p>
                  <p className="text-white font-bold mt-1">{s.value || '-'}</p>
                </div>
              ))}
            </div>

            {/* DESCRIPTION */}
            {bike.desc && (
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 mb-6">
                <h3 className="text-white font-black mb-2">DESCRIPTION</h3>
                <p className="text-gray-400">{bike.desc}</p>
              </div>
            )}

            {/* CALL BUTTON */}
            <a href="tel:+9779827485706"
              className="bg-green-600 text-white w-full py-3 rounded font-black text-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 mb-3">
              📞 Call Now: +977 9827485706
            </a>

            {/* WHATSAPP BUTTON */}
            <a
              href={`https://wa.me/9779827485706?text=Hello, I am interested in ${bike.name} (Rs. ${bike.price})`}
              target="_blank" rel="noreferrer"
              className="bg-green-500 text-white w-full py-3 rounded font-black text-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2">
              💬 WhatsApp Us
            </a>
          </div>
        </div>

        {/* INQUIRY FORM */}
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 mt-10 max-w-xl">
          <h3 className="text-2xl font-black text-white mb-6">SEND INQUIRY</h3>

          {sent && (
            <div className="bg-green-600 text-white p-4 rounded mb-4 font-bold">
              ✅ Inquiry sent! We will contact you soon.
            </div>
          )}

          <div className="flex flex-col gap-4">
            <input type="text" placeholder="Your Name *" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none" />

            <input type="text" placeholder="Phone Number *" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none" />

            <textarea placeholder="Your message..." value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none resize-none" />

            <button onClick={handleInquiry}
              className="bg-red-600 text-white py-3 rounded font-black text-lg hover:bg-red-700 transition-all duration-300">
              SEND INQUIRY
            </button>
          </div>
        </div>

        {/* RELATED BIKES */}
        {allBikes.filter(b => String(b.id) !== String(id)).length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-black text-white mb-6">Related Bikes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allBikes
                .filter(b => String(b.id) !== String(id))
                .slice(0, 3)
                .map(item => (
                  <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-red-500 transition-all">
                    {item.img ? (
                      <img src={item.img} alt={item.name} className="h-52 w-full object-cover" />
                    ) : (
                      <div className="h-52 w-full bg-gray-800 flex items-center justify-center text-4xl">🏍️</div>
                    )}
                    <div className="p-4">
                      <h3 className="text-white font-black text-lg">{item.name}</h3>
                      <p className="text-red-500 font-bold mt-2">Rs. {item.price}</p>
                      <Link to={`/bikes/${item.id}`}
                        className="mt-4 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default BikeDetail