import { useMemo } from "react";
import useBooksData from "@/app/hooks/use-books-data";
import { Genre } from "@/app/types";
import { Spinner } from "@/components/ui/spinner";
import BooksTable from "../books/books-table";
import { columns } from "../genre-books/columns";

export default function GenreBooksTable({ genre }: { genre: Genre }) {
  const { booksQuery, isLoading } = useBooksData();
  const { data: books } = booksQuery;

  const genreBooks = useMemo(() => {
    return books?.filter((book) =>
      book.genres.map((g) => g.id).includes(genre.id)
    );
  }, [books, genre.id]);

  return (
    <div>
      {isLoading && <Spinner />}
      {genreBooks && <BooksTable columns={columns} data={genreBooks} />}
    </div>
  );
}
