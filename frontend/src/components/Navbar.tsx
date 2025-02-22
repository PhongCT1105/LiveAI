import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineQrCodeScanner, MdKitchen, MdFastfood } from "react-icons/md";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-black bg-opacity-80 px-6 shadow-md z-20">
      <div className="container mx-auto flex justify-between items-center h-full">
        {/* Logo */}
        <h1 className="text-lg font-semibold text-gray-100">FridgeAI</h1>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="flex items-center text-gray-300 hover:text-white transition space-x-2">
            <AiOutlineHome size={20} />
            <span>Home</span>
          </Link>
          <Link to="/scan" className="flex items-center text-gray-300 hover:text-white transition space-x-2">
            <MdOutlineQrCodeScanner size={20} />
            <span>Scan</span>
          </Link>
          <Link to="/fridge" className="flex items-center text-gray-300 hover:text-white transition space-x-2">
            <MdKitchen size={20} />
            <span>Fridge</span>
          </Link>
          <Link to="/recipes" className="flex items-center text-gray-300 hover:text-white transition space-x-2">
            <MdFastfood size={20} />
            <span>Recipes</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
