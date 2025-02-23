import { useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  useEffect(() => {
    const video = document.getElementById("homepage-video") as HTMLVideoElement;
    if (video) {
      video.play().catch((err) => console.log("Autoplay Blocked:", err));
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Title & Description Section */}
      <div className="max-w-2xl w-full px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Welcome to <span className="text-gray-400">FridgeAI</span>
        </h1>
        <p className="text-lg md:text-xl mt-3 text-gray-300 leading-normal">
          Scan your shopping bill, track your fridge, and get personalized recipe suggestions effortlessly.
        </p>
      </div>

      {/* Video Section */}
      <div className="mt-8 w-full max-w-xl lg:max-w-2xl h-56 md:h-64 rounded-lg overflow-hidden shadow-xl border border-gray-700">
        <video
          id="homepage-video"
          className="w-full h-full object-cover rounded-lg"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/homepage.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/scan">
          <button className="bg-blue-500 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition hover:scale-105">
            Scan Receipt
          </button>
        </Link>
        <button className="bg-gray-700 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-600 transition hover:scale-105">
          Explore Recipes
        </button>
      </div>
    </div>
  );
};

export default Home;
