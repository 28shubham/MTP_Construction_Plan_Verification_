//-----------------------------------------------------

import React, { useState, useEffect } from "react";
import "./VerificationForm.css";
import Navbar from "./components/Navbar";
import axios from "axios";
import "./VerificationImage.css";

function VerificationImage() {
  const [formData, setFormData] = useState({
    residentialType: "",
    file: null,
  });
  const [latestImage, setLatestImage] = useState(null);
  const [notification, setNotification] = useState("");
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const residentialTypeOptions = {
    Residential: "Residential Plots or Villas",
    "Residential Independent": "Residential Independent",
    Group: "Group Housing",
    Studio: "Studio Apartment",
    Farm: "Farm House",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  useEffect(() => {
    getLatestPdf();
  }, []);

  const getLatestPdf = async () => {
    try {
      const result = await axios.get("http://localhost:8080/get-files");
      const images = result.data?.data || [];
      if (images.length > 0) {
        const latestFile = images[images.length - 1];
        setLatestImage(latestFile);
        setPdfPreviewUrl(`http://localhost:8080/files/${latestFile.pdf}`);
      } else {
        setLatestImage(null);
        setPdfPreviewUrl(null);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.residentialType) {
      alert("Please select a file and choose a residential type.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.residentialType);
    data.append("file", formData.file);

    try {
      const result = await axios.post(
        "http://localhost:8080/upload-files",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (result.data.status === "ok") {
        setNotification("File uploaded successfully!");
        setTimeout(() => setNotification(""), 3000);

        setPdfPreviewUrl(`http://localhost:8080/files/${result.data.filePath}`);
        setLatestImage({
          title: formData.residentialType,
          pdf: result.data.filePath,
        });

        setFormData({ residentialType: "", file: null });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setNotification("Failed to upload file. Please try again.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleVerify = async () => {
    if (!latestImage || !latestImage.pdf) {
      alert("No file available for verification.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/files/${latestImage.pdf}`,
        { responseType: "blob" }
      );

      const file = new File([response.data], "latest-construction-plan.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("file", file);

      const verificationResponse = await axios.post(
        "http://127.0.0.1:5000/verify-pdf",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setVerificationResult(verificationResponse.data);
      setIsModalOpen(true); // Open the modal after verification
    } catch (error) {
      console.error("Error verifying file:", error);
      setNotification("Verification failed. Please try again.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  return (
    <div className="my">
      <div className="mynew">
        <Navbar />
      </div>
      <div className="verification-form-container">
        <h2>Construction Plan Verification using PDF</h2>

        {notification && (
          <div className="notification">
            <p>{notification}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="verification-form">
          <label>
            1. Upload Construction Plan for Verification (PDF Only)
            <input
              type="file"
              name="file"
              required
              accept=".pdf"
              onChange={handleFileChange}
            />
          </label>

          <label>
            2. Residential:
            <select
              name="residentialType"
              value={formData.residentialType}
              required
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              {Object.entries(residentialTypeOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>

        <div className="showpdf">
          <h4>Uploaded PDF:</h4>
          <div className="output-div">
            {pdfPreviewUrl ? (
              <div className="inner-div">
                <h6>
                  {latestImage?.title
                    ? residentialTypeOptions[latestImage.title] ||
                      latestImage.title
                    : "Uploaded PDF"}
                </h6>
                <iframe
                  src={pdfPreviewUrl}
                  width="50%"
                  height="250px"
                  title="PDF Preview"
                  style={{
                    border: "1px solid #ccc",
                    marginTop: "10px",
                  }}
                ></iframe>
              </div>
            ) : (
              <p>No files uploaded yet.</p>
            )}
          </div>
        </div>

        <button onClick={handleVerify} id="verify-button">
          Verify
        </button>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Verification Result</h3>
              <div className="verification-result-container">
                {verificationResult &&
                  verificationResult.map((item, index) => (
                    <div key={index} className="verification-item">
                      <h4>{item.space}</h4>
                      <p>
                        <strong>Area:</strong> {item.area}
                      </p>
                      <p>
                        <strong>Length:</strong> {item.length}
                      </p>
                      <p>
                        <strong>Width:</strong> {item.width}
                      </p>
                      <p>
                        <strong>Status:</strong> {item.status}
                      </p>
                      <p>
                        <strong>Coordinates:</strong>
                      </p>
                      <ul>
                        <li>X0: {item.coordinates.x0}</li>
                        <li>X1: {item.coordinates.x1}</li>
                        <li>Y0: {item.coordinates.y0}</li>
                        <li>Y1: {item.coordinates.y1}</li>
                      </ul>
                    </div>
                  ))}
              </div>
              <button onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerificationImage;
