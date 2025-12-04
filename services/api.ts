import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

console.log(API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});


export const courseApi = {
  async listCourses() {
    const response = await api.get("/courses", {});
    return response.data;
  },
}


export const ebookApi = {
  async listEbooks() {
    const response = await api.get("/ebooks", {});
    return response.data;
  },
};


export const blogpostApi = {
  async listBlogposts() {
    const response = await api.get("/blogposts", {});
    return response.data;
  },
};