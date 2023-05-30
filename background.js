// Handle the browser action button click event
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(tab.id, { file: "contentScript.js" });
});
