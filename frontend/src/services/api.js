import axios from "axios";

const API = axios.create({
  baseURL: "https://inventory-asset-manageme-git-f22ee7-kavyakunchaparthis-projects.vercel.app/api",
});

export default API;