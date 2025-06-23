// Dynamic imports for all images and videos
const gerImages = import.meta.glob('../assets/ger/*.{jpg,JPG}', { eager: true });
const engImages = import.meta.glob('../assets/eng/*.{jpg,JPG}', { eager: true });
const gerVideos = import.meta.glob('../assets/ger/*.{mp4,MP4,mov,MOV,webm,WEBM}', { eager: true });
const engVideos = import.meta.glob('../assets/eng/*.{mp4,MP4,mov,MOV,webm,WEBM}', { eager: true });

// Create a mapping of filenames to imported modules
const mediaMap = {};

// Process German images
Object.entries(gerImages).forEach(([path, module]) => {
  const filename = path.split('/').pop();
  mediaMap[`ger/${filename}`] = module.default;
});

// Process English images
Object.entries(engImages).forEach(([path, module]) => {
  const filename = path.split('/').pop();
  mediaMap[`eng/${filename}`] = module.default;
});

// Process German videos
Object.entries(gerVideos).forEach(([path, module]) => {
  const filename = path.split('/').pop();
  mediaMap[`ger/${filename}`] = module.default;
});

// Process English videos
Object.entries(engVideos).forEach(([path, module]) => {
  const filename = path.split('/').pop();
  mediaMap[`eng/${filename}`] = module.default;
});

// Media data with references to filenames
const mediaData = {
  ger: [
    { id: "ger_1", type: "image", filename: "1.jpg" },
    { id: "ger_2", type: "image", filename: "2.JPG" },
    { id: "ger_3", type: "image", filename: "3.jpg" },
    { id: "ger_4", type: "image", filename: "4.jpg" },
    { id: "ger_5", type: "image", filename: "5.jpg" },
    { id: "ger_6", type: "image", filename: "6.jpg" },
    { id: "ger_video", type: "video", filename: "sheep.mp4" }
  ],
  eng: [
    { id: "eng_7", type: "image", filename: "7.jpg" },
    { id: "eng_8", type: "image", filename: "8.jpg" },
    { id: "eng_9", type: "image", filename: "9.JPG" },
    { id: "eng_10", type: "image", filename: "10.jpg" },
    { id: "eng_11", type: "image", filename: "11.jpg" },
    { id: "eng_12", type: "image", filename: "12.jpg" },
    { id: "eng_video", type: "video", filename: "cow.mp4" }
  ]
};

// Function to get media with proper image/video sources
export const getMediaForLanguage = (language) => {
  const langKey = language === "german" ? "ger" : "eng";
  return mediaData[langKey].map(item => ({
    ...item,
    src: mediaMap[`${langKey}/${item.filename}`]
  }));
};

export { mediaData, mediaMap };
export default getMediaForLanguage;
