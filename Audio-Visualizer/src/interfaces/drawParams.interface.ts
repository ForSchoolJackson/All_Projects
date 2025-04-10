export interface DrawParams{
    showLine: boolean,
    showBars: boolean,
    showCircles: boolean,
    showFireworks: boolean,
    showTriangles: boolean,
    showInvert: boolean,
    highshelf: boolean,
    lowshelf: boolean,
    distortion: boolean,
    toggleWave: boolean,
    distortionAmount: number

  }

  //params object
const drawParams: DrawParams = {
    showLine: false,
    showBars: true,
    showCircles: false,
    showInvert: false,
    showFireworks: true,
    showTriangles: true,
    highshelf: false,
    lowshelf: false,
    distortion: false,
    toggleWave: false,
  
    //set intial distortion
    distortionAmount: 20
  }

  export { drawParams };