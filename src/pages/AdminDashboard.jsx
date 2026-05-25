import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { collection, doc, updateDoc, onSnapshot, addDoc, deleteDoc } from 'firebase/firestore'

const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'royal_bikes')
  const resourceType = file.type.startsWith('video') ? 'video' : 'image'
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dztzglzxz/${resourceType}/upload`,
    { method: 'POST', body: formData }
  )
  const data = await res.json()
  return data.secure_url
}

function AdminDashboard() {
  const [bikes, setBikes] = useState([])
  const [messages, setMessages] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [replyText, setReplyText] = useState('')
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [editBike, setEditBike] = useState(null)
  const [mediaFile, setMediaFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)

  const [newBike, setNewBike] = useState({
    name: '', price: '', year: '', km: '',
    engine: '', color: '', condition: '',
    type: 'sell', img: '', video: '', desc: ''
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('rrb_admin') !== 'true') {
      navigate('/admin')
      return
    }

    // ✅ Bikes — Firestore real-time
    const unsubBikes = onSnapshot(collection(db, 'bikes'), (snap) => {
      const data = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }))
      data.sort((a, b) => b.id - a.id)
      setBikes(data)
    })

    // ✅ Messages — Firestore real-time
    const unsubMsgs = onSnapshot(collection(db, 'messages'), (snap) => {
      const msgs = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }))
      msgs.sort((a, b) => b.id - a.id)
      setMessages(msgs)
    })

    return () => {
      unsubBikes()
      unsubMsgs()
    }
  }, [])

  const logout = async () => {
    await signOut(auth)
    localStorage.removeItem('rrb_admin')
    navigate('/admin')
  }

  // ✅ DELETE — Firestore
  const deleteBike = async (firestoreId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this bike?')
    if (!confirmDelete) return
    await deleteDoc(doc(db, 'bikes', firestoreId))
  }

  // ✅ ADD — Firestore
  const addBike = async () => {
    if (!newBike.name || !newBike.price) {
      alert('Name and price required!')
      return
    }
    try {
      setUploading(true)
      let uploadedUrl = ''
      if (mediaFile) {
        uploadedUrl = await uploadToCloudinary(mediaFile)
      }
      const bikeData = {
        ...newBike,
        img: uploadedUrl,
        typeMedia: mediaFile?.type.startsWith('video') ? 'video' : 'image',
        id: Date.now(),
        createdAt: new Date().toLocaleDateString()
      }
      await addDoc(collection(db, 'bikes'), bikeData)
      setNewBike({ name: '', price: '', year: '', km: '', engine: '', color: '', condition: '', type: 'sell', img: '', video: '', desc: '' })
      setMediaFile(null)
      setPreview('')
      setUploading(false)
      alert('Bike added successfully!')
    } catch (error) {
      console.log(error)
      alert('Upload failed')
      setUploading(false)
    }
  }

  const sendReply = async () => {
    if (!replyText || !selectedMsg) return
    try {
      const msgRef = doc(db, 'messages', selectedMsg.firestoreId)
      await updateDoc(msgRef, { reply: replyText, read: true })
      setReplyText('')
      setSelectedMsg(null)
    } catch (err) {
      console.log(err)
      alert('Reply failed!')
    }
  }

  const unread = messages.filter(m => !m.read).length
  const exchangeCount = messages.filter(m => m.type === 'exchange').length

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'bikes', label: 'All Bikes' },
    { id: 'add', label: 'Add Bike' },
    { id: 'messages', label: `Messages ${unread > 0 ? `(${unread})` : ''}` },
  ]

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">ADMIN <span className="text-red-500">DASHBOARD</span></h1>
            <p className="text-gray-400 text-sm">Welcome, Sadm Miya & Nasim Miya</p>
          </div>
          <button onClick={logout} className="bg-gray-800 text-red-500 px-4 py-2 rounded font-bold hover:bg-gray-700 transition-all duration-300 border border-red-500">Logout</button>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2 rounded font-bold transition-all duration-300 ${activeTab === t.id ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Bikes', value: bikes.length },
                { label: 'Total Messages', value: messages.length },
                { label: 'Unread', value: unread },
                { label: 'Exchange Requests', value: exchangeCount },
              ].map((s, i) => (
                <div key={i} className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center hover:border-red-500 transition-all duration-300">
                  <p className="text-4xl font-black text-white">{s.value}</p>
                  <p className="text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <h3 className="text-xl font-black text-white mb-4">RECENT MESSAGES</h3>
            <div className="flex flex-col gap-3">
              {messages.slice(0, 3).map(m => (
                <div key={m.firestoreId} className={`bg-gray-900 p-4 rounded-lg border ${m.read ? 'border-gray-800' : 'border-red-500'}`}>
                  <div className="flex justify-between">
                    <p className="text-white font-bold">{m.name}<span className="text-gray-400 text-sm"> — {m.phone}</span></p>
                    <div className="flex gap-1">
                      {m.type === 'exchange' && <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">🔄 Exchange</span>}
                      {!m.read && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">NEW</span>}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bikes' && (
          <div>
            <h3 className="text-xl font-black text-white mb-4">ALL BIKES ({bikes.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-gray-400 pb-3 pr-4">Image</th>
                    <th className="text-gray-400 pb-3 pr-4">Bike Name</th>
                    <th className="text-gray-400 pb-3 pr-4">Price</th>
                    <th className="text-gray-400 pb-3 pr-4">Type</th>
                    <th className="text-gray-400 pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bikes.map(b => (
                    <tr key={b.firestoreId} className="border-b border-gray-800">
                      <td className="py-3 pr-4">
                        {b.typeMedia === 'video' ? (
                          <video src={b.img} className="w-16 h-12 object-cover rounded" muted />
                        ) : b.img ? (
                          <img src={b.img} alt={b.name} className="w-16 h-12 object-cover rounded" />
                        ) : null}
                      </td>
                      <td className="text-white py-3 pr-4">{b.name}</td>
                      <td className="text-red-500 py-3 pr-4 font-bold">Rs. {b.price}</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${b.type === 'sell' ? 'bg-red-600' : 'bg-green-600'}`}>{b.type}</span>
                      </td>
                      <td className="py-3">
                        <button onClick={() => setEditBike(b)} className="bg-yellow-600 text-black px-3 py-1 rounded text-sm ml-2">Edit</button>
                        <button onClick={() => deleteBike(b.firestoreId)} className="bg-red-900 text-red-400 px-3 py-1 rounded text-sm hover:bg-red-700 hover:text-white ml-1">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 max-w-2xl">
            <h3 className="text-xl font-black text-white mb-6">ADD NEW BIKE</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Bike Name', 'name', 'text'],
                ['Price (Rs.)', 'price', 'text'],
                ['Year', 'year', 'text'],
                ['KM Run', 'km', 'text'],
                ['Engine', 'engine', 'text'],
                ['Color', 'color', 'text'],
              ].map(([label, field, type]) => (
                <div key={field}>
                  <label className="text-gray-400 text-sm mb-1 block">{label}</label>
                  <input type={type} value={newBike[field]}
                    onChange={e => setNewBike({ ...newBike, [field]: e.target.value })}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-red-500 outline-none" />
                </div>
              ))}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Type</label>
                <select value={newBike.type} onChange={e => setNewBike({ ...newBike, type: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 outline-none">
                  <option value="sell">For Sale</option>
                  <option value="exchange">For Exchange</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Condition</label>
                <select value={newBike.condition} onChange={e => setNewBike({ ...newBike, condition: e.target.value })}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 outline-none">
                  <option>Excellent</option>
                  <option>Very Good</option>
                  <option>Good</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-gray-400 text-sm mb-1 block">Upload Image / Video</label>
                <input type="file" accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (!file) return
                    setMediaFile(file)
                    setPreview(URL.createObjectURL(file))
                  }}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700" />
                {preview && (
                  <div className="mt-4">
                    {mediaFile?.type.startsWith('video') ? (
                      <video src={preview} controls className="w-full h-60 rounded border border-gray-700" />
                    ) : (
                      <img src={preview} alt="Preview" className="w-full h-60 object-cover rounded border border-gray-700" />
                    )}
                  </div>
                )}
                {uploading && <p className="text-yellow-400 mt-2 text-sm">⏳ Uploading to Cloudinary...</p>}
              </div>
              <div className="col-span-2">
                <label className="text-gray-400 text-sm mb-1 block">Description</label>
                <textarea value={newBike.desc} onChange={e => setNewBike({ ...newBike, desc: e.target.value })}
                  rows={3} className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-red-500 outline-none resize-none" />
              </div>
            </div>
            <button onClick={addBike} disabled={uploading}
              className={`mt-6 w-full py-3 rounded font-black text-lg transition-all duration-300 ${uploading ? 'bg-gray-600 text-gray-400' : 'bg-red-600 text-white hover:bg-red-700'}`}>
              {uploading ? 'Uploading...' : 'ADD BIKE'}
            </button>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-black text-white mb-4">
                ALL MESSAGES ({messages.length})
                {exchangeCount > 0 && <span className="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">🔄 {exchangeCount} Exchange</span>}
              </h3>
              {messages.length === 0 && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
                  <p className="text-gray-400">No messages yet.</p>
                </div>
              )}
              <div className="flex flex-col gap-3">
                {messages.map(m => (
                  <div key={m.firestoreId} onClick={() => setSelectedMsg(m)}
                    className={`bg-gray-900 p-4 rounded-lg border cursor-pointer hover:border-red-500 transition-all duration-300 ${selectedMsg?.firestoreId === m.firestoreId ? 'border-red-500' : m.read ? 'border-gray-800' : 'border-yellow-500'}`}>
                    <div className="flex justify-between">
                      <p className="text-white font-bold">{m.name}</p>
                      <div className="flex gap-1">
                        {m.type === 'exchange' && <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">🔄</span>}
                        {!m.read && <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">NEW</span>}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1 truncate">{m.message}</p>
                    <p className="text-gray-600 text-xs mt-1">{m.date}</p>
                  </div>
                ))}
              </div>
            </div>
            {selectedMsg && (
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-black text-white mb-4">MESSAGE DETAIL</h3>
                <p className="text-white font-bold">{selectedMsg.name}</p>
                <p className="text-gray-400 text-sm">📞 {selectedMsg.phone}</p>
                {selectedMsg.email && <p className="text-gray-400 text-sm">✉️ {selectedMsg.email}</p>}
                {selectedMsg.type === 'exchange' && <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold mt-2 inline-block">🔄 EXCHANGE REQUEST</span>}
                <div className="bg-gray-800 p-4 rounded mt-4"><p className="text-white">{selectedMsg.message}</p></div>
                {selectedMsg.bikeName && (
                  <div className="bg-gray-800 p-4 rounded mt-3 text-sm">
                    <p className="text-yellow-400 font-bold mb-2">BIKE DETAILS:</p>
                    <p className="text-gray-300">🏍️ Current Bike: {selectedMsg.bikeName}</p>
                    {selectedMsg.bikeYear && <p className="text-gray-300">📅 Year: {selectedMsg.bikeYear}</p>}
                    {selectedMsg.bikeKm && <p className="text-gray-300">🛣️ KM: {selectedMsg.bikeKm}</p>}
                    {selectedMsg.bikeCondition && <p className="text-gray-300">✨ Condition: {selectedMsg.bikeCondition}</p>}
                    {selectedMsg.wantBike && <p className="text-gray-300">🎯 Wants: {selectedMsg.wantBike}</p>}
                  </div>
                )}
                {selectedMsg.reply && (
                  <div className="bg-green-900 p-4 rounded mt-3">
                    <p className="text-green-400 text-sm font-bold">Your Reply:</p>
                    <p className="text-white mt-1">{selectedMsg.reply}</p>
                  </div>
                )}
                <textarea placeholder="Type your reply..." value={replyText}
                  onChange={e => setReplyText(e.target.value)} rows={3}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none resize-none mt-4" />
                <button onClick={sendReply} className="bg-red-600 text-white w-full py-3 rounded font-black mt-3 hover:bg-red-700 transition-all duration-300">SEND REPLY ✅</button>
              </div>
            )}
          </div>
        )}

        {editBike && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-xl">
              <h2 className="text-white text-xl font-black mb-4">EDIT BIKE</h2>
              <input value={editBike.name} onChange={(e) => setEditBike({ ...editBike, name: e.target.value })} className="w-full p-2 bg-gray-800 text-white mb-2" />
              <input value={editBike.price} onChange={(e) => setEditBike({ ...editBike, price: e.target.value })} className="w-full p-2 bg-gray-800 text-white mb-2" />
              <button onClick={async () => {
                await updateDoc(doc(db, 'bikes', editBike.firestoreId), { name: editBike.name, price: editBike.price })
                setEditBike(null)
              }} className="bg-green-600 text-white px-4 py-2 rounded mr-2">Update</button>
              <button onClick={() => setEditBike(null)} className="bg-red-600 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard