// src/jwtAxios.js
import axios from "axios";

const randomKey = Math.random().toString(36).substring(2);

const jwtAxios = axios.create({
  // baseURL: "https://smartinspectai.justthinktech.in/smartinspectionai/v1/",
  baseURL: "https://instavaluerapi.salontreat.com/",
  headers: {
    "Content-Type": "application/json",
    'apikey': randomKey,
    // apikey: "c747b51cc1b18e6e9f4fdd72d6ada6c8",
  },
});

// export const setAuthToken = (token) => {
//   if (token) {
//     jwtAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
//     localStorage.setItem("token", token);
//   } else {
//     delete jwtAxios.defaults.headers.common.Authorization;
//     localStorage.removeItem("token");
//   }
// };

export default jwtAxios;
