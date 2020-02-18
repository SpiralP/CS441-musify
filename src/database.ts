import axios from "axios";

const apiOptions: any = {};
if (!process.env.PORT) {
  // we're testing locally, hope you ran npm start!
  apiOptions.baseURL = "http://localhost:3000";
}

const api = axios.create(apiOptions);

export async function getUsers(): Promise<User[]> {
  const response = await api(`/api/User`);
  return response.data;
}

interface User {
  id: string;
  name: string;
  email: string;
}
