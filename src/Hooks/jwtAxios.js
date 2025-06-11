// src/jwtAxios.js
import axios from "axios";

const randomKey = Math.random().toString(36).substring(2);
// https://instavaluermainapi.instavaluer.com/api/v1/cases/sendvehiclenumber
const jwtAxios = axios.create({
  // baseURL: "https://smartinspectai.justthinktech.in/smartinspectionai/v1/",
  baseURL: "https://smartinspect-api-bhdeb4ebgjhwgbd5.centralindia-01.azurewebsites.net/smartinspectionai/v1/",
  // baseURL: "https://instavaluerapi.salontreat.com/", // old url
  // baseURL: "https://instavaluermainapi.instavaluer.com", // engine no. hide
  headers: {
    "Content-Type": "application/json",
    'apikey': randomKey,
    apikey: "c747b51cc1b18e6e9f4fdd72d6ada6c8",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    jwtAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete jwtAxios.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
};

export default jwtAxios;
