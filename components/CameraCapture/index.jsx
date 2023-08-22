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

  const handleCaptureImage = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment", // Use 'environment' for the back camera
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
      <video id="camera-feed" autoPlay style={{ display: "hidden" }}></video>
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
