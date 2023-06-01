// Function to darken a color by a given percentage
function darkenColor(color, percentage) {
	const hex = color.replace("#", "");
	const num = parseInt(hex, 16);
	const amt = Math.round(2.55 * percentage);
	const result = (num - amt).toString(16).padStart(6, "0");
	return `#${result}`;
}

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

	if (language === "javascript" || language === "js") {
		fileExtension = ".js";
	} else if (language === "html") {
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
	createButton.style.fontWeight = "300";
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
		createButton.style.fontWeight = "300";
	});

	// Insert the "Create File" button after the programming language span
	container.insertBefore(createButton, languageSpan.nextSibling);
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

// Function to submit conversation parts
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






// Function to create the "Submit File" button and progress bar
function createSubmitFileButton() {
	const parentContainer = document.querySelector(".absolute.bottom-0");
	// const parentContainer = document.querySelector("");

	if (!parentContainer) {
		console.error("Parent container not found.");
		return;
	}

	const container = parentContainer.querySelector("#prompt-textarea");

	if (!container) {
		console.error("Container not found.");
		return;
	}
	// Create the "Submit File" button
	const submitButton = document.createElement("button");
	submitButton.textContent = "Upload File";
	submitButton.id = "upload-btn";
	submitButton.style.padding = "2px 10px";
	submitButton.style.border = "1px solid white";
	submitButton.style.borderRadius = "20px";
	submitButton.style.color = "#fff";
	submitButton.style.backgroundColor = "#4d0404";
	submitButton.style.fontWeight = "300";
	submitButton.style.margin = "auto";
	submitButton.style.display = "flex";

	// Create the progress bar element
	const progressBar = document.createElement("div");
	progressBar.id = "progress-bar";
	progressBar.style.width = "65%";
	progressBar.style.height = "9px";
	progressBar.style.margin = "5px auto";
	progressBar.style.padding = "5px";
	
	
	progressBar.style.backgroundColor = "grey";

	// Create the progress element inside the progress bar
	const progressElement = document.createElement("div");
	progressElement.id = "progress-element";
	progressElement.style.width = "0%";
	progressElement.style.height = "100%";
	progressElement.style.backgroundColor = "orange";
	progressBar.appendChild(progressElement);

	// Insert the elements within the parent of the container
	// parentContainer.append(progressBar);
	// parentContainer.append(submitButton);
	parentContainer.prepend(progressBar);
	parentContainer.prepend(submitButton);


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
						await new Promise((resolve) => setTimeout(resolve, 10));
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

	// HOVER - Apply hover effect
	submitButton.addEventListener("mouseover", () => {
		submitButton.style.backgroundColor = darkenColor("#4d0404", 1.05);
		submitButton.style.transform = "scale(1.05)";
		submitButton.style.fontWeight = "600";
	});

	// MOUSEOUT - Revert to original style
	submitButton.addEventListener("mouseout", () => {
		submitButton.style.backgroundColor = "#4d0404";
		submitButton.style.transform = "scale(1)";
		submitButton.style.fontWeight = "300";
	});
}
setTimeout(createSubmitFileButton, 10);