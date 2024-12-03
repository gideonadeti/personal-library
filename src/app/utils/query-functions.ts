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

export async function createAuthor(userId: string, name: string) {
  try {
    const res = await axios.post(`/authors`, {
      userId,
      name,
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

export async function createGenre(userId: string, name: string) {
  try {
    const res = await axios.post(`/genres`, {
      userId,
      name,
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

export async function createBook(
  userId: string,
  title: string,
  description: string,
  groupId: string,
  authorId: string,
  genreIds: string[]
) {
  try {
    const res = await axios.post(`/books`, {
      userId,
      title,
      description,
      groupId,
      authorId,
      genreIds,
    });

    return res.data.msg;
  } catch (err) {
    console.error("Error creating book:", err);

    throw err;
  }
}

export async function createNote(
  userId: string,
  bookId: string,
  content: string
) {
  try {
    const res = await axios.post(`/notes`, {
      userId,
      bookId,
      content,
    });

    return res.data.msg;
  } catch (err) {
    console.error("Error creating note:", err);

    throw err;
  }
}

export async function updateBook(
  userId: string,
  bookId: string,
  title: string,
  description: string,
  groupId: string,
  authorId: string,
  genreIds: string[]
) {
  try {
    const res = await axios.put(`/books/${bookId}`, {
      userId,
      title,
      description,
      groupId,
      authorId,
      genreIds,
    });

    return res.data.msg;
  } catch (err) {
    console.error("Error updating book:", err);

    throw err;
  }
}

export async function toggleFavorite(userId: string, bookId: string) {
  try {
    await axios.patch(`/books/${bookId}`, {
      userId,
    });
  } catch (err) {
    console.error("Error toggling favorite:", err);

    throw err;
  }
}

export async function updateBookStatus(
  userId: string,
  bookId: string,
  status: string
) {
  try {
    const res = await axios.patch(`/books/${bookId}`, {
      userId,
      status,
    });

    return res.data.msg;
  } catch (err) {
    console.error("Error updating book status:", err);

    throw err;
  }
}

export async function deleteBook(userId: string, bookId: string) {
  try {
    const res = await axios.delete(`/books/${bookId}`, {
      params: { userId },
    });

    return res.data.msg;
  } catch (err) {
    console.error("Error deleting book:", err);

    throw err;
  }
}

export async function updateAuthor(
  userId: string,
  authorId: string,
  name: string
) {
  try {
    const res = await axios.put(`/authors/${authorId}`, {
      userId,
      name,
    });

    return res.data.msg;
  } catch (err) {
    console.error("Error updating author:", err);

    throw err;
  }
}
