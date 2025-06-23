// Consolidate the glob imports
const allMedia = {
  ger: {
    images: import.meta.glob('../assets/ger/*.{jpg,JPG}', { eager: true }),
    videos: import.meta.glob('../assets/ger/*.{mp4,MP4,mov,MOV,webm,WEBM}', { eager: true })
  },
  eng: {
    images: import.meta.glob('../assets/eng/*.{jpg,JPG}', { eager: true }),
    videos: import.meta.glob('../assets/eng/*.{mp4,MP4,mov,MOV,webm,WEBM}', { eager: true })
  }
};


const processMedia = (mediaFiles, langKey) => {
  const mediaMap = {};
  Object.entries(mediaFiles).forEach(([path, module]) => {
    const filename = path.split('/').pop();
    mediaMap[`${langKey}/${filename}`] = module.default;
  });
  return mediaMap;
};

// Create the complete media map
const mediaMap = {
  ...processMedia(allMedia.ger.images, 'ger'),
  ...processMedia(allMedia.ger.videos, 'ger'),
  ...processMedia(allMedia.eng.images, 'eng'),
  ...processMedia(allMedia.eng.videos, 'eng')
};

// Media data with references to filenames
const mediaData = {
  ger: [
    { id: "ger_1", type: "image", filename: "1.jpg" },
    { id: "ger_2", type: "image", filename: "2.JPG" },
    { id: "ger_3", type: "image", filename: "3.jpg" },
    { id: "ger_4", type: "image", filename: "4.jpg" },
    { id: "ger_5", type: "image", filename: "5.jpg" },
    { id: "ger_6", type: "image", filename: "6.jpg" },
    { id: "ger_video", type: "video", filename: "cow.mp4" }
  ],
  eng: [
    { id: "eng_7", type: "image", filename: "7.jpg" },
    { id: "eng_8", type: "image", filename: "8.jpg" },
    { id: "eng_9", type: "image", filename: "9.JPG" },
    { id: "eng_10", type: "image", filename: "10.jpg" },
    { id: "eng_11", type: "image", filename: "11.jpg" },
    { id: "eng_12", type: "image", filename: "12.jpg" },
    { id: "eng_video", type: "video", filename: "sheep.mp4" }
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
