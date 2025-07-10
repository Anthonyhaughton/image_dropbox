import { useState } from 'react';
import './App.css';

// Paste the API Gateway URL from your CDK output here
const API_ENDPOINT = "https://dgzgjcufr9.execute-api.us-east-1.amazonaws.com/prod/";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setStatusMessage(""); // Clear previous messages
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setStatusMessage("Uploading...");

    // Use FileReader to convert the file to a Base64 string
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = async () => {
      // The result includes a prefix like "data:image/jpeg;base64,", so we split it off
      const base64String = reader.result?.toString().split(',')[1];
      
      if (!base64String) {
        setStatusMessage("Error: Could not read file.");
        return;
      }

      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            "Content-Type": "text/plain", // Matches our backend expectation
          },
          body: base64String,
        });

        const data = await response.json();

        if (response.ok) {
          setStatusMessage(`Success! File uploaded as: ${data.fileName}`);
        } else {
          setStatusMessage(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Upload error:", error);
        setStatusMessage("Error: Failed to upload file.");
      }
    };

    reader.onerror = () => {
      console.error("File reading error");
      setStatusMessage("Error: Could not read file.");
    };
  };

  return (
    <>
      <h1>Image Dropbox</h1>
      <p>Select an image to upload to your S3 bucket.</p>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload Image
      </button>

      {/* Display status messages to the user */}
      {statusMessage && <p>{statusMessage}</p>}
    </>
  );
}

export default App;