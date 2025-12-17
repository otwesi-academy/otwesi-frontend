// "use client"; // important: this file is client-only

// import axios, { AxiosError, AxiosRequestConfig } from "axios";
// import { useRouter } from "next/navigation";
// import { Course, Ebook, BlogPost } from "@/types/types";

// export const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// // -------------------------------------------------------
// // Axios instance
// // -------------------------------------------------------
// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true, // important for HTTP-only cookies
// });

// // -------------------------------------------------------
// // Type for queue
// // -------------------------------------------------------
// interface FailedQueueItem {
//   resolve: (value?: unknown) => void;
//   reject: (error: unknown) => void;
// }

// let isRefreshing = false;
// let failedQueue: FailedQueueItem[] = [];

// // -------------------------------------------------------
// const processQueue = (
//   error: AxiosError | null,
//   token: string | null = null
// ) => {
//   failedQueue.forEach(({ resolve, reject }) => {
//     if (error) reject(error);
//     else resolve(token);
//   });
//   failedQueue = [];
// };

// // -------------------------------------------------------
// // Response interceptor: auto-refresh on 401
// // -------------------------------------------------------
// export const setupInterceptors = (router: ReturnType<typeof useRouter>) => {
//   api.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError) => {
//       const originalRequest = error.config as AxiosRequestConfig & {
//         _retry?: boolean;
//       };

//       // Only handle 401 errors for requests other than refresh endpoint
//       if (
//         error.response?.status === 401 &&
//         !originalRequest._retry &&
//         !originalRequest.url?.includes("/users/auth/refresh")
//       ) {
//         if (isRefreshing) {
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject });
//           })
//             .then(() => api(originalRequest))
//             .catch((err) => Promise.reject(err));
//         }

//         originalRequest._retry = true;
//         isRefreshing = true;

//         try {
//           const refreshRes = await api.post("/users/auth/refresh"); // backend must read refresh cookie
//           const newAccessToken = refreshRes.data?.access_token;

//           if (!newAccessToken)
//             throw new Error("No access token returned during refresh");

//           api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
//           originalRequest.headers = {
//             ...originalRequest.headers,
//             Authorization: `Bearer ${newAccessToken}`,
//           };

//           processQueue(null, newAccessToken);
//           return api(originalRequest);
//         } catch (refreshErr: any) {
//           processQueue(refreshErr, null);

//           // Client-side redirect to login
//           if (typeof window !== "undefined") {
//             router.push("/login");
//           }

//           return Promise.reject(refreshErr);
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       return Promise.reject(error);
//     }
//   );
// };

// // -------------------------------------------------------
// // Generic data extractor
// // -------------------------------------------------------
// const extractData = <T>(promise: Promise<any>): Promise<T> =>
//   promise.then((res) => res.data);

// // -------------------------------------------------------
// // API Helpers
// // -------------------------------------------------------
// export const courseApi = {
//   listCourses: () => extractData<Course[]>(api.get("/courses")),
// };

// export const ebookApi = {
//   listEbooks: () => extractData<Ebook[]>(api.get("/ebooks")),
// };

// export const blogpostApi = {
//   listBlogposts: () => extractData<BlogPost[]>(api.get("/blogposts")),
// };
