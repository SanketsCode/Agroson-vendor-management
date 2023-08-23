import { useState, useRef } from "react";
import Webcam from "react-webcam";

const CameraCapture = ({ pickedImages, setPickedImages }) => {
  const [facingMode, setFacingMode] = useState("environment"); // 'environment' for back camera, 'user' for front camera
  const webcamRef = useRef(null);

  const handleSwitchCamera = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "environment" ? "user" : "environment"
    );
  };

  const handleCaptureImage = () => {
    const capturedImage = webcamRef.current.getScreenshot();
    if (capturedImage) {
      const blob = dataURItoBlob(capturedImage);
      const file = new File([blob], "captured-image.jpg", {
        type: "image/jpeg",
      });
      setPickedImages([...pickedImages, file]);
    }
  };

  // Helper function to convert data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="space-y-3">
      <Webcam
        id="camera-feed"
        audio={false}
        mirrored={facingMode === "user"} // Mirror the image for front camera
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: facingMode,
        }}
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
