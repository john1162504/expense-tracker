import axios from "axios";
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh")
        ) {
            originalRequest._retry = true;

            try {
                const res = await api.post("/auth/refresh");
                const newAccessToken = res.data.accessToken;

                api.defaults.headers.common["Authorization"] =
                    `Bearer ${newAccessToken}`;

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default api;
