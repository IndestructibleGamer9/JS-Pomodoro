feather.replace();
const circle = document.getElementById("circle");
const percentText = document.getElementById("percent");

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

    percentText.textContent = "20:00";

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

// Start animation
setProgress(100);
