import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-80 py-3 px-6 shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-lg font-semibold text-gray-100">FridgeAI</h1>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
          <Link to="/scan" className="text-gray-300 hover:text-white transition">Scan</Link>
          <Link to="/fridge" className="text-gray-300 hover:text-white transition">Fridge</Link>
          <Link to="/recipes" className="text-gray-300 hover:text-white transition">Recipes</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
