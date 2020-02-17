import axios from "axios";

const REST_API = "https://musify-xmysql.herokuapp.com";

const api = axios.create({
  baseURL: REST_API,
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
