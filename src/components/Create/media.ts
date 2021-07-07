interface mediaTypeState {
  [key: string]: string;

  image: string;
  video: string;
  audio: string;
  text: string;
  file: string;
  url: string;
}

interface mediaSizeState {
  [key: string]: number;

  image: number;
  video: number;
  audio: number;
  file: number;
  url: number;
}

// 媒体类型 placeholder
export const mediaPlaceholder: mediaTypeState = {
  image: `You can drag and drop your file here.\n.png, .jpg, and .gif are supported`,
  video: `You can drag and drop your file here.\n.mp4, and .mov are supported`,
  audio: `You can drag and drop your file here.\n.mp3, and .wav are supported`,
  text: `You can drag and drop your file here.\n.txt, and .md are supported`,
  file: `You can drag and drop your file here.\n.pdf, .psd, and .ai are supported`,
  url: ``,
};

// 媒体上传 accept
export const mediaAcceptList = {
  image: 'image/jpeg, image/png, image/gif',
  video: 'video/mp4, video/quicktime',
  audio:
    'audio/mpeg, audio/mp3, audio/vnd.wav, audio/wav, audio/vnd.wave, audio/wave, audio/x-wav',
  text: 'text/markdown, text/x-markdown, text/plain',
  file: 'image/vnd.adobe.photoshop, application/pdf, application/postscript',
  url: '',
};

// 媒体上传 size
export const mediaSizeList: mediaSizeState = {
  image: 50,
  video: 100,
  audio: 100,
  file: 100,
  url: 0,
};
