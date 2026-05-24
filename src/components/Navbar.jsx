import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/images/logo.jpeg'

function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // ✅ Active link check
  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-black border-b border-red-700 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Royal Recondition" className="h-12 w-auto object-contain" />
          <div>
            <p className="text-red-500 font-bold text-lg leading-none">ROYAL</p>
            <p className="text-yellow-400 text-xs tracking-widest">RECONDITION</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-16">
          {[
            { to: '/', label: 'Home' },
            { to: '/bikes', label: 'Bikes' },
            { to: '/exchange', label: 'Exchange' },
            { to: '/contact', label: 'Contact' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-semibold transition-all duration-300 ${
                isActive(link.to)
                  ? 'text-red-500 border-b-2 border-red-500 pb-1'
                  : 'text-white hover:text-red-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Sell Button */}
        <Link
          to="/contact"
          className="hidden md:block bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition-all duration-300"
        >
          Sell Your Bike
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black px-4 pb-4 flex flex-col gap-4 border-t border-gray-800">
          {[
            { to: '/', label: 'Home' },
            { to: '/bikes', label: 'Bikes' },
            { to: '/exchange', label: 'Exchange' },
            { to: '/contact', label: 'Contact' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`font-semibold py-1 transition-all duration-300 ${
                isActive(link.to) ? 'text-red-500' : 'text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="bg-red-600 text-white px-4 py-2 rounded font-bold text-center hover:bg-red-700"
          >
            Sell Your Bike
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar