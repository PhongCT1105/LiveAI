import { useState } from "react";
import { scanBill } from "../utils/ocrHelper";

const ScanBill = () => {
  const [file, setFile] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleUpload = async () => {
    if (file) {
      const extracted = await scanBill(file);
      setIngredients(extracted);
    }
  };

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold">Scan Your Shopping Bill</h2>
      <input type="file" onChange={handleFileChange} className="mt-4" />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
        Upload & Scan
      </button>
      {ingredients.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Extracted Ingredients:</h3>
          <ul>
            {ingredients.map((item, index) => (
              <li key={index} className="bg-gray-100 p-2 m-2 rounded">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScanBill;
