const Stopwatch = require("statman-stopwatch");
const stopwatch = new Stopwatch();
var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");

let stopwatchRunning = false;
let time;
let timerInterval;

// query selectors for timer
const timerDisplay = document.querySelector("[data-timer-display]");
export const timerContainer = document.querySelector("[data-timer-container]");
const statsDisplay = document.querySelector("[stats-timer-display]");

// function to format time into readable format
export function formatTime(time) {
  return moment.duration(time, "milliseconds").format("ss.SS", { trim: false });
}

function startStopwatch() {
  stopwatch.start();
  stopwatchRunning = true;
  timerInterval = setInterval(() => {
    time = stopwatch.read();
    // update timer display with formatted time;
    timerDisplay.textContent = formatTime(time);
  }, 1);
}

function stopStopwatch() {
  //stop the stop watch and update stopwatchRunning to false
  stopwatch.stop();
  stopwatchRunning = false;
  clearInterval(timerInterval);
  // read the time from the stopwatch
  time = stopwatch.read();
  // update timer display with formatted time;
  timerDisplay.textContent = formatTime(time);
  statsDisplay.textContent = formatTime(time);
  //reset the stopwatch
  stopwatch.reset();
  saveToLocalStorage();
}

function recordedTime () {}

timerContainer.addEventListener("click", () => {
  if (!stopwatchRunning) {
    startStopwatch();
  } else if (stopwatchRunning) {
    stopStopwatch();
  }
});
