import api from "@/lib/axios";

// POST /auth/login. UI code never calls Axios directly; it calls this.
export async function login({ username, password }) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });

  const token = data.accessToken ?? data.token;
  if (!token) throw new Error("Login failed: no token received.");

  return {
    token,
    user: {
      id: data.id,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  };
}
