import axios from "./axios-instance";

export async function readGroups(userId: string) {
  try {
    const response = await axios.get("/groups", {
      params: { userId },
    });

    return response.data.groups;
  } catch (error) {
    console.error(error);

    throw error;
  }
}
