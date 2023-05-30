// Function to create the "Create File" button
function createButton(container) {
  // Check if the container already has the button
  if (container.querySelector("#update-vscode-btn")) {
    return;
  }

  // Find the programming language span
  const languageSpan = container.querySelector("span");

  // Get the programming language
  const language = languageSpan.textContent.toLowerCase();

  // Determine the file extension based on the programming language
  let fileExtension = ".txt";

  if (language === "javascript") {
    fileExtension = ".js";
  } else if (language === "js") {
    fileExtension = ".js";
    else if (language === "html") {
    fileExtension = ".html";
  } else if (language === "css") {
    fileExtension = ".css";
  } else if (language === "python") {
    fileExtension = ".py";
  } else if (language === "json") {
    fileExtension = ".json";
  }

  // Find the "Copy code" button
  const copyButton = container.querySelector(".flex.ml-auto.gap-2");

  // Create the "Create File" button
  const createButton = document.createElement("button");
  createButton.textContent = "Create File";
  createButton.id = "update-vscode-btn";
  createButton.style.padding = "3px 15px";
  createButton.style.border = "1px solid white";
  createButton.style.borderRadius = "10px";
  createButton.style.color = "#fff";
  createButton.style.cursor = "pointer";
  createButton.style.backgroundColor = "#4d0404";
  createButton.style.fontWeight = "400";
  createButton.style.margin = "0px 10px";

  // Add event listeners to the "Create File" button
  // CLICK - COPY CODE
  createButton.addEventListener("click", () => {
    copyButton.click();

    // Get the copied code from the clipboard
    navigator.clipboard.readText().then((copiedCode) => {
      // Create a new file with the appropriate extension
      const blob = new Blob([copiedCode], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `file${fileExtension}`;
      a.click();
    });
  });

  // HOVER - Apply hover effect
  createButton.addEventListener("mouseover", () => {
    createButton.style.backgroundColor = darkenColor("#4d0404", 1.05);
    createButton.style.transform = "scale(1.05)";
    createButton.style.fontWeight = "600";
  });

  // MOUSEOUT - Revert to original style
  createButton.addEventListener("mouseout", () => {
    createButton.style.backgroundColor = "#4d0404";
    createButton.style.transform = "scale(1)";
    createButton.style.fontWeight = "400";
  });

  // Insert the "Create File" button after the programming language span
  container.insertBefore(createButton, languageSpan.nextSibling);
}

// Function to darken a color by a given percentage
function darkenColor(color, percentage) {
  const hex = color.replace("#", "");
  const num = parseInt(hex, 16);
  const amt = Math.round(2.55 * percentage);
  const result = (num - amt).toString(16).padStart(6, "0");
  return `#${result}`;
}

// Function to check for the "Create File" button every 3 seconds
function checkButtons() {
  const containers = document.querySelectorAll(".flex.items-center.relative.text-gray-200.bg-gray-800.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md");
  containers.forEach((container) => {
    createButton(container);
  });
}

// Check for the "Create File" button every 3 seconds
setInterval(checkButtons, 3000);

// Watch for new code containers using MutationObserver
const observer = new MutationObserver(checkButtons);
observer.observe(document.body, { childList: true, subtree: true });
