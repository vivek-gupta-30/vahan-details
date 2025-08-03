// src/VehicleDetails.js
import React, { useEffect, useState, useRef } from "react";
import jwtAxios, { setAuthToken } from "../Hooks/jwtAxios";
import useVahanVehicleDetails from "../Hooks/useVahanVehicleDetails";

const VehicleDetails = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [showMore, setShowMore] = useState(false);
  const watermarkRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Auto-login logic
        const email = "dev@gmail.com";
        const password = "dev123";
        const loginRes = await jwtAxios.post("auth/accessToken"
          , {
          email,
          password,
        }
        );

        console.log(loginRes.data);

        localStorage.setItem("token", loginRes.data.accessToken);
        setAuthToken(loginRes.data.accessToken);
      } catch (error) {
        console.error("Error during auto-login or fetching data:", error);
      }
    };

    fetchData();
  }, []);

    const signzyID = "PAYTMSZY";
    const { vehicleData, error, loading } = useVahanVehicleDetails(
      vehicleNumber,
      signzyID
    );
  
    console.log(vehicleData, "jekcm");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setVehicleNumber(vehicleNumber);
    };

  // Watermark creation function
  const createWatermarkPattern = (container, text) => {
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing watermarks
    
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Calculate how many rows and columns we need
    const watermarkHeight = 30; // Height spacing
    const watermarkWidth = 120; // Width spacing
    
    const rows = Math.ceil(containerHeight / watermarkHeight) * 3; // Multiply for better coverage
    const cols = Math.ceil(containerWidth / watermarkWidth) * 3; // Multiply for better coverage
    
    // Create a grid of watermark text
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const span = document.createElement('span');
        span.innerText = text;
        
        const leftPos = (j * watermarkWidth) - containerWidth / 2;
        const topPos = (i * watermarkHeight) - containerHeight / 2;
        
        span.style.left = `${leftPos}px`;
        span.style.top = `${topPos}px`;
        
        container.appendChild(span);
      }
    }
  };

  // Create or update watermark when vehicle data changes or component mounts
  useEffect(() => {
    if (vehicleData && watermarkRef.current) {
      createWatermarkPattern(watermarkRef.current, "VIVEK GUPTA");
    }
  }, [vehicleData]);

  // Recreate watermark on window resize
  useEffect(() => {
    const handleResize = () => {
      if (vehicleData && watermarkRef.current) {
        createWatermarkPattern(watermarkRef.current, "VIVEK GUPTA");
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [vehicleData]);



  const handleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <div className="vehicle-container">
      <h1>Vehicle Info Checker</h1>
      <form onSubmit={handleSubmit} className="vehicle-form">
        <input
          type="text"
          placeholder="Enter Vehicle Number"
          value={vehicleNumber.toUpperCase()}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="loading-text">Fetching vehicle details...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {vehicleData && (
        <div className="vehicle-card">
          {/* Watermark container */}
          <div className="watermark-text" ref={watermarkRef}></div>
          
          <h2>{vehicleData?.result?.regNo}</h2>
          <div className="vehicle-info">
            <p><strong>Owner:</strong> {vehicleData?.result?.owner}</p>
            <p><strong>Model:</strong> {vehicleData?.result?.model}</p>
            <p><strong>Color:</strong> {vehicleData?.result?.vehicleColour}</p>
            <p><strong>Type:</strong> {vehicleData?.result?.type}</p>
            <p><strong>Mobile No:</strong> {vehicleData?.result?.mobileNumber}</p>
            <p><strong>Address:</strong> {vehicleData?.result?.presentAddress}</p>
            <p><strong>Reg Date:</strong> {vehicleData?.result?.regDate}</p>
            <p><strong>Insurance Upto:</strong> {vehicleData?.result?.vehicleInsuranceUpto}</p>
          </div>

          {showMore && (
            <div className="vehicle-more-info">
              <pre className="json-data">{JSON.stringify(vehicleData.result, null, 2)}</pre>
            </div>
          )}

          <button className="toggle-btn" onClick={() => setShowMore(prev => !prev)}>
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;