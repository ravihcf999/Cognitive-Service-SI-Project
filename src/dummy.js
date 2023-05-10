import React, { useState } from 'react';
import './App.css';

function FileInput({ onSelect }) {
  function handleFileInputChange(event) {
    onSelect(event.target.files[0]);
  }

  return (
    <div>
      <label htmlFor="fileInput">Select a file:</label>
      <input
        type="file"
        id="fileInput"
        onChange={handleFileInputChange}
      />
    </div>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  async function extractTextFromImage() {
    const endpoint = "https://test123cv.cognitiveservices.azure.com/";
    const apiKey = "2feb83a5368047aabd780a8fe9ab8375";

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${endpoint}/vision/v3.2/ocr?language=en&detectOrientation=true`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Content-Type": "application/octet-stream"
      },
      body: formData
    });

    const data = await response.json();

    setText(data.regions[0].lines.map((line) => line.words.map((word) => word.text).join(" ")).join("\n"));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>OCR App</h1>
        <p>Welcome to the OCR App. Upload an image file to extract text using OCR.</p>
        <FileInput onSelect={setFile} />
        <button onClick={extractTextFromImage}>Extract Text</button>
        <div className="output-box">{text}</div>
      </header>
    </div>
  );
}

export default App;

