document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("search-btn");

  searchBtn.addEventListener("click", () => {
    const searchTerm = searchInput.value;
    searchChannels(searchTerm);
  });
  
  function searchChannels(searchTerm) {
    chrome.storage.local.get("map", ({ map }) => {
      if (map) {
        const filteredMap = {};
        for (const key in map) {
          if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
            filteredMap[key] = map[key];
          }
        }
        displayMap(filteredMap);
      }
    });
  }
  
  const mapForm = document.getElementById("map-form");
  const output = document.getElementById("output");

  loadMap();

  mapForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const key = document.getElementById("key").value;
    const value = document.getElementById("value").value;
    const notes = document.getElementById("notes").value;
    chrome.storage.local.get("map", ({ map }) => {
      if (!map) {
        map = {};
      }
      map[key] = { value, notes };
      chrome.storage.local.set({ map }, () => {
        loadMap();
        mapForm.reset();
      });
    });
  });

  function loadMap() {
	searchChannels("");
  }

  function displayMap(map) {
    let outputText = "";
    for (const key in map) {
      const tooltip = map[key].notes
        ? `<span class="tooltiptext">${map[key].notes}</span>`
        : "";
      outputText += `<div class="tooltip">${key}: ${map[key].value}${tooltip}</div>\n`;
    }
    output.innerHTML = outputText;
  }
});

