import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-black text-gray-200 py-6 mt-12">
      <div className="max-w-6xl mx-auto flex justify-center items-center text-sm gap-6">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <Link to="/about" className="hover:text-white transition">About</Link>
        <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
        <Link to="/contact" className="hover:text-white transition">Contact</Link>
      </div>

      <p className="text-center text-xs mt-3 text-gray-400">
        © {new Date().getFullYear()} VideoTextify. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
