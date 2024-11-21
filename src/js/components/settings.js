feather.replace();

// settup sliders

const fslider = document.getElementById("fslider");
const frangeValue = document.getElementById("frangevalue");

fslider.addEventListener("input", function () {
  frangeValue.textContent = fslider.value;
});

const rslider = document.getElementById("rslider");
const rrangeValue = document.getElementById("rrangevalue");

rslider.addEventListener("input", function () {
  rrangeValue.textContent = rslider.value;
});

const bslider = document.getElementById("bslider");
const brangeValue = document.getElementById("brangevalue");

bslider.addEventListener("input", function () {
  brangeValue.textContent = bslider.value;
});

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("apply");
  button.addEventListener("click", () => {
    const f = fslider.value;
    const r = rslider.value;
    const b = bslider.value;
  });
});

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
