const videoElement = document.querySelector('.input_video');
const canvasElement = document.querySelector('.output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const statusElement = document.getElementById('status');
const toggleButton = document.getElementById('toggleButton');
let voiceEnabled = true;
let lastSpeech = '';
let lastEmotion = '';
let lastSpeakAt = 0;
const synth = window.speechSynthesis;

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function getTextForEmotion(emotion) {
  switch (emotion) {
    case 'bigSmile':
      return '你今天心情看起來非常好喔！';
    case 'smile':
      return '你今天心情看起來不錯喔！';
    case 'neutral':
      return '我還沒看出來你的表情，試著多笑一點吧！';
    case 'surprise':
      return '哇，你看起來很驚訝呢！';
    default:
      return '正在偵測你的表情…';
  }
}

function speak(text) {
  if (!voiceEnabled || !synth) return;
  const now = Date.now();
  if (text === lastSpeech && now - lastSpeakAt < 3500) return;
  lastSpeech = text;
  lastSpeakAt = now;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW';
  utterance.rate = 1;
  utterance.pitch = 1;
  synth.cancel();
  synth.speak(utterance);
}

toggleButton.addEventListener('click', () => {
  voiceEnabled = !voiceEnabled;
  toggleButton.textContent = voiceEnabled ? '關閉語音回饋' : '開啟語音回饋';
});

const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

faceMesh.onResults(onResults);

function onResults(results) {
  if (!results.multiFaceLandmarks || !results.multiFaceLandmarks.length) {
    statusElement.textContent = '未偵測到臉部，請將相機對準你的臉。';
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    return;
  }

  const landmarks = results.multiFaceLandmarks[0];

  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: '#cbd5e1', lineWidth: 1 });
  drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: '#f59e0b', lineWidth: 2 });
  drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: '#38bdf8', lineWidth: 1 });
  drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: '#38bdf8', lineWidth: 1 });
  canvasCtx.restore();

  const leftMouth = landmarks[61];
  const rightMouth = landmarks[291];
  const topLip = landmarks[13];
  const bottomLip = landmarks[14];
  const mouthWidth = distance(leftMouth, rightMouth);
  const mouthHeight = distance(topLip, bottomLip);
  const mouthRatio = mouthWidth / mouthHeight;

  const leftEyeTop = landmarks[386];
  const leftEyeBottom = landmarks[374];
  const rightEyeTop = landmarks[159];
  const rightEyeBottom = landmarks[145];
  const eyeHeight = (distance(leftEyeTop, leftEyeBottom) + distance(rightEyeTop, rightEyeBottom)) / 2;
  const eyeWidth = distance(landmarks[33], landmarks[133]);
  const eyeRatio = eyeWidth / eyeHeight;

  let emotion = 'neutral';

  if (mouthRatio > 2.6) {
    emotion = 'bigSmile';
  } else if (mouthRatio > 2.1) {
    emotion = 'smile';
  } else if (eyeRatio > 5.5) {
    emotion = 'surprise';
  }

  if (emotion !== lastEmotion) {
    lastEmotion = emotion;
    const text = getTextForEmotion(emotion);
    statusElement.textContent = text;
    speak(text);
  } else {
    statusElement.textContent = getTextForEmotion(emotion);
  }
}

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({ image: videoElement });
  },
  width: 1280,
  height: 960,
});

camera.start().then(() => {
  statusElement.textContent = '相機已啟動，準備進行表情辨識。';
}).catch((error) => {
  statusElement.textContent = '無法啟動相機，請確認已允許瀏覽器存取相機。';
  console.error(error);
});
