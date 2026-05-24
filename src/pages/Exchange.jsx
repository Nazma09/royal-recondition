import { useState } from 'react'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

function Exchange() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    bikeName: '', bikeYear: '', bikeKm: '',
    bikeCondition: '', wantBike: '', message: ''
  })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.bikeName) {
      alert('Please fill all required fields!')
      return
    }

    setLoading(true)

    const msgData = {
      ...form,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      read: false,
      reply: '',
      type: 'exchange'
    }

    try {
      // ✅ Firestore मा save
      await addDoc(collection(db, 'messages'), msgData)

      // ✅ localStorage backup
      const msgs = JSON.parse(localStorage.getItem('rrb_messages') || '[]')
      msgs.push(msgData)
      localStorage.setItem('rrb_messages', JSON.stringify(msgs))

      setSent(true)
      setForm({
        name: '', phone: '', email: '',
        bikeName: '', bikeYear: '', bikeKm: '',
        bikeCondition: '', wantBike: '', message: ''
      })

    } catch (err) {
      console.log(err)
      alert('Failed to send request!')
    }

    setLoading(false)
  }

  return (
    <div className="bg-gray-950 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-black text-white">EXCHANGE YOUR <span className="text-red-500">BIKE</span></h1>
          <div className="h-1 w-20 bg-red-500 mt-2 mb-4"></div>
          <p className="text-gray-400">Get the best value for your old bike. Fill the form below and we will contact you!</p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { step: '01', title: 'Fill Form', desc: 'Submit your bike details below' },
            { step: '02', title: 'We Contact', desc: 'Our team calls you within 24hrs' },
            { step: '03', title: 'Bike Inspection', desc: 'Free inspection at our store' },
            { step: '04', title: 'Get New Bike', desc: 'Exchange and ride your new bike!' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 p-5 rounded-lg border border-gray-800 text-center">
              <p className="text-red-500 font-black text-3xl">{s.step}</p>
              <p className="text-white font-bold mt-2">{s.title}</p>
              <p className="text-gray-400 text-sm mt-1">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Form */}
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-black text-white mb-6">YOUR DETAILS</h2>

            {sent && (
              <div className="bg-green-600 text-white p-4 rounded mb-6 font-bold">
                ✅ Exchange request sent! We will contact you soon.
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Full Name *</label>
                <input type="text" placeholder="Your name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Phone *</label>
                <input type="text" placeholder="98XXXXXXXX" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none" />
              </div>

              <hr className="border-gray-800" />
              <p className="text-yellow-400 font-bold">YOUR CURRENT BIKE</p>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Bike Name *</label>
                <input type="text" placeholder="e.g. Honda CB Shine 125" value={form.bikeName}
                  onChange={e => setForm({ ...form, bikeName: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Year</label>
                  <input type="text" placeholder="2020" value={form.bikeYear}
                    onChange={e => setForm({ ...form, bikeYear: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">KM Run</label>
                  <input type="text" placeholder="15000" value={form.bikeKm}
                    onChange={e => setForm({ ...form, bikeKm: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Condition</label>
                <select value={form.bikeCondition}
                  onChange={e => setForm({ ...form, bikeCondition: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 outline-none">
                  <option value="">Select condition</option>
                  <option>Excellent</option>
                  <option>Very Good</option>
                  <option>Good</option>
                  <option>Average</option>
                </select>
              </div>

              <hr className="border-gray-800" />
              <p className="text-yellow-400 font-bold">BIKE YOU WANT</p>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Desired Bike</label>
                <input type="text" placeholder="e.g. Yamaha R15 V4" value={form.wantBike}
                  onChange={e => setForm({ ...form, wantBike: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Message</label>
                <textarea placeholder="Any additional info..." value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none resize-none" />
              </div>

              <button onClick={handleSubmit} disabled={loading}
                className={`text-white py-3 rounded font-black text-lg transition-all ${
                  loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}>
                {loading ? 'Sending...' : 'SUBMIT EXCHANGE REQUEST'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-black text-white mb-4">WHY EXCHANGE WITH US?</h3>
              {[
                '✅ Best market value for your bike',
                '✅ Free bike inspection',
                '✅ Same day exchange possible',
                '✅ All paperwork handled by us',
                '✅ Wide range of bikes to choose from',
                '✅ Trusted by 500+ customers',
              ].map((p, i) => (
                <p key={i} className="text-gray-300 mb-3">{p}</p>
              ))}
            </div>
            <div className="bg-red-900 p-6 rounded-lg border border-red-700">
              <h3 className="text-xl font-black text-white mb-2">CALL US DIRECTLY</h3>
              <p className="text-red-200 mb-3">For quick exchange inquiry</p>
              <a href="tel:+9779827485706" className="text-white font-black text-2xl hover:underline">
                +977 9827485706
              </a>
              <p className="text-red-200 text-sm mt-2">Sadm Miya & Nasim Miya</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Exchange