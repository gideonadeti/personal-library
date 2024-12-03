import { useMemo } from "react";
import useBooksData from "@/app/hooks/use-books-data";
import { Author } from "@/app/types";
import { Spinner } from "@/components/ui/spinner";
import BooksTable from "../books/books-table";
import { columns } from "./columns";

export default function AuthorBooksTable({ author }: { author: Author }) {
  const { booksQuery, isLoading } = useBooksData();
  const { data: books } = booksQuery;

  const authorBooks = useMemo(() => {
    return books?.filter((book) => book.author.id === author.id);
  }, [books, author.id]);

  return (
    <div>
      {isLoading && <Spinner />}
      {authorBooks && <BooksTable columns={columns} data={authorBooks} />}
    </div>
  );
}
