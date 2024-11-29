"use client";

import AuthorsTable from "@/app/components/tables/authors/authors-table";
import useBooksData from "@/app/hooks/use-books-data";
import { columns } from "@/app/components/tables/authors/columns";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const { authorsQuery, isLoading } = useBooksData();
  const { data } = authorsQuery;

  return (
    <div className="px-8 py-4">
      {isLoading && <Spinner />}
      {data && <AuthorsTable columns={columns} data={data} />}
    </div>
  );
}
