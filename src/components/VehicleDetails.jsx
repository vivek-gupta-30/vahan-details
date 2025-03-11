// src/VehicleDetails.js
import React, { useEffect, useState } from "react";
// import jwtAxios, { setAuthToken } from "../Hooks/jwtAxios";
import useVahanVehicleDetails from "../Hooks/useVahanVehicleDetails";

const VehicleDetails = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [showMore, setShowMore] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Auto-login logic
  //       const email = "dev@gmail.com";
  //       const password = "dev123";
  //       const loginRes = await jwtAxios.post("auth/webuser/login", {
  //         email,
  //         password,
  //       });

  //       console.log(loginRes.data);

  //       localStorage.setItem("token", loginRes.data.accessToken);
  //       setAuthToken(loginRes.data.accessToken);
  //     } catch (error) {
  //       console.error("Error during auto-login or fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const signzyID = "PAYTMSZY";
  const { vehicleData, error, loading } = useVahanVehicleDetails(
    vehicleNumber,
    // signzyID
  );

  console.log(vehicleData, "jekcm");

  const handleSubmit = (e) => {
    e.preventDefault();
    setVehicleNumber(vehicleNumber);
  };

  const handleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <div>
      <h1>Vehicle Details</h1>
      <form onSubmit={handleSubmit}>
        <input
          style={{ padding: '10px'}}
          type="text"
          placeholder="Enter Vehicle Number"
          value={vehicleNumber.toUpperCase()}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />
        <button type="submit" style={{ margin: '10px', padding: '10px' }}>Submit</button>
      </form>
      {loading && <p>Loading...</p>}
      {/* {error && <p>Error: {error}</p>} */}
      {vehicleData && (
        <div style={{ margin: 'auto', marginTop: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', padding: '15px', borderRadius: '10px', backgroundColor: '#F1F3F4' }}>
          <h2>Vehicle Details</h2>
          <h4>Name : {vehicleData?.result?.owner}</h4>
          <h5>Mobile No. : {vehicleData?.result?.mobileNumber}</h5>
          <h5>Vehicle No. : {vehicleData?.result?.regNo}</h5>
          <h5>Model : {vehicleData?.result?.model}</h5>
          <p>Address. : {vehicleData?.result?.presentAddress}</p>
          <p>Reg Date. : {vehicleData?.result?.regDate}</p>
          <p>Vehicle Colour : {vehicleData?.result?.vehicleColour}</p>
          <p>Vehicle Type : {vehicleData?.result?.type}</p>
          <p>Insurance Upto : {vehicleData?.result?.vehicleInsuranceUpto}</p>
          <button onClick={handleShowMore}>
            {showMore ? "Show Less Details" : "Show More Details"}
          </button>

          {showMore && <pre>{JSON.stringify(vehicleData.result, null, 2)}</pre>}
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;
