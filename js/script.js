// Global variable to store the uploaded image files
let uploadedImages = [];

// Function to handle file selection and display uploaded images
function handleFileSelect(event) {
  uploadedImages = Array.from(event.target.files);
  const uploadedImagesContainer = document.getElementById("uploadedImages");
  uploadedImagesContainer.innerHTML = "";

  // Display the selected images
  for (const file of uploadedImages) {
    const imageElement = document.createElement("img");
    imageElement.src = URL.createObjectURL(file);
    imageElement.alt = file.name;
    uploadedImagesContainer.appendChild(imageElement);
  }
}

// Function to submit the images for processing
async function submitImages() {
  if (uploadedImages.length === 0) {
    alert("Please select at least one image before submitting.");
    return;
  }

  // Show progress section and update progress status
  const progressSection = document.querySelector(".progress-section");
  progressSection.style.display = "block";
  const progressBar = document.getElementById("progressBar");
  const progressStatus = document.getElementById("progressStatus");

  try {
    // Disable the submit button during processing
    const submitButton = document.querySelector(".submit-section button");
    submitButton.disabled = true;

    // Simulate image processing (replace this with actual processing logic)
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      progressBar.value = progress;
      progressStatus.textContent = `${progress}%`;

      if (progress === 100) {
        clearInterval(interval);
        // Re-enable the submit button
        submitButton.disabled = false;
        // Hide progress section after processing is complete
        progressSection.style.display = "none";
        // Call function to display the result
        displayResult();
      }
    }, 500); // Simulate progress for every 500ms (adjust this based on actual processing time)
  } catch (error) {
    console.error("Error during image processing:", error);
    alert("Error during image processing. Please try again later.");
    // Re-enable the submit button
    const submitButton = document.querySelector(".submit-section button");
    submitButton.disabled = false;
    // Hide progress section on error
    progressSection.style.display = "none";
  }
}

// Function to display the result
async function displayResult() {
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = ""; // Clear previous result

  // Make an API call to your Flask backend to get the result data
  try {
    const response = await fetch("/api/get_result"); // Replace with the actual API endpoint
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const resultData = await response.json();

    // Process the result data and display it in the result section
    for (const item of resultData) {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");
      resultItem.textContent = `${item.group} - ${item.description}`;
      resultContainer.appendChild(resultItem);
    }
  } catch (error) {
    console.error("Error fetching or processing the result data:", error);
    resultContainer.innerHTML = "Error retrieving result data. Please try again later.";
  }
}

// Event listener for file input change
const fileInput = document.getElementById("imageInput");
fileInput.addEventListener("change", handleFileSelect);
