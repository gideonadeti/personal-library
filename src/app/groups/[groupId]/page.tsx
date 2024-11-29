"use client";

import BooksTable from "@/app/components/tables/books/books-table";
import { columns } from "@/app/components/tables/books/columns";
import { Spinner } from "@/components/ui/spinner";
import useBooksData from "@/app/hooks/use-books-data";

export default function Page() {
  const { filteredBooks, isLoading } = useBooksData();

  return (
    <div className="px-8 py-4">
      {isLoading && <Spinner />}
      {filteredBooks && <BooksTable columns={columns} data={filteredBooks} />}
    </div>
  );
}
