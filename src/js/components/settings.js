feather.replace();

console.log("settings");

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
