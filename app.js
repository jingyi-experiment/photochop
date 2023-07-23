function uploadImages() {
    const imageInput = document.getElementById("imageInput");
    const uploadedImages = document.getElementById("uploadedImages");
    uploadedImages.innerHTML = ""; // Clear previous uploaded images

    for (const file of imageInput.files) {
        // Display Accepted Images
        if (file.type.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.width = 200;
            uploadedImages.appendChild(img);
        }
    }
}

function submitImages() {
    const imageInput = document.getElementById("imageInput");
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
        }
    }, 1000);
}
