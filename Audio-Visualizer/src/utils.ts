const makeColor = (red: number, green: number, blue: number, alpha: number = 1) => {
  return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const getRandomColor = () => {
  const floor = 35; // so that colors are not too bright or too dark 
  const getByte = () => getRandom(floor, 255 - floor);
  return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const makeLine = (ctx: CanvasRenderingContext2D, x: number, y: number, audioData: Uint8Array, canvasWidth: number) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 0; i < audioData.length; i++) {
    const value = audioData[i];
    ctx.lineTo(x, y - value);
    x += (canvasWidth / (audioData.length - 50));
  }
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

const makeCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, percent: number, radius: number) => {
  ctx.beginPath();
  ctx.fillStyle = makeColor(105, 4, 58, .5 - percent / 5);
  ctx.arc(x, y, radius * percent, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.closePath();

}

// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
const goFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullscreen) {
    element.mozRequestFullscreen();
  } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
  // .. and do nothing if the method is not supported
};

export { makeColor, getRandom, getRandomColor, goFullscreen, makeLine, makeCircle };