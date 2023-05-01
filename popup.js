document.addEventListener("DOMContentLoaded", () => {
  const channelNameDiv = document.getElementById("channel-name");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    if (url.includes("twitch.tv") && url.split("/").length == 4) {
      const channelName = url.split("/")[3].split("?")[0];
      channelNameDiv.innerHTML = channelName;

      chrome.storage.local.get("map", ({ map }) => {
        if (map && map.hasOwnProperty(channelName)) {
          const selectedValue = map[channelName].value;
          const valueRadios = document.querySelectorAll('input[name="value"]');
          for (let i = 0; i < valueRadios.length; i++) {
            if (valueRadios[i].value == selectedValue) {
              valueRadios[i].checked = true;
              break;
            }
          }
		  const notesInput = document.getElementById("notes");
		  if (map[channelName].hasOwnProperty("notes")) {
		    notesInput.value = map[channelName].notes;
		  }
          const submitButton = document.querySelector('button[type="submit"]');
          submitButton.innerHTML = "Update Channel";
        }
      });

    } else {
      channelNameDiv.innerHTML = "Not a valid Twitch channel URL.";
    }
  });

  const channelForm = document.getElementById("channel-form");
  channelForm.addEventListener("submit", (e) => {
    e.preventDefault();

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      if (url.includes("twitch.tv") && url.split("/").length == 4) {
        const channelName = url.split("/")[3].split("?")[0];
        const selectedValue = document.querySelector('input[name="value"]:checked').value;
		const notes = document.querySelector('#notes').value;
        chrome.storage.local.get("map", ({ map }) => {
          if (!map) {
            map = {};
          }
          map[channelName] = { value: selectedValue, notes };
          chrome.storage.local.set({ map }, () => {
            const submitButton = document.querySelector('button[type="submit"]');
            submitButton.innerHTML = "Update Channel";
            alert("Channel added/updated successfully.");
          });
        });
      } else {
        alert("Not a valid Twitch channel URL.");
      }
    });
  });
});
