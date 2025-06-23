// Time in ms until the idle mode is activated
export const IDLE_TIME = 2000; 

// Media data with references to filenames
// folders are identified automatically in the assets folder under ger and eng
export const mediaData = {
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

// Styling
export const styles = {
    button_primary: "bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 p-2 rounded-md",
    button_secondary : "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20",
};