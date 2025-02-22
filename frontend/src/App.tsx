import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Streak } from "./components/Streak";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ScanBill from "./components/ScanBill";
import Fridge from "./components/Fridges";
import Recipes from "./components/Recipes";

function App() {
  return (
    <Router>
      <Streak>
        <Navbar />
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<ScanBill />} />
            <Route path="/fridge" element={<Fridge />} />
            <Route path="/recipes" element={<Recipes />} />
          </Routes>
        </div>
      </Streak>
    </Router>
  );
}

export default App;
