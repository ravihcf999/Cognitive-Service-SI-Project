import React, { useState } from 'react';

const YourComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [output, setOutput] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!selectedFile) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const binaryData = new Uint8Array(reader.result);
      sendImageData(binaryData);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const sendImageData = (binaryData) => {
    const apiKey = '2feb83a5368047aabd780a8fe9ab8375';
    const url = 'https://test123cv.cognitiveservices.azure.com/computervision/imageanalysis:analyze?features=caption%2Cread&model-version=latest&language=en&api-version=2023-02-01-preview';

    const headers = {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': apiKey
    };

    fetch(url, {
      method: 'POST',
      headers: headers,
      body: binaryData
    })
      .then(response => response.json())
      .then(data => {
        const readResults = data.readResult.content.split('\n').join(', ');
        setOutput(readResults);
      })
      .catch(error => {
        // Handle the error
      });
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <input type="file" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" />}
      <button onClick={handleUpload}>Upload</button>
      <div>
        <h2>Output:</h2>
        <p>{output}</p>
      </div>
    </div>
  );
};

export default YourComponent;
