import axios, { AxiosError } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// -------------------------------------------------------
// Axios instance
// -------------------------------------------------------
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// -------------------------------------------------------
// Request: attach access token from localStorage (client only)
// -------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------------------------------
// Refresh logic
// -------------------------------------------------------
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// -------------------------------------------------------
// Response: auto-refresh on 401
// -------------------------------------------------------
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = await api.post("/auth/refresh");
        const newToken = refresh.data?.access_token;

        if (newToken) {
          if (typeof window !== "undefined") {
            localStorage.setItem("token", newToken);
          }
          api.defaults.headers.Authorization = `Bearer ${newToken}`;
        }

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshErr: any) {
        processQueue(refreshErr, null);

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/login"; // <--- UNIVERSAL REDIRECT
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// -------------------------------------------------------
// API Helpers
// -------------------------------------------------------
export const courseApi = {
  listCourses() {
    return api.get("/courses").then((r) => r.data);
  },
};

export const ebookApi = {
  listEbooks() {
    return api.get("/ebooks").then((r) => r.data);
  },
};

export const blogpostApi = {
  listBlogposts() {
    return api.get("/blogposts").then((r) => r.data);
  },
};
