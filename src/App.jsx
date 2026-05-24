import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Bikes from './pages/Bikes'
import Contact from './pages/Contact'
import Exchange from './pages/Exchange'

import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import BikeDetail from './pages/BikeDetail'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-950 min-h-screen flex flex-col">

        <Navbar />

        <div className="pt-16 flex-1">
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/bikes" element={<Bikes />} />
            <Route path="/bikes/:id" element={<BikeDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/exchange" element={<Exchange />} />

            {/* ADMIN LOGIN */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* PROTECTED ADMIN DASHBOARD */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>

        <Footer />

      </div>
    </BrowserRouter>
  )
}

export default App