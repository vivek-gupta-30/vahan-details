// // src/useVahanVehicleDetails.js
// import { useState, useEffect } from "react";
// import jwtAxios from "./jwtAxios";

// const useVahanVehicleDetails = (vehicleNumber, signzyID) => {
//   const [vehicleData, setVehicleData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchVehicleDetails = async () => {
//       setLoading(true);
//       try {
//         const response = await jwtAxios.post("api/vehicledetails", {
//           vehicleNumber,
//           signzyID,
//         });

//         setVehicleData(response.data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (vehicleNumber && signzyID) {
//       fetchVehicleDetails();
//     }
//   }, [vehicleNumber, signzyID]);

//   return { vehicleData, error, loading };
// };

// export default useVahanVehicleDetails;

// src/useVahanVehicleDetails.js
import { useState, useEffect } from "react";
import jwtAxios from "./jwtAxios";

const useVahanVehicleDetails = (regdNo, signzyID) => {
  const [vehicleData, setVehicleData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setLoading(true);
      try {
        const response = await jwtAxios.post("api/v1/cases/sendvehiclenumber", {
          regdNo,
          // signzyID,
        });

        console.log(response, "vahaan")
        setVehicleData(response.data.response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (regdNo) {
      fetchVehicleDetails();
    }
  }, [regdNo]);

  return { vehicleData, error, loading };
};

export default useVahanVehicleDetails;

