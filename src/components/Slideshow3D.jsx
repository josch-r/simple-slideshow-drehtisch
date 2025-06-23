import { useState } from "react";
import { motion } from "framer-motion";
import "./Slideshow3D.css";

// Import all images
import image1 from "../assets/1.jpg";
import image2 from "../assets/2.JPG";
import image3 from "../assets/3.jpg";
import image4 from "../assets/4.jpg";
import image5 from "../assets/5.jpg";
import image6 from "../assets/6.jpg";

import image7 from "../assets/eng/7.jpg";
import image8 from "../assets/eng/8.jpg";
import image9 from "../assets/eng/9.jpg";
import image10 from "../assets/eng/10.jpg";
import image11 from "../assets/eng/11.jpg";
import image12 from "../assets/eng/12.jpg";

const Slideshow3D = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("german");
  const [images, setImages] = useState([
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
  ]);

  const changeLanguage = () => {
    // Change images to English version
    if (currentLanguage === "german") {
      setCurrentLanguage("english");
      setImages([image7, image8, image9, image10, image11, image12]);
    } else {
      setCurrentLanguage("german");
      setImages([image1, image2, image3, image4, image5, image6]);
    }
  };

  const paginate = (newDirection) => {
    if (newDirection > 0) {
      // Go to next image (endless)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    } else {
      // Go to previous image (endless)
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
    }
  };

  // Calculate the x position and 3D effects for each image
  const getImageTransform = (index) => {
    let position = index - currentIndex;

    // Handle wrapping for endless effect
    const halfLength = images.length / 2;
    if (position > halfLength) {
      position -= images.length;
    } else if (position < -halfLength) {
      position += images.length;
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
    <div className="slideshow-container">
      <div className="slideshow-wrapper">
        <div className="images-container">
          {images.map((image, index) => {
            const transform = getImageTransform(index);
            return (
              <motion.img
                key={index}
                src={image}
                className="slide-image"
                alt={`Slide ${index + 1}`}
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
                }}
              />
            );
          })}
        </div>
        <div className="">
          {/* Navigation arrows */}
          <button
            className="nav-arrow nav-arrow-left"
            onClick={() => paginate(-1)}
          >
            ←
          </button>
          <button
            className="nav-arrow nav-arrow-right"
            onClick={() => paginate(1)}
          >
            →
          </button>
          {/* Language toggle button */}
          <button
            className="block items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-6 top-4 right-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            onClick={changeLanguage}
          >
            {currentLanguage === "german" ? "English" : "Deutsch"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slideshow3D;
