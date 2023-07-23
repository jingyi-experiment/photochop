function uploadImages() {
    // ... (same as previous code)

    // Store the selected files in a global variable for later use
    window.uploadedFiles = imageInput.files;
}

async function submitImages() {
    const progressBar = document.getElementById("progressBar");
    const progressStatus = document.getElementById("progressStatus");

    // Simulate Progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.value = progress;
        progressStatus.textContent = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            progressStatus.textContent = "Processing completed!";
            // Call function to display the result after processing is complete
            displayResult();
        }
    }, 1000);
}

async function displayResult() {
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = ""; // Clear previous result

    // Replace the following with actual API call to your Flask backend to get the results
    // For illustration purposes, we're using a dummy result
    const dummyResult = [
        { group: "Group 1", description: "Scenery: Mountain view in the afternoon" },
        { group: "Group 2", description: "Selfie: Couple selfie in the park" },
        // Add more result items as needed
    ];

    for (const item of dummyResult) {
        const resultItem = document.createElement("div");
        resultItem.classList.add("result-item");
        resultItem.textContent = `${item.group} - ${item.description}`;
        resultContainer.appendChild(resultItem);
    }
}
