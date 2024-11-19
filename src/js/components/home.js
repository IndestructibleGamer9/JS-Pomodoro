feather.replace();
const circle = document.getElementById("circle");
const percentText = document.getElementById("percent");
const playButton = document.getElementById("play-button");
const nextButton = document.getElementById("next");
const resetButton = document.getElementById("reset");
var work_t = 25 * 60;
var rest_t = 5 * 60;
var break_t = 20 * 60;
var playing = false;
var start = 0;
var end = 0;

function setProgress(value) {
  // Calculate circumference based on radius (2 * PI * r)
  const circumference = 2 * Math.PI * 180; // Updated for new radius
  const offset = circumference - (circumference * value) / 100;

  // Force browser reflow
  circle.getBoundingClientRect();

  // Set initial state
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  // Trigger animation
  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 50);

  // Animate percentage
  animateValue(0, value, 1500);
}

function animateValue(start, end, duration) {
  let startTimestamp = null;

  function step(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(start + (end - start) * easeProgress);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

function formatt(seconds) {
  time =
    Math.floor(seconds / 60) +
    ":" +
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
  return time;
}

function minusDatetime(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate - startDate;

  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHrs} hours and ${diffMins} minutes`;
}

function getDatetime() {
  var currentdate = new Date();
  var datetime =
    currentdate.getFullYear() +
    "-" +
    (currentdate.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    currentdate.getDate().toString().padStart(2, "0") +
    "T" +
    currentdate.getHours().toString().padStart(2, "0") +
    ":" +
    currentdate.getMinutes().toString().padStart(2, "0") +
    ":" +
    currentdate.getSeconds().toString().padStart(2, "0");

  return datetime;
}

function mainloop() {
  if (playing == true) {
  }
}

function play() {
  if (playing == false) {
    playing = true;
    playButton.innerHTML =
      '<span class="text"><i id="play"data-feather="pause"></i></span>';
    feather.replace();
    start = getDatetime();
    console.log(start);
  } else {
    playing = false;
    playButton.innerHTML =
      '<span class="text"><i id="play"data-feather="play"></i></span>';
    feather.replace();
    finish = getDatetime();
    console.log(finish);
    console.log(minusDatetime(start, finish));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setProgress(100);
  console.log("setting time");
  percentText.textContent = formatt(work_t);

  // Trigger the animation by adding a class
  percentText.classList.add("animate");

  // Add event listeners for the buttons
  playButton.addEventListener("click", () => {
    play();
  });
  resetButton.addEventListener("click", () => {
    console.log("reset");
  });
  nextButton.addEventListener("click", () => {
    console.log("next");
  });
});
