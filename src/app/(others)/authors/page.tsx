"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

import AuthorsTable from "@/app/components/tables/authors/authors-table";
import { columns } from "@/app/components/tables/authors/columns";
import { Author } from "@/app/types";
import { Spinner } from "@/components/ui/spinner";
import { readAuthors } from "@/app/utils/query-functions";

export default function Page() {
  const { user } = useUser();
  const { toast } = useToast();
  const { status, data, error } = useQuery<Author[], AxiosError>({
    queryKey: ["authors"],
    queryFn: () => readAuthors(user!.id),
  });

  useEffect(() => {
    if (status === "error") {
      const errorMessage =
        (error?.response?.data as { errMsg: string })?.errMsg ||
        "Something went wrong";

      toast({
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [status, error, toast]);

  return (
    <div className="px-8 py-4">
      {status === "pending" && <Spinner />}
      {data && <AuthorsTable columns={columns} data={data} />}
    </div>
  );
}
