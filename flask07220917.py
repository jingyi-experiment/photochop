# app.py
from flask import Flask, request, jsonify
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
from skimage.metrics import structural_similarity as ssim

app = Flask(__name__)

def calculate_ssim(image1, image2):
    # Convert images to grayscale for SSIM calculation
    gray1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)

    # Calculate SSIM
    return ssim(gray1, gray2)

def get_image_description(images):
    themes = {
        "selfie": ["selfie", "groufie", "portrait"],
        "scenery": ["scenery", "landscape", "view", "mountain", "forest", "sky", "beach", "snow"],
        "food": ["food", "meal", "dish", "cuisine"],
        "pet": ["pet", "dog", "dogs", "puppy", "cat", "cats", "kitten", "rabbit", "rabbits", "squirrel"],
        "time": ["morning", "noon", "afternoon", "evening", "night"]
    }

    descriptions = []
    for img in images:
        img_desc = img.filename.lower()
        description = []

        # Check for themes
        for theme, keywords in themes.items():
            for keyword in keywords:
                if keyword in img_desc:
                    description.append(theme)
                    break
        
        # Check for time
        for time_keyword in themes["time"]:
            if time_keyword in img_desc:
                description.append(f"{time_keyword.capitalize()} time")

        # Add specific location if available
        location = img.info.get('location', None)
        if location:
            description.append(f"Location: {location}")

        descriptions.append(", ".join(description) if description else "Group of similar images")

    return descriptions

def find_best_picture(group):
    # Calculate SSIM scores with respect to the first image in the group
    img1_cv2 = cv2.cvtColor(np.array(group[0]), cv2.COLOR_RGB2BGR)
    ssim_scores = [calculate_ssim(img1_cv2, cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)) for img in group]

    # Select the image with the highest SSIM score as the best picture
    best_picture_idx = np.argmax(ssim_scores)
    return group[best_picture_idx]

@app.route('/api/compare', methods=['POST'])
def compare_images():
    uploaded_files = request.files.getlist('images')
    uploaded_images = [Image.open(BytesIO(file.read())) for file in uploaded_files]

    similar_groups = []
    for i, img1 in enumerate(uploaded_images):
        group = [img1]
        for j, img2 in enumerate(uploaded_images):
            if i != j:
                img1_cv2 = cv2.cvtColor(np.array(img1), cv2.COLOR_RGB2BGR)
                img2_cv2 = cv2.cvtColor(np.array(img2), cv2.COLOR_RGB2BGR)

                ssim_score = calculate_ssim(img1_cv2, img2_cv2)
                if ssim_score > 0.95:  # Adjust the threshold as needed
                    if img2 not in group:
                        group.append(img2)

        if len(group) > 1:
            similar_groups.append(group)

    similar_info = []
    descriptions = get_image_description(uploaded_files)
    for group, description in zip(similar_groups, descriptions):
        similar_urls = [image.filename for image in group]
        best_picture = find_best_picture(group)
        best_picture_url = best_picture.filename if best_picture else None

        group_info = {"description": description, "images": similar_urls, "bestPictureUrl": best_picture_url}
        similar_info.append(group_info)

    return jsonify({"similarGroups": similar_info})

@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=False)
