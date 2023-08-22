// src/components/CameraCapture.js
import { useState } from "react";

const CameraCapture = ({ pickedImages, setPickedImages }) => {
  const [facingMode, setFacingMode] = useState("environment"); // 'environment' for back camera, 'user' for front camera

  const handleSwitchCamera = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "environment" ? "user" : "environment"
    );
  };

  const handleCapture = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia is not supported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.getElementById("camera-feed");
      video.srcObject = stream;
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const handleCaptureImage = async () => {
    try {
      const constraints = {
        video: {
          facingMode, // Use the currently selected facing mode
          width: { ideal: 1280 }, // Set preferred width if needed
          height: { ideal: 720 }, // Set preferred height if needed
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = document.getElementById("camera-feed");
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play();
      };

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], "captured-image.jpg", {
          type: "image/jpeg",
        });
        setPickedImages([...pickedImages, file]);

        // Stop the camera stream
        stream.getTracks().forEach((track) => track.stop());
      }, "image/jpeg");
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  return (
    <div className="space-y-3">
      <video id="camera-feed" autoPlay style={{ display: "block" }}></video>
      <div onClick={handleSwitchCamera} className="btn-theme-5 w-full">
        <span className="w-full">Switch Camera</span>
      </div>
      <div className="flex flex-row gap-5">
        <div className="btn-theme-5 w-full" onClick={handleCapture}>
          <span className="w-full">कॅमेरा चालू करा</span>
        </div>

        <div onClick={handleCaptureImage} className="btn-theme-5 w-full">
          <span className="w-full">फोटो कॅप्चर करा</span>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
