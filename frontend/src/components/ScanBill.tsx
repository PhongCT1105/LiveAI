import { useState, useRef } from "react";
import { Loader, XCircle, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface ScanBillProps {
  setScannedIngredients: (ingredients: string[]) => void;
}

const ScanBill = ({ setScannedIngredients }: ScanBillProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (file) {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:8000/scan", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("API Response:", responseData);

        // Filter out empty strings or null values before setting state
        const validIngredients = (responseData.ingredients ?? []).filter(
          (item: string) => item?.trim() !== ""
        );

        console.log("Filtered Ingredients:", validIngredients);
        setScannedIngredients(validIngredients);

        // Navigate to /fridge after successful scan
        navigate("/fridge");
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-2xl text-center">
        <h2 className="text-3xl font-extrabold text-gray-800">Scan Your Shopping Bill</h2>
        <p className="text-gray-600 mt-2">
          Upload an image of your receipt to extract ingredients.
        </p>

        {/* Hidden File Input */}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

        {/* File Upload Section */}
        <div className="mt-6 flex flex-col items-center justify-center">
          {file ? (
            <div className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 shadow-sm">
              <span className="text-gray-700 truncate">{file.name}</span>
              <button
                onClick={handleRemoveFile}
                className="text-red-500 text-sm font-semibold flex items-center"
              >
                <XCircle size={16} className="mr-1" />
                Remove
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 border border-blue-300 hover:bg-blue-200 transition"
            >
              <UploadCloud size={18} />
              <span>Choose File</span>
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
      </div>
    </div>
  );
};

export default ScanBill;