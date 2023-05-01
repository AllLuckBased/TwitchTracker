function addVisitedBanner(name, notes) {
  const banner = document.createElement("div");
  banner.id = "visited-banner";
  banner.style.position = "fixed";
  banner.style.bottom = "0";
  banner.style.left = "50%";
  banner.style.transform = "translateX(-50%)";
  banner.style.width = "50%";
  banner.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
  banner.style.zIndex = "9999";
  banner.style.padding = "10px";
  banner.style.color = "white";
  banner.style.textAlign = "left";
  banner.innerHTML = notes
    ? `You have visited ${name} before. Notes: ${notes}<button id="okay-button" style="background-color: #333; border: 1px solid #ddd; color: white; border-radius: 3px; float: right;">Okay</button>`
    : `You have visited ${name} before.<button id="okay-button" style="background-color: #333; border: 1px solid #ddd; color: white; border-radius: 3px; float: right;">Okay</button>`;

  document.body.appendChild(banner);

  const okayButton = document.getElementById("okay-button");
  okayButton.addEventListener("click", () => {
    removeVisitedBanner();
  });
}

function removeVisitedBanner() {
  const bannerElement = document.getElementById("visited-banner");
  if (bannerElement) {
    bannerElement.remove();
  }
}

function checkChannel() {
  removeVisitedBanner();
  chrome.runtime.sendMessage({ type: "checkChannel" }, (response) => {
    if (response.isVisited) {
      addVisitedBanner(response.name, response.notes);
    }
  });
}

// Call checkChannel on initial page load
checkChannel();

// Set up a setInterval to periodically check for URL changes
let currentUrl = window.location.href;
setInterval(() => {
  const newUrl = window.location.href;
  if (newUrl !== currentUrl) {
    currentUrl = newUrl;
    if (newUrl.includes("twitch.tv") && newUrl.split("/").length === 4) {
      checkChannel();
    }
  }
}, 1000);