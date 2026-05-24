import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password required!')
      return
    }

    setLoading(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      localStorage.setItem('rrb_admin', 'true')
      navigate('/admin/dashboard')

    } catch (err) {
      setError('Wrong email or password!')
      console.log(err)
    }

    setLoading(false)
  }

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center px-6">
      <div className="bg-gray-900 p-10 rounded-lg border border-gray-800 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl">🏍️</span>
          <h1 className="text-3xl font-black text-white mt-3">
            ROYAL <span className="text-red-500">ADMIN</span>
          </h1>
          <p className="text-gray-400 mt-1">Proprietors Panel</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              placeholder="admin@royalrecondition.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password..."
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-red-500 outline-none pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xl"
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-bold">❌ {error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`text-white py-3 rounded font-black text-lg transition-all ${
              loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Sadm Miya & Nasim Miya — Royal Recondition
        </p>
      </div>
    </div>
  )
}

export default AdminLogin