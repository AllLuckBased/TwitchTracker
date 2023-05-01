chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "checkChannel") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      if (url.includes("twitch.tv")) {
        const channelName = url.split("/")[3].split("?")[0];
        chrome.storage.local.get("map", ({ map }) => {
          if (map && map.hasOwnProperty(channelName)) {
            sendResponse({ isVisited: true, name: channelName, notes: map[channelName].notes });
          } else {
            sendResponse({ isVisited: false });
          }
        });
      } else {
        sendResponse({ isVisited: false });
      }
    });

    return true; // Indicate that the response will be sent asynchronously
  }
});
