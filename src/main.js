const Stopwatch = require("statman-stopwatch");
const stopwatch = new Stopwatch();
// import math, { mean } from "mathjs";
import moment from "moment";

//I don't know why yet, but without this import the code will crash
var momentDurationFormatSetup = require("moment-duration-format");

// console.log(math.mean(2, 5))

let stopwatchRunning = false;
let time;
let timerInterval;
let id = 1;
let incrementalTime;

// set the initial state of array of times
localStorage.clear();
timesArray = [];
saveToLocalStorage();

// query selectors for timer
const timerDisplay = document.querySelector("[data-timer-display]");
const startButton = document.getElementById("btnStart");
const stopButton = document.getElementById("btnStop");
const resetButton = document.getElementById("btnReset");
const samplesDisplay = document.querySelector("[stats-right]");

// query selector for stats
const samplesStats = document.querySelector("[data-samples]");
const minStats = document.querySelector("[data-min]");
const meanStats = document.querySelector("[data-mean]");
const maxStats = document.querySelector("[data-max]");
const medianStats = document.querySelector("[data-median]");
const modeStats = document.querySelector("[data-mode]");
const totalStats = document.querySelector("[data-total]");
const cycleperhourStats = document.querySelector("[data-cyclesperhour]");

// function to save to local storage
function saveToLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(timesArray));
}

// array of time objects and local storage key
const LOCAL_STORAGE_LIST_KEY = "saved.times";
let timesArray = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

// function to format time
function formatTime(time) {
  return moment
    .duration(time / 0.6, "milliseconds")
    .format("ss.SS", { trim: false });
  // remember to set the option to change the measurement unit changing time/0.6
}

//class to create time objects
class Time {
  constructor(recordedTime) {
    this.recordedTime = recordedTime;
    this.id = id++;
    this.formattedTime = formatTime(this.recordedTime);
    this.date = moment();
  }
}

//function to push new time to times array
function pushNewTime(recordedTime) {
  // timesArray.unshift(new Time(recordedTime));
  timesArray.push(new Time(recordedTime));
}

function startStopwatch() {
  stopwatch.start();
  stopwatchRunning = true;
  timerInterval = setInterval(() => {
    time = stopwatch.read();
    timerDisplay.textContent = formatTime(time);
  }, 1);
  pushNewTime(time);
  saveToLocalStorage();
  setTotalStats();
}

function stopStopwatch() {
  stopwatch.stop();
  clearInterval(timerInterval);
  stopwatchRunning = false;
  saveToLocalStorage();
}

function resetStopwatch() {
  stopwatch.reset();
  stopwatchRunning = false;
  clearAllStats();
  saveToLocalStorage();
}

function updateDisplayRecordedTime() {
  time = stopwatch.read();
  let p = document.createElement("p");
  if (timesArray.length == 1) {
    let textP = document.createTextNode(timesArray[1].formattedTime);
    p.appendChild(textP);
    samplesDisplay.appendChild(p);
  } else {
    let textP = document.createTextNode(
      (
        timesArray[timesArray.length - 1].formattedTime -
        timesArray[timesArray.length - 2].formattedTime
      ).toFixed(2)
    );
    p.appendChild(textP);
    samplesDisplay.appendChild(p);
  }

  // time = moment.duration(stopwatch.read(), 'milliseconds');
  // timerDisplay.textContent = formatTime(time);
}

function lapStopwatch() {
  pushNewTime(time);
  updateDisplayRecordedTime();
  renderStatsDisplay();
}

function clearAllStats() {
  samplesDisplay.textContent = "";
  samplesStats.textContent = "00";
  minStats.textContent = "00.00";
  meanStats.textContent = "00.00";
  maxStats.textContent = "00.00";
  medianStats.textContent = "00.00";
  modeStats.textContent = "00.00";
  totalStats.textContent = "00.00";
  cycleperhourStats.textContent = "00";
  localStorage.clear();
  timesArray = [];
}

// function setMeanStats() {
   // var total = 0;
   // for (var i = 0; i < timesArray.length; i++) {
    //   total += timesArray[i].formattedTime;
   // }
   // var avg = total / timesArray.length;
   // meanStats.textContent = math.mean(1, 3);
// }

function setSampleStats() {
  samplesStats.textContent = timesArray.length - 1;
}

function setTotalStats() {
  timerInterval = setInterval(() => {
    time = stopwatch.read();
    totalStats.textContent = formatTime(time);
  }, 1);
}

function setCyclesStats() {
  if (timesArray.length == 1) {
    cycleperhourStats.textContent = (
      6000 / parseFloat(timesArray[1].formattedTime)
    ).toFixed(0);
  } else {
    cycleperhourStats.textContent = (
      6000 /
      (parseFloat(timesArray[timesArray.length - 1].formattedTime) -
        parseFloat(timesArray[timesArray.length - 2].formattedTime))
    ).toFixed(0);
  }
}

//function to render stats display
function renderStatsDisplay() {
  setSampleStats();
  // minStats.textContent = setMinStats();
  // setMeanStats();
  // maxStats.textContent = setMaxStats();
  // medianStats.textContent = setMedianStats();
  // modeStats.textContent = setModeStats();
  setTotalStats();
  setCyclesStats();
}

// buttons functions

startButton.addEventListener("click", () => {
  if (!stopwatchRunning) {
    startStopwatch();
    startButton.textContent = "LAP";
  } else if (stopwatchRunning) {
    lapStopwatch();
  }
});

stopButton.addEventListener("click", () => {
  if (stopwatchRunning) {
    stopStopwatch();
    startButton.textContent = "START";
  }
});

resetButton.addEventListener("click", () => {
  resetStopwatch();
  startButton.textContent = "START";
});
