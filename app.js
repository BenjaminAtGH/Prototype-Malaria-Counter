let parasiteCount = 0;
let leukocyteCount = 0;
let assumedWBC = 8000;

let tapHistory = [];
let warningShown = false;

const pCountEl = document.getElementById("p-count");
const lCountEl = document.getElementById("l-count");
const densityEl = document.getElementById("density");
const warningEl = document.getElementById("warning");

function vibrate(ms) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function updateDisplay() {
  pCountEl.textContent = parasiteCount;
  lCountEl.textContent = leukocyteCount;

  if (leukocyteCount > 0) {
    densityEl.textContent = Math.round(
      (parasiteCount * assumedWBC) / leukocyteCount
    );
  } else {
    densityEl.textContent = "–";
  }

  if (leukocyteCount >= 200 && !warningShown) {
    warningEl.hidden = false;
    vibrate(100);
    warningShown = true;
  }
}

function addTap(type) {
  tapHistory.push(type);

  if (type === "parasite") parasiteCount++;
  if (type === "leukocyte") leukocyteCount++;

  vibrate(10);
  updateDisplay();
}

document.getElementById("parasite")
  .addEventListener("touchstart", () => addTap("parasite"));

document.getElementById("leukocyte")
  .addEventListener("touchstart", () => addTap("leukocyte"));

document.getElementById("undo")
  .addEventListener("click", () => {
    const last = tapHistory.pop();
    if (!last) return;

    if (last === "parasite" && parasiteCount > 0) parasiteCount--;
    if (last === "leukocyte" && leukocyteCount > 0) leukocyteCount--;

    vibrate(30);
    updateDisplay();
  });

document.getElementById("reset")
  .addEventListener("click", () => {
    parasiteCount = 0;
    leukocyteCount = 0;
    tapHistory = [];
    warningShown = false;
    warningEl.hidden = true;
    vibrate(50);
    updateDisplay();
  });

if (screen.orientation?.lock) {
  screen.orientation.lock("portrait").catch(() => {});
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
