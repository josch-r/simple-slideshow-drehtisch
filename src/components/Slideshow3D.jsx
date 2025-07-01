import { useState, useEffect, useRef, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { getMediaForLanguage } from "../assets/mediaDataLoader.js";
import { IDLE_TIME, styles } from "../assets/constants.js";

const Slideshow3D = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("german");
  const [mediaItems, setMediaItems] = useState([]);
  const [isIdle, setIsIdle] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const idleTimeoutRef = useRef(null);
  
  let timeout;
  
  const ToggleLanguage = () => {
    console.log("changing language");
    if (currentLanguage==="german") setCurrentLanguage("english");
    else (setCurrentLanguage("german"));
    
  };

  
  window.addEventListener("keyup", (event) => {
   
    if(event.repeat){
      return;
    }
     
    else if ((event.key >0) && (event.key <=7) ) {
        clearTimeout(timeout);
        timeout = setTimeout(() =>moveToIndex(Number(event.key)-1), 100);
    }
   else if(event.key==="q"){
     timeout = setTimeout(() =>ToggleLanguage(), 500);
   }
  });

  
  // Initialize media items based on language
  useEffect(() => {
    const items = getMediaForLanguage(currentLanguage);
    setMediaItems(items);
  }, [currentLanguage]);

  const resetIdleTimer = useCallback(() => {
    // Clear existing timeout
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    // Hide idle screen if it's currently showing
    setIsIdle(false);
    if (isVideoPlaying) {
      return;
    }

    idleTimeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, IDLE_TIME);
  }, [isVideoPlaying]);

  // Initialize idle timer on component mount
  useEffect(() => {
    resetIdleTimer();

    //on onmount clean up timer
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [resetIdleTimer]);

  // Reset timer when currentIndex changes, but consider video state
  useEffect(() => {
    // Check if current media item is a video
    const currentItem = mediaItems[currentIndex];
    if (currentItem?.type === "video") {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      setIsIdle(false);
    } else {
      // For images, reset timer normally
      setIsVideoPlaying(false);
      resetIdleTimer();
    }
  }, [currentIndex, mediaItems, resetIdleTimer]);

  const changeLanguage = () => {
    setCurrentLanguage(currentLanguage === "german" ? "english" : "german");
    resetIdleTimer(); // Reset on language change
  };

  const paginate = (newDirection) => {
    if (newDirection > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
    } else {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + mediaItems.length) % mediaItems.length
      );
    }
  };

  const moveToIndex = (index) => {
    //ensures index is within bounds
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

    const xPosition = position * 100;

    // 3D effects
    const rotateY = position * -15;
    const scale = 1 - Math.abs(position) * 0.1;
    const opacity = Math.max(0.3, 1 - Math.abs(position) * 0.3);
    const translateZ = -Math.abs(position) * 50;

    return {
      x: `${xPosition}%`,
      rotateY: `${rotateY}deg`,
      scale: Math.max(0.5, scale),
      opacity: opacity,
      z: translateZ,
    };
  };

  const IdleScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-sm"
    >
      <div className="text-center text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-4xl"
        >
          💤 idle mode
        </motion.div>
      </div>
    </motion.div>
  );

  // Handle video play/pause events
  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    // Clear any existing idle timer when video starts playing
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    setIsIdle(false);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
    resetIdleTimer();
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    resetIdleTimer();
  };

  // Effect to handle video playback when currentIndex changes
  useEffect(() => {
    const currentItem = mediaItems[currentIndex];

    if (currentItem?.type === "video") {
      // Find the video element by data attribute
      const video = document.querySelector(
        `[data-video-id="${currentItem.id}"]`
      );

      if (video) {
        video.currentTime = 0;
        video
          .play()
          .then(() => {
            console.log("Video playing successfully");
          })
          .catch((error) => {
            console.log("Video play failed:", error);
          });
      } else {
        console.log("Video element not found");

        const timer = setTimeout(() => {
          const retryVideo = document.querySelector(
            `[data-video-id="${currentItem.id}"]`
          );
          if (retryVideo) {
            retryVideo.currentTime = 0;
            retryVideo.play().catch((err) => console.log("Retry failed:", err));
          }
        }, 200);

        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, mediaItems]);

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
            const isCurrentItem = index === currentIndex;

            if (mediaItem.type === "video") {
              return (
                <motion.video
                  key={`${currentLanguage}-${mediaItem.id}`}
                  data-video-id={mediaItem.id}
                  src={mediaItem.src}
                  className="rounded-sm select-none"
                  muted
                  playsInline
                  onPlay={isCurrentItem ? handleVideoPlay : undefined}
                  onPause={isCurrentItem ? handleVideoPause : undefined}
                  onEnded={isCurrentItem ? handleVideoEnded : undefined}
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
                  key={`${currentLanguage}-${mediaItem.id}`} // More stable key
                  src={mediaItem.src}
                  className="rounded-sm select-none"
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

        {/* Idle Screen Overlay */}
        <AnimatePresence>{isIdle && <IdleScreen />}</AnimatePresence>

        <div className="flex items-center flex-col mt-2">
          {/* Navigation arrows */}
          <div className="mx-4 flex justify-between items-center w-full">
            <button
              className={styles.button_primary}
              onClick={() => paginate(-1)}
            >
              ←
            </button>
            <button
              className={styles.button_primary}
              onClick={() => paginate(1)}
            >
              →
            </button>
          </div>
          <div className="flex flex-row items-center justify-between w-full mt-4">
            {/* Language toggle button */}
            <button
              className={styles.button_secondary}
              onClick={changeLanguage}
            >
              {currentLanguage === "german" ? "English" : "Deutsch"}
            </button>
            <div className="flex items-center justify-start mt-4">
              <p className="text-white">jump to index: </p>
              <input
                type="number"
                className="bg-white rounded-md p-1 mx-2"
                min="1"
                max={mediaItems.length}
                value={currentIndex + 1}
                onChange={(e) => moveToIndex(Number(e.target.value) - 1)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slideshow3D;
