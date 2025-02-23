import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const transitionSettings = {
  duration: 0.7,
  ease: [0.25, 0.1, 0.25, 1], // Smooth cubic bezier easing for a natural look
};

const Home = () => {
  useEffect(() => {
    const video = document.getElementById("homepage-video") as HTMLVideoElement;
    if (video) {
      video.play().catch((err) => console.log("Autoplay Blocked:", err));
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={transitionSettings}
      className="h-screen w-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-black to-gray-900 text-white"
    >
      {/* Title & Description Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transitionSettings, delay: 0.2 }}
        className="max-w-2xl w-full px-4"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Welcome to <span className="text-gray-400">FridgeAI</span>
        </h1>
        <p className="text-lg md:text-xl mt-3 text-gray-300 leading-normal">
          Scan your shopping bill, track your fridge, and get personalized recipe suggestions effortlessly.
        </p>
      </motion.div>

      {/* Video Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...transitionSettings, delay: 0.4 }}
        className="mt-8 w-full max-w-xl lg:max-w-2xl h-56 md:h-64 rounded-lg overflow-hidden shadow-xl border border-gray-700"
      >
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
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transitionSettings, delay: 0.6 }}
        className="mt-8 flex flex-wrap justify-center gap-4"
      >
        <Link to="/scan">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-500 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition"
          >
            Scan Receipt
          </motion.button>
        </Link>
        <Link to="/recipes">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-700 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-600 transition"
          >
            Explore Recipes
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Home;
