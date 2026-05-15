import axios from "axios";
import getBaseURL from "./ApiConfig";


const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accesstoken");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


const refreshApi = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});


axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

   
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await refreshApi.post("/user/refresh-token");

        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token received");
        }

        localStorage.setItem("accesstoken", newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);

      } catch (err) {
        console.log("Refresh failed → logout user");

        localStorage.removeItem("accesstoken");

        window.location.href = "/";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;