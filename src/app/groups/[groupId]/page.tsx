"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useParams } from "next/navigation";

import BooksTable from "@/app/components/books-table/books-table";
import { columns } from "@/app/components/books-table/columns";
import { Group, Author, Genre, Book } from "@/app/types";
import { Spinner } from "@/components/ui/spinner";
import {
  readGroups,
  readAuthors,
  readGenres,
  readBooks,
} from "@/app/utils/query-functions";

export default function Page() {
  const { user } = useUser();
  const { toast } = useToast();
  const { groupId } = useParams();

  const { status: groupsStatus, error: groupsError } = useQuery<
    Group[],
    AxiosError
  >({
    queryKey: ["groups"],
    queryFn: () => readGroups(user!.id),
  });
  const { status: authorsStatus, error: authorsError } = useQuery<
    Author[],
    AxiosError
  >({
    queryKey: ["authors"],
    queryFn: () => readAuthors(user!.id),
  });
  const { status: genresStatus, error: genresError } = useQuery<
    Genre[],
    AxiosError
  >({
    queryKey: ["genres"],
    queryFn: () => readGenres(user!.id),
  });

  const {
    status: booksStatus,
    data: books,
    error: booksError,
  } = useQuery<Book[], AxiosError>({
    queryKey: ["books"],
    queryFn: () => readBooks(user!.id),
  });

  useEffect(() => {
    if (
      groupsStatus === "error" ||
      authorsStatus === "error" ||
      genresStatus === "error" ||
      booksStatus === "error"
    ) {
      const errorMessage =
        (groupsError?.response?.data as { errMsg: string })?.errMsg ||
        (authorsError?.response?.data as { errMsg: string })?.errMsg ||
        (genresError?.response?.data as { errMsg: string })?.errMsg ||
        (booksError?.response?.data as { errMsg: string })?.errMsg ||
        "Something went wrong";

      toast({
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [
    groupsError,
    groupsStatus,
    authorsError,
    authorsStatus,
    genresError,
    genresStatus,
    booksError,
    booksStatus,
    toast,
  ]);

  return (
    <div className="px-8 py-4">
      {(groupsStatus === "pending" ||
        authorsStatus === "pending" ||
        genresStatus === "pending" ||
        booksStatus === "pending") && <Spinner />}
      {books && books.length > 0 && (
        <BooksTable
          columns={columns}
          data={
            groupId === "favorites"
              ? books.filter((book) => book.favorite)
              : books
          }
        />
      )}
    </div>
  );
}
