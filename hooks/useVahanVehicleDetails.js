"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { decryptClientPayload } from "@/lib/decryptClient";

const useVahanVehicleDetails = (vehicleNumber) => {
  const [vehicleData, setVehicleData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!vehicleNumber) return;

    const fetchVehicleDetails = async () => {
      setLoading(true);
      setError(null);
      setVehicleData(null);

      try {
        const response = await axios.post("/api/vehicledetails", {
          vehicleNumber,
        });

        const data = response.data?.enc
          ? await decryptClientPayload(response.data)
          : response.data;

        setVehicleData(data);
      } catch (err) {
        const message =
          err.response?.data?.error ||
          err.message ||
          "Failed to fetch vehicle details";
        setError(
          typeof message === "string" ? message : JSON.stringify(message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [vehicleNumber]);

  return { vehicleData, error, loading };
};

export default useVahanVehicleDetails;
