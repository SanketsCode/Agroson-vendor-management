// src/components/CameraCapture.js
import { useState } from "react";

const CameraCapture = ({ pickedImages, setPickedImages }) => {
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

  const handleCaptureImage = () => {
    const video = document.getElementById("camera-feed");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "captured-image.jpg", {
        type: "image/jpeg",
      });
      setPickedImages([...pickedImages, file]);
    }, "image/jpeg");
  };

  return (
    <div className="space-y-3">
      <video id="camera-feed" autoPlay style={{ display: "hidden" }}></video>
      <div className="btn-theme-5" onClick={handleCapture}>
        <span className="w-full">Use Camera</span>
      </div>

      <div onClick={handleCaptureImage} className="btn-theme-5">
        <span className="w-full">Capture Photo</span>
      </div>
    </div>
  );
};

export default CameraCapture;
