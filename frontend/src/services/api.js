import axios from "axios";

const API = axios.create({
  baseURL: "https://inventory-asset-management-system-wsk7-gyiaeygtw.vercel.app/api",
});

export default API;