"use client";

import GenresTable from "@/app/components/tables/genres/genres-table";
import useBooksData from "@/app/hooks/use-books-data";
import { columns } from "@/app/components/tables/genres/columns";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const { genresQuery, isLoading } = useBooksData();
  const { data } = genresQuery;

  return (
    <div className="px-8 py-4">
      {isLoading && <Spinner />}
      {data && <GenresTable columns={columns} data={data} />}
    </div>
  );
}
