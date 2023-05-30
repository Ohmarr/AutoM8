// Create the button element
const button = document.createElement('button');
button.innerText = 'Submit File';
button.style.backgroundColor = 'green';
button.style.color = 'white';
button.style.padding = '5px';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.margin = '5px';

// Create the progress element
const progress = document.createElement('progress');
progress.style.width = '99%';
progress.style.height = '5px';
progress.style.backgroundColor = 'grey';

// Create the progress bar within the progress element
const progressBar = document.createElement('div');
progressBar.style.width = '0%';
progressBar.style.height = '100%';
progressBar.style.backgroundColor = 'blue';

// Append the progress bar to the progress element
progress.appendChild(progressBar);

// Find the target element with class 'flex.flex-col.w-full.py-2.flex-grow.md:py-3.md:pl-4'
const targetElement = document.querySelector('.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4');

// Insert the button and progress element before the target element
targetElement.parentNode.insertBefore(button, targetElement);
targetElement.parentNode.insertBefore(progress, targetElement);

// Button click event handler
button.addEventListener('click', async () => {
  // Create the file input element
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt, .js, .py, .html, .css, .json, .csv';

  // File selected event handler
  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const filename = file.name;
    const reader = new FileReader();

    // Read file as text
    reader.readAsText(file);

    // Split the file text into chunks of size 15000
    const CHUNK_SIZE = 15000;
    let chunks = [];
    let text = '';
    let part = 1;

    reader.onload = async () => {
      text = reader.result;
      const numChunks = Math.ceil(text.length / CHUNK_SIZE);

      for (let i = 0; i < numChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = start + CHUNK_SIZE;
        const chunk = text.slice(start, end);
        
        await submitConversation(chunk, part, filename);
        part++;

        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
      }

      progressBar.style.backgroundColor = 'blue';
    };
  });

  // Trigger the file input click event
  fileInput.click();
});

// Function to submit conversation chunk
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[tabindex='0']");
  const enterKeyEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });

  textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
  textarea.dispatchEvent(enterKeyEvent);

  // Check if chatgpt is ready
  let chatgptReady = false;
  while (!chatgptReady) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    chatgptReady = !document.querySelector('.text-2xl > span:not(.invisible)');
  }
}
