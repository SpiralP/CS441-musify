import axios from "axios";

const api = axios.create({
  baseURL: "https://cs441-musify.herokuapp.com/",
});

export async function getUsers(): Promise<User[]> {
  const response = await api(`/api/User`);
  return response.data;
}

interface User {
  id: string;
  name: string;
  email: string;
}
