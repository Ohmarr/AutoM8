chrome.tabs.onActivated.addListener(function(activeInfo) {
	chrome.tabs.executeScript(activeInfo.tabId, { file: "contentScript.js" });
  });
  