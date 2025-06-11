// src/useVahanVehicleDetails.js
import { useState, useEffect } from "react";
import jwtAxios from "./jwtAxios";

const useVahanVehicleDetails = (vehicleNumber, signzyID) => {
  const [vehicleData, setVehicleData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!vehicleNumber || !signzyID) return;

    const fetchVehicleDetails = async () => {
      setLoading(true);
      try {
        const response = await jwtAxios.post("api/vehicledetails", {
          vehicleNumber,
          signzyID,
        });

        setVehicleData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchVehicleDetails();
    }, 4000); // 4 seconds

    // Cleanup the timer if component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [vehicleNumber, signzyID]);

  return { vehicleData, error, loading };
};

export default useVahanVehicleDetails;

///////////////////// If i used this baseUrl, then uncomment the below lines ///////////////////////
// baseURL: "https://instavaluerapi.salontreat.com/", // old url
// baseURL: "https://instavaluermainapi.instavaluer.com", // engine no. hide

// // src/useVahanVehicleDetails.js
// import { useState, useEffect } from "react";
// import jwtAxios from "./jwtAxios";

// const useVahanVehicleDetails = (regdNo, signzyID) => {
//   const [vehicleData, setVehicleData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!regdNo) return;

//     const delayDebounce = setTimeout(() => {
//       const fetchVehicleDetails = async () => {
//         setLoading(true);
//         try {
//           const response = await jwtAxios.post("api/v1/cases/sendvehiclenumber", {
//             regdNo,
//             // signzyID,
//           });

//           console.log(response, "vahaan")
//           setVehicleData(response.data.response);
//           setError(null);
//         } catch (error) {
//           setError(error.message);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchVehicleDetails();
//     }, 3000); // Delay of 3000ms

//     return () => clearTimeout(delayDebounce);
//   }, [regdNo]);

//   return { vehicleData, error, loading };

// };

// export default useVahanVehicleDetails;

