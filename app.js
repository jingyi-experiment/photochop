// App.js
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [similarGroups, setSimilarGroups] = useState([]);

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (files.length > 10) {
      alert('Please select up to 10 images.');
      return;
    }

    const formData = new FormData();
    for (const image of files) {
      formData.append('images', image);
    }

    try {
      const response = await axios.post('/api/compare', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSimilarGroups(response.data.similarGroups);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div>
      <h1>Image Similarity Checker</h1>
      <input type="file" multiple onChange={handleImageUpload} />
      {similarGroups.length > 0 && (
        <div>
          <h2>{similarGroups.length} groups of similar pictures have been identified:</h2>
          {similarGroups.map((group, index) => (
            <div key={index}>
              <h3>Group {index + 1}</h3>
              <ul>
                {group.map((image, idx) => (
                  <li key={idx}>
                    <img src={image} alt={`Similar Image ${idx}`} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
