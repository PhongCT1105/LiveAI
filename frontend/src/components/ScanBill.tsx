import { useState, useRef } from "react";
import { scanBill } from "../utils/ocrHelper";
import { Loader } from "lucide-react"; // Optional: Use an icon library for loading animation

const ScanBill = () => {
  const [file, setFile] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (file) {
      setLoading(true);
      const extracted = await scanBill(file);
      setIngredients(extracted);
      setLoading(false);
    }
  };

  return (
    <div className="pt-30 max-w-lg mx-auto text-center bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800">Scan Your Shopping Bill</h2>
      <p className="text-gray-600 mt-2">Upload an image of your receipt to extract ingredients.</p>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* File Upload Section */}
      <div className="mt-6 flex flex-col items-center">
        {file ? (
          <div className="flex items-center space-x-4 bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-gray-700 truncate">{file.name}</span>
            <button onClick={handleRemoveFile} className="text-red-500 text-sm font-semibold">
              Remove
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Choose File
          </button>
        )}

        <button
          onClick={handleUpload}
          className={`mt-4 px-6 py-2 rounded-lg text-white ${file
            ? "bg-blue-600 hover:bg-blue-700 transition"
            : "bg-gray-400 cursor-not-allowed"
            }`}
          disabled={!file || loading}
        >
          {loading ? (
            <span className="flex items-center">
              <Loader className="animate-spin mr-2" size={16} /> Scanning...
            </span>
          ) : (
            "Upload & Scan"
          )}
        </button>
      </div>

      {/* Ingredients Display */}
      {ingredients.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-800">Extracted Ingredients</h3>
          <ul className="mt-3 text-gray-700">
            {ingredients.map((item, index) => (
              <li key={index} className="bg-gray-100 p-2 m-1 rounded shadow-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScanBill;
