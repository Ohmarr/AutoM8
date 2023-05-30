async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[tabindex='0']");
  const enterKeyEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
  textarea.dispatchEvent(enterKeyEvent);
}

function createSubmitFileButton() {
  const container = document.querySelector(".flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4");

  // Create the "Submit File" button
  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit File";
  submitButton.id = "upload-btn";
  submitButton.style.padding = "2px 10px";
  submitButton.style.border = "none";
  submitButton.style.borderRadius = "20px";
  submitButton.style.color = "#fff";
  submitButton.style.backgroundColor = "#4d0404";
  submitButton.style.fontWeight = "300";
  submitButton.style.marginRight = "200px";

  // Create the progress bar element
  const progressBar = document.createElement("div");
  progressBar.id = "Progress Bar";
  progressBar.style.width = "99%";
  progressBar.style.height = "5px";
  progressBar.style.backgroundColor = "grey";

  // Create the progress element inside the progress bar
  const progressElement = document.createElement("div");
  progressElement.style.width = "0%";
  progressElement.style.height = "100%";
  progressElement.style.backgroundColor = "orange";
  progressBar.appendChild(progressElement);

  // Append the elements to the container
  container.parentNode.insertBefore(progressBar, container);
  container.parentNode.insertBefore(submitButton, container);

  // Add event listener to the "Submit File" button
  submitButton.addEventListener("click", async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt, .js, .py, .html, .css, .json, .csv";

    fileInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = async function (e) {
        const text = e.target.result;
        const chunkSize = 15000;
        const numChunks = Math.ceil(text.length / chunkSize);
        let chatgptReady = false;

        for (let i = 0; i < numChunks; i++) {
          const start = i * chunkSize;
          const end = start + chunkSize;
          const chunk = text.substring(start, end);

          await submitConversation(chunk, i + 1, file.name);

          // Update the progress bar
          progressElement.style.width = `${((i + 1) / numChunks) * 100}%`;

          // Check if chatgpt is ready
          while (!chatgptReady) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
          }
        }

        // Turn the progress bar dark blue
        progressElement.style.backgroundColor = "darkblue";
      };

      reader.readAsText(file);
    });

    fileInput.click();
  });
}

createSubmitFileButton();
