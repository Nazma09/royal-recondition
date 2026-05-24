import logo from "../assets/images/logo.jpeg"
import { FaFacebookF, FaWhatsapp, FaTiktok } from "react-icons/fa"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-black border-t border-red-500/20 shadow-inner shadow-red-500/10">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Royal Recondition Logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-red-500 shadow-lg shadow-red-500/30" />
            <div>
              <h2 className="text-red-500 font-black text-xl leading-none">ROYAL</h2>
              <p className="text-yellow-400 text-xs tracking-[4px]">RECONDITION</p>
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-6 mb-5">
            Premium Bike Sell & Exchange Platform.
            Trusted quality bikes with best deals in Nepal.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 text-white text-lg">
            <a href="https://www.facebook.com/share/17q7T8QRsc/?mibextid=wwXIfr"
              target="_blank" rel="noreferrer"
              className="bg-blue-600 p-3 rounded-full hover:scale-110 duration-300">
              <FaFacebookF />
            </a>
            <a href="https://wa.me/9779827485706"
              target="_blank" rel="noreferrer"
              className="bg-green-500 p-3 rounded-full hover:scale-110 duration-300">
              <FaWhatsapp />
            </a>
            <a href="https://www.tiktok.com/@royal_recondition.butwal?_r=1&_t=ZS-96cZ4AiFliR"
              target="_blank" rel="noreferrer"
              className="bg-white text-black p-3 rounded-full hover:scale-110 duration-300">
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-black mb-5 text-lg">QUICK LINKS</h3>
          <div className="flex flex-col gap-3">
            {[
              { to: '/', label: 'Home' },
              { to: '/bikes', label: 'Bikes' },
              { to: '/exchange', label: 'Exchange' },
              { to: '/contact', label: 'Contact' },
            ].map(link => (
              <Link key={link.to} to={link.to}
                className="text-gray-400 hover:text-red-500 hover:translate-x-1 duration-300 text-sm">
                → {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-black mb-5 text-lg">OUR SERVICES</h3>
          <div className="flex flex-col gap-3">
            {['Buy Bike', 'Sell Bike', 'Exchange Bike', 'Bike Inspection', 'Loan Facility'].map((s, i) => (
              <p key={i} className="text-gray-400 text-sm">→ {s}</p>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-black mb-5 text-lg">CONTACT US</h3>
          <div className="space-y-3">
            <a href="https://maps.google.com/?q=Butwal+Milanchowk+Nepal"
              target="_blank" rel="noreferrer"
              className="text-gray-400 text-sm leading-6 hover:text-red-500 block">
              📍 Butwal, Milanchowk, Nepal
            </a>
            <a href="tel:+9779827485706"
              className="text-gray-400 text-sm hover:text-red-500 block">
              📞 +977 9827485706
            </a>
            <a href="mailto:royalrecondition@gmail.com"
              className="text-gray-400 text-sm break-all hover:text-red-500 block">
              ✉️ royalrecondition@gmail.com
            </a>
            <a href="https://wa.me/9779827485706"
              target="_blank" rel="noreferrer"
              className="bg-green-600 text-white text-sm px-4 py-2 rounded font-bold inline-block hover:bg-green-700 mt-2">
              💬 WhatsApp Us
            </a>
            <div className="pt-2">
              <p className="text-yellow-400 text-sm font-bold">Proprietors:</p>
              <p className="text-white text-sm font-semibold">Sadam Miya & Nasim Miya</p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-5 text-center px-4">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Royal Recondition. All Rights Reserved.
        </p>
        <p className="text-gray-700 text-xs mt-1">
          Butwal, Milanchowk, Nepal
        </p>
      </div>

    </footer>
  )
}

export default Footer