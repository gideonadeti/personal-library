"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useEffect } from "react";

import {
  readGroups,
  readAuthors,
  readGenres,
  readBooks,
} from "@/app/utils/query-functions";
import { Group, Author, Genre, Book } from "@/app/types";

export default function Page() {
  const { user } = useUser();
  const { toast } = useToast();

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

  return (
    <div className="flex flex-col">
      <span>{groups?.length} groups</span>
      <span>{books?.length} books</span>
    </div>
  );
}
