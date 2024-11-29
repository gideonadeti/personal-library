import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";

import { Group, Author, Genre, Book } from "@/app/types";
import {
  readGroups,
  readAuthors,
  readGenres,
  readBooks,
} from "@/app/utils/query-functions";

export default function useBooksData() {
  const { user } = useUser();
  const { toast } = useToast();
  const { groupId } = useParams();

  // Queries for groups, authors, genres, and books
  const groupsQuery = useQuery<Group[], AxiosError>({
    queryKey: ["groups"],
    queryFn: () => readGroups(user!.id),
  });
  const authorsQuery = useQuery<Author[], AxiosError>({
    queryKey: ["authors"],
    queryFn: () => readAuthors(user!.id),
  });
  const genresQuery = useQuery<Genre[], AxiosError>({
    queryKey: ["genres"],
    queryFn: () => readGenres(user!.id),
  });
  const booksQuery = useQuery<Book[], AxiosError>({
    queryKey: ["books"],
    queryFn: () => readBooks(user!.id),
  });

  // Error handling effect
  useEffect(() => {
    const queries = [groupsQuery, authorsQuery, genresQuery, booksQuery];
    const errorQuery = queries.find((query) => query.status === "error");

    if (errorQuery) {
      const errorMessage =
        (errorQuery.error?.response?.data as { errMsg: string })?.errMsg ||
        "Something went wrong";

      toast({
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [authorsQuery, groupsQuery, genresQuery, booksQuery, toast]);

  // Filtered books logic
  const filteredBooks = useMemo(() => {
    const { data: books } = booksQuery;
    const { data: groups } = groupsQuery;

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
  }, [booksQuery, groupsQuery, groupId]);

  return {
    groupsQuery,
    authorsQuery,
    genresQuery,
    booksQuery,
    filteredBooks,
    isLoading:
      groupsQuery.status === "pending" ||
      authorsQuery.status === "pending" ||
      genresQuery.status === "pending" ||
      booksQuery.status === "pending",
  };
}
