import React, { useState, useRef } from 'react';
import './App.css';

const YourComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [output, setOutput] = useState('');
  const canvasRef = useRef(null);

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
    const url =
      'https://test123cv.cognitiveservices.azure.com/computervision/imageanalysis:analyze?features=caption%2Cread&model-version=latest&language=en&api-version=2023-02-01-preview';

    const headers = {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': apiKey,
    };

    fetch(url, {
      method: 'POST',
      headers: headers,
      body: binaryData,
    })
      .then((response) => response.json())
      .then((data) => {
        const readResults = data.readResult.content.split('\n').join(', ');
        setOutput(readResults);
      })
      .catch((error) => {
        // Handle the error
      });
  };

  const handleCanvasDraw = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set up drawing properties (e.g., stroke color, line width, etc.)
    context.strokeStyle = 'red';
    context.lineWidth = 2;

    // Initialize variables for tracking drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (event) => {
      isDrawing = true;
      [lastX, lastY] = [event.offsetX, event.offsetY];
    };

    const draw = (event) => {
      if (!isDrawing) return;
      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(event.offsetX, event.offsetY);
      context.stroke();
      [lastX, lastY] = [event.offsetX, event.offsetY];
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    // Attach event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
  };

  const convertCanvasToImage = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) {
        sendImageBlob(blob);
      }
    }, 'image/jpeg');
  };
  
  const sendImageBlob = (blob) => {
    const apiKey = '2feb83a5368047aabd780a8fe9ab8375';
    const url =
      'https://test123cv.cognitiveservices.azure.com/computervision/imageanalysis:analyze?features=caption%2Cread&model-version=latest&language=en&api-version=2023-02-01-preview';
  
    const headers = {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': apiKey,
    };
  
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: blob,
    })
      .then((response) => response.json())
      .then((data) => {
        const readResults = data.readResult.content.split('\n').join(', ');
        setOutput(readResults);
      })
      .catch((error) => {
        // Handle the error
      });
  };
  
    return (
      <div className="container">
  <h1 className="heading">OCR App</h1>
  <p className="welcome-message">Welcome to the OCR App! Upload an image or draw on the canvas to perform OCR.</p>
      <div>
        <h1>Upload Image</h1>
        <input type="file" onChange={handleFileChange} />
        {previewUrl && <img src={previewUrl} alt="Preview" />}
        <button onClick={handleUpload}>Upload</button>
        <div>
          <h2>Output:</h2>
          <p>{output}</p>
        </div>
        <div>
          <h2>Draw on Canvas:</h2>
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            style={{ border: '1px solid black' }}
            onMouseDown={handleCanvasDraw}
          ></canvas>
          <button onClick={convertCanvasToImage}>Convert to Image</button>
          <div>
            <h2>Output:</h2>
            <output>{output}</output>
          </div>
        </div>
      </div>
      </div>
    );
  };
  
  export default YourComponent;
  
