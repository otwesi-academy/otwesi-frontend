// lib/serverApi.ts
import axios from "axios";
import { Course, Ebook, BlogPost } from "@/types/types";

export const SERVER_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Axios instance for server-side requests (SSR/SSG)
export const serverApi = axios.create({
  baseURL: SERVER_API_BASE_URL,
  // no withCredentials needed for public endpoints
});

// Generic data extractor
const extractData = <T>(promise: Promise<any>): Promise<T> =>
  promise.then((res) => res.data);

// Public API helpers
export const courseApi = {
  listCourses: () => extractData<Course[]>(serverApi.get("/courses")),
};

export const ebookApi = {
  listEbooks: () => extractData<Ebook[]>(serverApi.get("/ebooks")),
};

export const blogpostApi = {
  listBlogposts: () => extractData<BlogPost[]>(serverApi.get("/blogposts")),
};
