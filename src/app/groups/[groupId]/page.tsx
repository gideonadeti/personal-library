"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";

import BooksTable from "@/app/components/tables/books/books-table";
import { columns } from "@/app/components/tables/books/columns";
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

  const {
    status: groupsStatus,
    data: groups,
    error: groupsError,
  } = useQuery<Group[], AxiosError>({
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

  const filteredBooks = useMemo(() => {
    if (!books?.length) return [];

    switch (groupId) {
      case "all-books": {
        const allBooksGroup = groups?.find((group) => group.default);
        return books.filter((book) => book.groupId === allBooksGroup?.id);
      }

      case "favorites": {
        return books.filter((book) => book.favorite);
      }

      default: {
        return books.filter((book) => book.groupId === groupId);
      }
    }
  }, [books, groups, groupId]);

  return (
    <div className="px-8 py-4">
      {(groupsStatus === "pending" ||
        authorsStatus === "pending" ||
        genresStatus === "pending" ||
        booksStatus === "pending") && <Spinner />}
      {books && <BooksTable columns={columns} data={filteredBooks} />}
    </div>
  );
}
