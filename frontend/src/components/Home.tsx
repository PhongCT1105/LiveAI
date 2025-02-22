import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    const video = document.getElementById("homepage-video") as HTMLVideoElement;
    if (video) {
      video.play().catch((err) => console.log("Autoplay Blocked:", err));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-black text-white">
      {/* Title & Description Section */}
      <div className="max-w-3xl">
        <h1 className="text-6xl font-extrabold tracking-wide text-white">
          Welcome to <span className="text-gray-400">FridgeAI</span>
        </h1>
        <p className="text-lg mt-4 text-gray-300">
          Scan your shopping bill, keep track of your fridge, and get personalized recipe suggestions.
        </p>
      </div>

      {/* Video Section */}
      <div className="mt-10 w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl border border-gray-700">
        <video
          id="homepage-video"
          className="w-full h-auto rounded-xl border border-gray-600"
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
      <div className="mt-8 flex space-x-4">
        <button className="bg-white text-black font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-200 transition">
          Scan Receipt
        </button>
        <button className="bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition">
          Explore Recipes
        </button>
      </div>
    </div>
  );
};

export default Home;
