import axios from "./axios-instance";

export async function readGroups(userId: string) {
  try {
    const response = await axios.get("/groups", {
      params: { userId },
    });

    return response.data.groups;
  } catch (err) {
    console.error("Error reading groups:", err);

    throw err;
  }
}

export async function createGroup(userId: string, name: string) {
  try {
    const res = await axios.post(`/groups`, {
      userId,
      name,
    });

    return res.data.msg;
  } catch (err) {
    console.error("Error creating group:", err);

    throw err;
  }
}
