import { mediaData } from "./constants";

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
