import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // ✅ Firebase Auth state check
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('rrb_admin', 'true')
        setIsAdmin(true)
      } else {
        localStorage.removeItem('rrb_admin')
        setIsAdmin(false)
      }
      setChecking(false)
    })

    return () => unsub()
  }, [])

  // ✅ Loading — Auth check हुँदै छ
  if (checking) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <p className="text-white text-xl font-black animate-pulse">🔐 Checking access...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default ProtectedRoute