require("moment-duration-format");
import { create, all, mean } from "mathjs";
const math = create(all);
const Stopwatch = require("statman-stopwatch");
const stopwatch = new Stopwatch();
import moment from "moment";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


// var ctx = document.getElementById('myChart');
// var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });

let stopwatchRunning = false;
let time;
let timerInterval;
let id = 1;
let times = [];

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
  pushNewFormattedTimesArray();
}

function pushNewFormattedTimesArray() {
  // function to do an array with formatted times only
  if (timesArray.length >= 2) {
    times.push(
      parseFloat(
        (
          parseFloat(timesArray[timesArray.length - 1].formattedTime) -
          parseFloat(timesArray[timesArray.length - 2].formattedTime)
        ).toFixed(2)
      )
    );
  }
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

function lapStopwatch() {
  pushNewTime(time);
  updateDisplayRecordedTime();
  renderStatsDisplay();
}

function updateDisplayRecordedTime() {
  time = stopwatch.read();
  let p = document.createElement("p");
  if (timesArray.length == 1) {
    // let textP = document.createTextNode(timesArray[1].formattedTime)
    let textP = document.createTextNode(times[times.length - 1]);
    p.appendChild(textP);
    samplesDisplay.appendChild(p);
  } else {
    let textP = document.createTextNode(times[times.length - 1]);
    p.appendChild(textP);
    samplesDisplay.appendChild(p);
  }
}

function clearAllStats() {
  samplesDisplay.textContent = "";
  samplesStats.textContent = "00";
  minStats.textContent = "00.00";
  meanStats.textContent = "00.00";
  maxStats.textContent = "00.00";
  medianStats.textContent = "00.00";
  totalStats.textContent = "00.00";
  cycleperhourStats.textContent = "00";
  localStorage.clear();
  timesArray = [];
  times = [];
}

function setMeanStats() {
  // if (timesArray.length >= 3) {
  //   meanStats.textContent = (
  //     parseFloat(timesArray[timesArray.length - 1].formattedTime) /
  //     (timesArray.length - 1)
  //   ).toFixed(2);
  // } else {
  //   meanStats.textContent = "00.00";
  // }
  if (times.length != 0) {
    meanStats.textContent = math.mean(times).toFixed(2);
  }
}

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
      6000 / times[1]
    ).toFixed(0);
  } else {
    cycleperhourStats.textContent = (
      6000 / times[times.length - 1]).toFixed(0);
  }
}

function setMinStats() {
  if (times.length != 0) {
    minStats.textContent = math.min(times);
  }
}

function setMaxStats() {
  if (times.length != 0) {
    maxStats.textContent = math.max(times);
  }
}

function setMedianStats() {
  if (times.length != 0) {
    medianStats.textContent = math.median(times).toFixed(2);
  }
}

//function to render stats display
function renderStatsDisplay() {
  setSampleStats();
  setMinStats();
  setMeanStats();
  setMaxStats();
  setMedianStats();
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