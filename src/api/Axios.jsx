import axios from "axios";

// Crear el cliente Axios con la URL base de las variables de entorno
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});

axiosClient.defaults.headers.post["Accept"] = "application/vnd.api+json";
axiosClient.defaults.headers.post["Content-Type"] = "application/vnd.api+json";
axiosClient.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
axiosClient.defaults.headers.post["Access-Control-Allow-Headers"] = "*";

axiosClient.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("ACCESS_TOKEN");

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
 
}

return config;
},
(error) => {
return Promise.reject(error);
}
);

export default axiosClient;