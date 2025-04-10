//imports
import * as utils from './utils';
import * as audio from './audio';
import * as canvas from './visualizer';
import * as json from './load-json';
import * as burger from './burger';

import { drawParams } from './interfaces/drawParams.interface';

//enum
import { DEFAULTS } from './enums/main-defaults.enum';

const init = () => {
  audio.setupWebaudio(DEFAULTS.sound1);
  console.log("init called");
  //console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setupUI(canvasElement);

  canvas.setupCanvas(canvasElement, audio.analyserNode);

  json.loadJson();

  burger.makeBurger();

  loop();
}

const setupUI = (canvasElement: HTMLCanvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#btn-fs") as HTMLButtonElement;
  const playButton = document.querySelector("#btn-play") as HTMLButtonElement;

  // add .onclick event to button
  if (fsButton) {
    fsButton.onclick = e => {
      //console.log("goFullscreen() called");
      utils.goFullscreen(canvasElement);
    };
  }

  //PLAY BUTTON
  if (playButton) {
    playButton.onclick = e => {
      console.log(`audioCtx.state before = ${audio.audioCtx.state}`)


      //check if in suspend state (autoplay)
      if (audio.audioCtx.state == "suspended") {
        audio.audioCtx.resume();
      }
      console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
      const target = e.target as HTMLInputElement;
      if (target.dataset.playing == "no") {
        //if currently paused, play it
        audio.playCurrentSound();
        target.dataset.playing = "yes";

      } else {
        audio.pauseCurrentSound();
        target.dataset.playing = "no";
      }

    };
  }

  //VOLUME SLIDER
  //get references to them
  let volumeSlider = document.querySelector("#slider-volume") as HTMLButtonElement;
  let volumeLabel = document.querySelector("#label-volume") as HTMLButtonElement;

  //change on input
  if (volumeSlider) {
    volumeSlider.oninput = e => {
      const target = e.target as HTMLInputElement;
      //set gain
      audio.setVolume(parseFloat(target.value));
      //update value on label
      volumeLabel.innerHTML = `${Math.round((parseFloat(target.value) / 2 * 100))}`;
    };


    //set initial
    volumeSlider.dispatchEvent(new Event("input"));

  }

  //TRACK SELECT
  let trackSelect = document.querySelector("#select-track") as HTMLButtonElement;
  //onchange event
  if (trackSelect) {
    trackSelect.onchange = e => {
      const target = e.target as HTMLInputElement;
      audio.loadSoundFile(target.value);
      //pause current if playing
      if (playButton.dataset.playing == "yes") {
        playButton.dispatchEvent(new MouseEvent("click"));
      }
    };
  }

  //CHECKBOX EVENTS
  //reference from html
  let lineCheck = document.querySelector("#cb-lines") as HTMLInputElement;
  let fireCheck = document.querySelector("#cb-fireworks") as HTMLInputElement;
  let triCheck = document.querySelector("#cb-triangles") as HTMLInputElement;
  let barCheck = document.querySelector("#cb-bars") as HTMLInputElement;
  let circleCheck = document.querySelector("#cb-circles") as HTMLInputElement;
  let invCheck = document.querySelector("#cb-invert") as HTMLInputElement;

  //start them checked
  if (barCheck) {
    barCheck.checked = true;
  }

  if (fireCheck) {
    fireCheck.checked = true;
  }

  if (triCheck) {
    triCheck.checked = true;
  }
  //line
  if (lineCheck) {
    lineCheck.onclick = () => {
      if (lineCheck.checked) {
        drawParams.showLine = true;
      } else {
        drawParams.showLine = false;
      }
    }
  }

  //bars
  if (barCheck) {
    barCheck.onclick = () => {
      if (barCheck.checked) {
        drawParams.showBars = true;
      } else {
        drawParams.showBars = false;
      }
    }
  }

  //circles
  if (circleCheck) {
    circleCheck.onclick = () => {
      if (circleCheck.checked) {
        drawParams.showCircles = true;
      } else {
        drawParams.showCircles = false;
      }

    }
  }

  //invert
  if (invCheck) {
    invCheck.onclick = () => {
      if (invCheck.checked) {
        drawParams.showInvert = true;
      } else {
        drawParams.showInvert = false;
      }

    }
  }

  //fireworks
  if (fireCheck) {
    fireCheck.onclick = () => {
      if (fireCheck.checked) {
        drawParams.showFireworks = true;
      } else {
        drawParams.showFireworks = false;
      }

    }
  }

  //triangles
  if (triCheck) {
    triCheck.onclick = () => {
      if (triCheck.checked) {
        drawParams.showTriangles = true;
      } else {
        drawParams.showTriangles = false;
      }

    }
  }


  //SOUND FILTERS
  let highCheck = document.querySelector('#cb-highshelf') as HTMLInputElement;
  let lowsCheck = document.querySelector('#cb-lowshelf') as HTMLInputElement;
  let distCheck = document.querySelector('#cb-distortion') as HTMLInputElement;
  let sliderDist = document.querySelector('#slider-distortion') as HTMLInputElement;
  let selectVis = document.querySelector('#select-visualizer') as HTMLInputElement;

  if (highCheck) {
    highCheck.checked = drawParams.highshelf;

    highCheck.onchange = e => {
      const target = e.target as HTMLInputElement;
      drawParams.highshelf = target.checked;
      audio.toggleHighshelf(drawParams);
    };
  }

  if (lowsCheck) {
    lowsCheck.checked = drawParams.lowshelf;

    lowsCheck.onchange = e => {
      const target = e.target as HTMLInputElement;
      drawParams.lowshelf = target.checked;
      audio.toggleLowshelf(drawParams);
    };
  }

  if (distCheck) {
    distCheck.checked = drawParams.distortion;

    distCheck.onchange = e => {
      const target = e.target as HTMLInputElement;
      drawParams.distortion = target.checked;
      audio.toggleDistortion(drawParams);
    };
  }

  if (sliderDist) {
    sliderDist.value = drawParams.distortionAmount.toString();
    sliderDist.onchange = e => {
      const target = e.target as HTMLInputElement;
      drawParams.distortionAmount = Number(target.value);
      audio.toggleDistortion(drawParams);
    };

  }

  //TOGGLE VISUALIZATION
  if (selectVis) {
    selectVis.onchange = e => {
      const target = e.target as HTMLInputElement;
      if (target.value == "frequency") {
        drawParams.toggleWave = false;
      } else {
        drawParams.toggleWave = true;
      }
    }
  }

} // end setupUI

//DATA VISULIZER
const loop = () => {
  let fps: number = 60;
  canvas.draw(drawParams);
  setTimeout(loop, 1000/fps);

}

export { init };