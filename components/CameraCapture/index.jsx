import { useState } from "react";
import Webcam from "react-webcam";

const CameraCapture = ({ pickedImages, setPickedImages }) => {
  const [facingMode, setFacingMode] = useState("environment");

  const handleSwitchCamera = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "environment" ? "user" : "environment"
    );
  };

  const handleCaptureImage = async () => {
    const constraints = {
      video: {
        facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };

    try {
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
      <Webcam
        id="camera-feed"
        audio={false}
        videoConstraints={{ facingMode }}
        style={{ display: "block" }}
      />

      <div onClick={handleSwitchCamera} className="btn-theme-5 w-full">
        <span className="w-full">Switch Camera</span>
      </div>
      <div className="flex flex-row gap-5">
        <div onClick={handleCaptureImage} className="btn-theme-5 w-full">
          <span className="w-full">Capture Photo</span>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
