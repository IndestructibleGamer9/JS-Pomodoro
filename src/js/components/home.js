feather.replace();
const circle = document.getElementById("circle");
const percentText = document.getElementById("percent");
const playButton = document.getElementById("play-button");
const nextButton = document.getElementById("next");
const resetButton = document.getElementById("reset");
const sessionText = document.getElementById("session");

var work_t = 25 * 60;
var rest_t = 5 * 60;
var break_t = 20 * 60;
var session_t = 0;
var playing = false;
var start = 0;
var end = 0;
const session = [work_t, rest_t, work_t, rest_t, work_t, break_t];
const sessionTxt = ["Focus", "Rest", "Focus", "Rest", "Focus", "Break"];
var session_index = 0;

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

function changeProgress(value) {
  // Calculate circumference based on radius (2 * PI * r)
  const circumference = 2 * Math.PI * 180; // Updated for new radius
  const offset = circumference - (circumference * value) / 100;

  // Force browser reflow
  circle.getBoundingClientRect();

  // Set initial state
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = offset;

  // No animation for percentage
  // Directly set the value without animation
  circle.style.strokeDashoffset = offset;
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
    session_t -= 1;
    percentText.textContent = formatt(session_t);
    changeProgress((session_t / session[session_index]) * 100);
    if (session_t == 0) {
      next();
    }
  }
}

function sendDatetimeToServer(start, end) {
  fetch("/save-datetime", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ start, end }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Datetimes send successfully");
      } else {
        console.error("Failed to send datetiems");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function reset() {
  if (playing == true) {
    playButton.innerHTML =
      '<span class="text"><i id="play"data-feather="play"></i></span>';
    feather.replace();
    finish = getDatetime();
    console.log(finish);
    console.log(minusDatetime(start, finish));
    sendDatetimeToServer(start, finish);
  }
  playing = false;
  session_t = session[session_index];

  // Update content
  percentText.textContent = formatt(session_t);
  sessionText.textContent = sessionTxt[session_index];

  reset_anime();
}

function reset_anime() {
  // First remove animations and content
  percentText.classList.remove("animate");
  sessionText.classList.remove("animate");
  circle.style.transition = "none";
  circle.style.strokeDashoffset = "1130.97"; // Full circle value

  // Force reflow
  void percentText.offsetWidth;
  void sessionText.offsetWidth;
  void circle.offsetWidth;

  // Re-enable transitions and add animations
  requestAnimationFrame(() => {
    circle.style.transition =
      "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)";
    percentText.classList.add("animate");
    sessionText.classList.add("animate");

    // Reset progress circle with animation
    setProgress(100);
  });
}

function next() {
  session_index += 1;
  if (session_index >= session.length) {
    session_index = 0;
  }
  if (playing == true) {
    playButton.innerHTML =
      '<span class="text"><i id="play"data-feather="play"></i></span>';
    feather.replace();
    finish = getDatetime();
    console.log(finish);
    console.log(minusDatetime(start, finish));
    sendDatetimeToServer(start, finish);
  }
  playing = false;
  session_t = session[session_index];
  percentText.textContent = formatt(session_t);
  sessionText.textContent = sessionTxt[session_index].toString();
  reset_anime();
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
    sendDatetimeToServer(start, finish);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setInterval(mainloop, 1000);
  setProgress(100);
  session_t = work_t;
  percentText.textContent = formatt(session_t);
  percentText.classList.add("animate");
  sessionText.classList.add("animate");

  // Trigger the animation by adding a class
  percentText.classList.add("animate");

  // Add event listeners for the buttons
  playButton.addEventListener("click", () => {
    play();
  });
  resetButton.addEventListener("click", () => {
    reset();
  });
  nextButton.addEventListener("click", () => {
    next();
  });
});
