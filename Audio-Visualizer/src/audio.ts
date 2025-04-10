// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx: AudioContext;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element: HTMLAudioElement;
let sourceNode: AudioNode;
let analyserNode: AnalyserNode;
let gainNode: GainNode;
let distortionFilter: WaveShaperNode;
let highBiquadFilter: BiquadFilterNode;
let lowBiquadFilter: BiquadFilterNode;

//real enum
import { DEFAULTS } from './enums/audio-defaults.enum';

import { DrawParams } from './interfaces/drawParams.interface';

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
const setupWebaudio = (filePath: string) => {
    // 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext;
    audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    element = new Audio();

    // 3 - have it point at a sound file
    loadSoundFile(filePath);

    // 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    // 5 - create an analyser node
    // note the UK spelling of "Analyser"
    analyserNode = audioCtx.createAnalyser();

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    //create filters and distortion
    highBiquadFilter = audioCtx.createBiquadFilter();
    highBiquadFilter.type = "highshelf";

    lowBiquadFilter = audioCtx.createBiquadFilter();
    lowBiquadFilter.type = "lowshelf";

    distortionFilter = audioCtx.createWaveShaper();
    //distortionFilter.type = "distortion";


    // 8 - connect the nodes - we now have an audio graph
    sourceNode.connect(gainNode);
    gainNode.connect(highBiquadFilter);
    highBiquadFilter.connect(lowBiquadFilter);
    lowBiquadFilter.connect(distortionFilter);
    distortionFilter.connect(analyserNode);

    //connect to destination
    analyserNode.connect(audioCtx.destination);
}

//load
const loadSoundFile = (filePath: string) => {
    element.src = filePath;
}

//play
const playCurrentSound = () => {
    element.play();
}

//pause
const pauseCurrentSound = () => {
    element.pause();
}

//volume change
const setVolume = (value: number) => {
    // make sure that it's a Number rather than a String
    value = Number(value);
    gainNode.gain.value = value
}

//change highShelf
const toggleHighshelf = (params: DrawParams) => {
    if (params.highshelf) {
        highBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime); // we created the `biquadFilter` (i.e. "treble") node last time
        highBiquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);
    } else {
        highBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

//change lowShelf
const toggleLowshelf = (params: DrawParams) => {
    if (params.lowshelf) {
        lowBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        lowBiquadFilter.gain.setValueAtTime(15, audioCtx.currentTime);
    } else {
        lowBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

//change distortion
const toggleDistortion = (params: DrawParams) => {
    if (params.distortion) {
        distortionFilter.curve = null; // being paranoid and trying to trigger garbage collection
        distortionFilter.curve = makeDistortionCurve(params.distortionAmount);
    } else {
        distortionFilter.curve = null;
    }
}

//changes based on slider
const makeDistortionCurve = (amount: number = 20) => {
    let n_samples = 256, curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
        let x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}

//export
export { audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, analyserNode, toggleHighshelf, toggleLowshelf, toggleDistortion, makeDistortionCurve };
