const Stopwatch = require("statman-stopwatch");
const stopwatch = new Stopwatch();
// var moment = require("moment");
import moment from "moment";
var momentDurationFormatSetup = require("moment-duration-format");

let stopwatchRunning = false;
let time;
let timerInterval;

// query selectors for timer
const timerDisplay = document.querySelector("[data-timer-display]");
export const timerContainer = document.querySelector("[data-timer-container]");
const statsDisplay = document.querySelector("[stats-timer-display]");
const stopButton = document.getElementsByClassName("stop");
const resetButton = document.getElementsByClassName("reset");

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
export function saveToLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(timesArray));
}

// array of time objects and local storage key
const LOCAL_STORAGE_LIST_KEY = "saved.times";
export let timesArray =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

//function to push new time to times array
export function pushNewTime(recordedTime) {
  timesArray.unshift(new Time(recordedTime));
}

export function formatTime(time) {
  return moment.duration(time, "milliseconds").format("ss.SS", { trim: false });
}

//class to create time objects
export class Time {
  constructor(recordedTime) {
    this.recordedTime = recordedTime;
    this.id = Date.now() + Math.random();
    this.formattedTime = formatTime(this.recordedTime);
    this.date = moment();
  }
}

function startStopwatch() {
  stopwatch.start();
  stopwatchRunning = true;
  timerInterval = setInterval(() => {
    time = stopwatch.read();
    timerDisplay.textContent = formatTime(time);
  }, 1);
}

function stopStopwatch() {
  stopwatch.stop();
  stopwatchRunning = false;
  time = stopwatch.read();
  timerDisplay.textContent = formatTime(time);
  stopwatch.reset();
  saveToLocalStorage();
}

function resetStopwatch() {
  clearInterval(timerInterval);
  stopwatchRunning = false;
}

function recordedTime() {}

function lapStopwatch() {
  time = stopwatch.read();
  statsDisplay.textContent = formatTime(time);
  renderStatsDisplay();
}

//function to render stats display
export function renderStatsDisplay() {
  samplesStats.textContent = setSampleStats();
  minStats.textContent = setMinStats();
  meanStats.textContent = setMeanStats();
  maxStats.textContent = setMaxStats();
  medianStats.textContent = setMedianStats();
  modeStats.textContent = setModeStats();
  totalStats.textContent = setTotalStats();
  cycleperhourStats.textContent = setCyclesStats();
}

timerContainer.addEventListener("click", () => {
  if (!stopwatchRunning) {
    startStopwatch();
  } else if (stopwatchRunning) {
    lapStopwatch();
  }
});
