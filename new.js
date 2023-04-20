// HTML code for the video player and controls
<html>
  <body>
    <video id="video" controls></video>
    <button id="start">Start</button>
    <button id="stop">Stop</button>
    <button id="save">Save</button>
    <label for="speed">Playback Speed:</label>
    <select id="speed">
      <option value="0.25">0.25x</option>
      <option value="0.5">0.5x</option>
      <option value="1" selected>1x</option>
      <option value="2">2x</option>
      <option value="4">4x</option>
    </select>
  </body>
</html>

// JavaScript code to capture images and create time-lapse video
const video = document.getElementById('video');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const saveButton = document.getElementById('save');
const speedSelect = document.getElementById('speed');

let capturing = false;
let images = [];

startButton.addEventListener('click', () => {
  capturing = true;
});

stopButton.addEventListener('click', () => {
  capturing = false;
});

saveButton.addEventListener('click', () => {
  const fps = parseFloat(speedSelect.value);
  const canvas = require('canvas').createCanvas(video.videoWidth, video.videoHeight);
  const ctx = canvas.getContext('2d');
  const command = require('ffmpeg-static').path;

  images.forEach((image, index) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      canvas.createJPEGStream().pipe(fs.createWriteStream(`image-${index}.jpg`));
    };
    img.src = image;
  });

  const ffmpeg = require('fluent-ffmpeg')(command);
  ffmpeg.input(`image-%d.jpg`)
    .inputFps(fps)
    .output('output.mp4')
    .outputFps(fps)
    .on('end', () => {
      console.log('Video saved');
    })
    .run();
});

setInterval(() => {
  if (capturing) {
    const canvas = require('canvas').createCanvas(video.videoWidth, video.videoHeight);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const image = canvas.toDataURL('image/jpeg');
    images.push(image);
  }
}, 1000);
