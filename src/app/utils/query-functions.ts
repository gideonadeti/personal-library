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

export async function updateGroup(
  userId: string,
  groupId: string,
  name: string
) {
  try {
    const res = await axios.put(`/groups/${groupId}`, {
      userId,
      name,
    });

    return res.data.msg;
  } catch (err) {
    console.error("Error updating group:", err);

    throw err;
  }
}

export async function deleteGroup(userId: string, groupId: string) {
  try {
    const res = await axios.delete(`/groups/${groupId}`, {
      params: { userId },
    });

    return res.data.msg;
  } catch (err) {
    console.error("Error deleting group:", err);

    throw err;
  }
}

export async function readAuthors(userId: string) {
  try {
    const response = await axios.get("/authors", {
      params: { userId },
    });

    return response.data.authors;
  } catch (err) {
    console.error("Error reading authors:", err);

    throw err;
  }
}

export async function createAuthor(
  userId: string,
  name: string,
  description: string
) {
  try {
    const res = await axios.post(`/authors`, {
      userId,
      name,
      description,
    });

    return res.data.msg;
  } catch (err) {
    console.error("Error creating author:", err);

    throw err;
  }
}

export async function readGenres(userId: string) {
  try {
    const response = await axios.get("/genres", {
      params: { userId },
    });

    return response.data.genres;
  } catch (err) {
    console.error("Error reading genres:", err);

    throw err;
  }
}

export async function createGenre(
  userId: string,
  name: string,
  description: string
) {
  try {
    const res = await axios.post(`/genres`, {
      userId,
      name,
      description,
    });

    return res.data.msg;
  } catch (err) {
    console.error("Error creating genre:", err);

    throw err;
  }
}

export async function readBooks(userId: string) {
  try {
    const response = await axios.get("/books", {
      params: { userId },
    });

    return response.data.books;
  } catch (err) {
    console.error("Error reading books:", err);

    throw err;
  }
}
