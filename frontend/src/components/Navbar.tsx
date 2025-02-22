import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">FridgeAI</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/scan" className="hover:underline">Scan</Link>
          <Link to="/fridge" className="hover:underline">Fridge</Link>
          <Link to="/recipes" className="hover:underline">Recipes</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
