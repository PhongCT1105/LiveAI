// App.tsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Streak } from "./components/Streak";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ScanBill from "./components/ScanBill";
import Fridge from "./components/Fridges";
import Recipes from "./components/Recipes";

function App() {
  const [scannedIngredients, setScannedIngredients] = useState<string[]>([]);

  return (
    <Router>
      <Streak>
        <Navbar />
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/scan"
              element={<ScanBill setScannedIngredients={setScannedIngredients} />}
            />
            <Route
              path="/fridge"
              element={<Fridge scannedIngredients={scannedIngredients} />}
            />
            <Route path="/recipes" element={<Recipes />} />
          </Routes>
        </div>
      </Streak>
    </Router>
  );
}

export default App;