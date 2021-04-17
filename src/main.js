const Stopwatch = require("statman-stopwatch");
const stopwatch = new Stopwatch();
import moment from "moment";
var momentDurationFormatSetup = require("moment-duration-format");

let stopwatchRunning = false;
let time;
let timerInterval;
let id = 100;

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
  // remember to set the opition to change the measurement unit changing time/0.6
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
  timesArray.unshift(new Time(recordedTime));
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
}

function stopStopwatch() {
  stopwatch.stop();
  stopwatchRunning = false;
  clearInterval(timerInterval);
  saveToLocalStorage();
}

function resetStopwatch() {
  stopwatch.reset();
  stopwatchRunning = false;
  samplesDisplay.innerHTML = "";
}

function updateDisplayRecordedTime() {
  time = stopwatch.read();
  let p = document.createElement("p");
  let textP = document.createTextNode(timesArray[0].formattedTime);
  p.appendChild(textP);
  samplesDisplay.appendChild(p);
  console.log(timesArray[0].formattedTime);
}

function lapStopwatch() {
  pushNewTime(time);
  updateDisplayRecordedTime();

  // renderStatsDisplay();
}

//function to render stats display
function renderStatsDisplay() {
  samplesStats.textContent = setSampleStats();
  minStats.textContent = setMinStats();
  meanStats.textContent = setMeanStats();
  maxStats.textContent = setMaxStats();
  medianStats.textContent = setMedianStats();
  modeStats.textContent = setModeStats();
  totalStats.textContent = setTotalStats();
  cycleperhourStats.textContent = setCyclesStats();
}

startButton.addEventListener("click", () => {
  if (!stopwatchRunning) {
    startStopwatch();
    console.log(stopwatchRunning);
    startButton.textContent = "LAP";
  } else if (stopwatchRunning) {
    lapStopwatch();
  }
});

stopButton.addEventListener("click", () => {
  if (stopwatchRunning) {
    stopStopwatch();
    console.log(stopwatchRunning);
    startButton.textContent = "START";
  }
});

resetButton.addEventListener("click", () => {
  resetStopwatch();
  console.log(stopwatchRunning);
});
