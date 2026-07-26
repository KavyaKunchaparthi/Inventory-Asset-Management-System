import axios from "axios";

const API = axios.create({
  baseURL: "https://inventory-asset-management-system-w.vercel.app/api",
});

export default API;