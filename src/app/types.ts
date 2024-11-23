export interface Note {
  id: string;
  bookId: string;
  content: string;
}

export interface Book {
  id: string;
  groupId: string;
  authorId: string;
  genreId: string;
  title: string;
  status: "unread" | "reading" | "read";
  favorite: boolean;
  notes: Note[];
}

export interface Group {
  id: string;
  name: string;
  books: Book[];
  default: boolean;
}

export interface Author {
  id: string;
  name: string;
  description: string;
  books: Book[];
}
