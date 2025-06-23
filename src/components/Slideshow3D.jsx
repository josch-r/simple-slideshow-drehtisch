import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { getMediaForLanguage } from "../assets/mediaDataLoader.js";

const Slideshow3D = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("german");
  const [mediaItems, setMediaItems] = useState([]);

  // Initialize media items based on language
  useEffect(() => {
    const items = getMediaForLanguage(currentLanguage);
    setMediaItems(items);
    setCurrentIndex(currentIndex);
  }, [currentLanguage, currentIndex]);

  const changeLanguage = () => {
    setCurrentLanguage(currentLanguage === "german" ? "english" : "german");
  };

  const paginate = (newDirection) => {
    if (newDirection > 0) {
      // Go to next image (endless)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
    } else {
      // Go to previous image (endless)
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + mediaItems.length) % mediaItems.length
      );
    }
  };

  const moveToIndex = (index) => {
    // Move to a specific index, wrapping around if necessary
    setCurrentIndex(() => {
        const newIndex = (index + mediaItems.length) % mediaItems.length;
        return newIndex;
    });
  };

  // Calculate the x position and 3D effects for each media item
  const getImageTransform = (index) => {
    let position = index - currentIndex;

    // Handle wrapping for endless effect
    const halfLength = mediaItems.length / 2;
    if (position > halfLength) {
      position -= mediaItems.length;
    } else if (position < -halfLength) {
      position += mediaItems.length;
    }

    const xPosition = position * 100; // 100% width per image

    // 3D effects based on position
    const rotateY = position * -15; // Rotate images as they move away
    const scale = 1 - Math.abs(position) * 0.1; // Scale down images that are further away
    const opacity = Math.max(0.3, 1 - Math.abs(position) * 0.3); // Fade out distant images
    const translateZ = -Math.abs(position) * 50; // Move images back in 3D space

    return {
      x: `${xPosition}%`,
      rotateY: `${rotateY}deg`,
      scale: Math.max(0.5, scale),
      opacity: opacity,
      z: translateZ,
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-[100px]">
      <div
        className="relative w-[800px] h-[500px] rounded-xl xl:w-[800px] xl:h-[500px] lg:w-[90vw] lg:h-[60vw] lg:max-h-[500px] md:h-[70vw] md:max-h-[400px] sm:h-[75vw] sm:max-h-[300px]"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "center center",
        }}
      >
        <div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {mediaItems.map((mediaItem, index) => {
            const transform = getImageTransform(index);

            if (mediaItem.type === "video") {
              return (
                <motion.video
                  key={mediaItem.id}
                  src={mediaItem.src}
                  className="rounded-xl select-none"
                  autoPlay
                  muted
                  loop
                  playsInline
                  animate={transform}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 40,
                    mass: 1,
                  }}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transformOrigin: "center center",
                    backfaceVisibility: "hidden",
                  }}
                />
              );
            } else {
              return (
                <motion.img
                  key={mediaItem.id}
                  src={mediaItem.src}
                  className="rounded-xl select-none"
                  alt={"test"}
                  animate={transform}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 40,
                    mass: 1,
                  }}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transformOrigin: "center center",
                    backfaceVisibility: "hidden",
                  }}
                />
              );
            }
          })}
        </div>
        <div>
          {/* Navigation arrows */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 p-2 rounded-md"
              onClick={() => paginate(-1)}
            >
              ←
            </button>
            <button
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 p-2 rounded-md"
              onClick={() => paginate(1)}
            >
              →
            </button>
          </div>
          {/* Language toggle button */}
          <button
            className="block items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-6 top-4 right-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            onClick={changeLanguage}
          >
            {currentLanguage === "german" ? "English" : "Deutsch"}
          </button>
          <div className="flex items-center justify-start mt-4">
            <p className="text-white">jump to index: </p>
            <input type="number" className="bg-white rounded-md p-1 mx-2" min="1" max={mediaItems.length} value={currentIndex + 1} onChange={(e) => moveToIndex(Number(e.target.value) - 1)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slideshow3D;
