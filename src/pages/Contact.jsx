import { useState } from 'react'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.message) {
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
      type: 'contact'
    }

    try {
      // ✅ Firestore मा save
      await addDoc(collection(db, 'messages'), msgData)

      // ✅ localStorage मा पनि save (backup)
      const msgs = JSON.parse(localStorage.getItem('rrb_messages') || '[]')
      msgs.push(msgData)
      localStorage.setItem('rrb_messages', JSON.stringify(msgs))

      setSent(true)
      setForm({ name: '', phone: '', email: '', message: '' })

    } catch (err) {
      console.log(err)
      alert('Failed to send message!')
    }

    setLoading(false)
  }

  return (
    <div className="bg-gray-950 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-black text-white">CONTACT <span className="text-red-500">US</span></h1>
          <div className="h-1 w-20 bg-red-500 mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Contact Form */}
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-black text-white mb-6">Send Message</h2>

            {sent && (
              <div className="bg-green-600 text-white p-4 rounded mb-6 font-bold">
                ✅ Message sent! We will contact you soon.
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Full Name *</label>
                <input type="text" placeholder="Enter your name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Phone Number *</label>
                <input type="text" placeholder="98XXXXXXXX" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Email</label>
                <input type="email" placeholder="your@email.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Message *</label>
                <textarea placeholder="Type your message..." value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none resize-none" />
              </div>
              <button onClick={handleSubmit} disabled={loading}
                className={`text-white py-3 rounded font-black text-lg transition-all ${
                  loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}>
                {loading ? 'Sending...' : 'SEND MESSAGE'}
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-black text-white mb-4">PROPRIETORS</h3>
              <div className="flex gap-4">
                <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg">S</div>
                <div>
                  <p className="text-white font-bold">Sadam Miya</p>
                  <p className="text-gray-400 text-sm">Co-Proprietor</p>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg">N</div>
                <div>
                  <p className="text-white font-bold">Nasim Miya</p>
                  <p className="text-gray-400 text-sm">Co-Proprietor</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-black text-white mb-4">CONTACT INFO</h3>
              <div className="flex flex-col gap-4">
                {[
                  { icon: '📍', label: 'Location', value: 'Butwal, Milanchowk, Nepal' },
                  { icon: '📞', label: 'Phone', value: '+977 9827485706' },
                  { icon: '✉️', label: 'Email', value: 'royalrecondition@gmail.com' },
                  { icon: '🕐', label: 'Business Hours', value: 'Sun-Fri: 7AM - 7PM' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-gray-400 text-sm">{item.label}</p>
                      <p className="text-white font-bold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Google Map — Butwal */}
            <div className="rounded-lg overflow-hidden border border-gray-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0!2d83.4487!3d27.7006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzAyLjIiTiA4M8KwMjYnNTUuMyJF!5e0!3m2!1sen!2snp!4v1234567890"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Royal Recondition Location"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact