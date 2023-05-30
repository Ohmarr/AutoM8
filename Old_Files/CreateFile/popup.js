document.addEventListener("DOMContentLoaded", function () {
  const createFileBtn = document.getElementById("create-file-btn");

  createFileBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "createFile" });
    });
  });
});
