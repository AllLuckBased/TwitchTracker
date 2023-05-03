document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("search-btn");

  searchBtn.addEventListener("click", () => {
    const searchTerm = searchInput.value;
    searchChannels(searchTerm);
  });

  const sortBtn = document.getElementById("sort-btn");
  const sortMethod = document.getElementById("sort-method");

  sortBtn.addEventListener("click", () => {
    const selectedMethod = sortMethod.value;
    if (selectedMethod === "last-updated") {
      sortByLastUpdated();
    } else if (selectedMethod === "familiarity") {
      sortByFamiliarity();
    }
  });

  function sortByLastUpdated() {
    chrome.storage.local.get("map", ({ map }) => {
      if (map) {
        const sortedMap = Object.entries(map)
          .sort(([, a], [, b]) => new Date(b.updated) - new Date(a.updated))
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        displayMap(sortedMap);
      }
    });
  }

  function sortByFamiliarity() {
    chrome.storage.local.get("map", ({ map }) => {
      if (map) {
        const sortedMap = Object.entries(map)
          .sort(([, a], [, b]) => b.value - a.value)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        displayMap(sortedMap);
      }
    });
  }
  
  function sortMapDescending(map) {
    const sortedKeys = Object.keys(map).sort((a, b) => {
      return map[b].value.localeCompare(map[a].value);
    });
  
    const sortedMap = {};
    for (const key of sortedKeys) {
      sortedMap[key] = map[key];
    }
  
    return sortedMap;
  }
  

  function searchChannels(searchTerm) {
    chrome.storage.local.get("map", ({ map }) => {
      if (map) {
        const filteredMap = {};
        for (const key in map) {
          if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
            filteredMap[key] = map[key];
          }
        }
        const sortedMap = sortMapDescending(filteredMap);
        displayMap(sortedMap);
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
    const tooltip = document.getElementById("tooltip");
  
    for (const key in map) {
      if(map[key].follow) continue
      outputText += `<div class="tooltip" data-notes="${map[key].notes || ""} LU: ${map[key].updated}"><a href="#" class="channel-link" data-url="https://twitch.tv/${key}">${key}: ${map[key].value}</a></div>\n`;
    }
  
    output.innerHTML = outputText;
  
    const tooltipItems = output.querySelectorAll(".tooltip");
    const channelLinks = output.querySelectorAll(".channel-link");
  
    tooltipItems.forEach(item => {
      item.addEventListener("mouseover", () => {
        const notes = item.getAttribute("data-notes");
        if (notes) {
          tooltip.innerHTML = notes;
          tooltip.style.visibility = "visible";
          tooltip.style.opacity = 1;
          tooltip.style.left = item.getBoundingClientRect().left + "px";
          tooltip.style.top = (item.getBoundingClientRect().top + window.pageYOffset - tooltip.offsetHeight - 10) + "px";
        }
      });
      item.addEventListener("mouseout", () => {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = 0;
      });
    });
  
    channelLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const url = link.getAttribute("data-url");
        chrome.tabs.create({ url });
      });
    });
  }
});

