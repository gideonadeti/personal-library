"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

import GenresTable from "@/app/components/tables/genres/genres-table";
import { columns } from "@/app/components/tables/genres/columns";
import { Genre } from "@/app/types";
import { Spinner } from "@/components/ui/spinner";
import { readGenres } from "@/app/utils/query-functions";

export default function Page() {
  const { user } = useUser();
  const { toast } = useToast();
  const { status, data, error } = useQuery<Genre[], AxiosError>({
    queryKey: ["genres"],
    queryFn: () => readGenres(user!.id),
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
      {data && <GenresTable columns={columns} data={data} />}
    </div>
  );
}
