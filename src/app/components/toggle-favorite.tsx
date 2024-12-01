import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useUser } from "@clerk/nextjs";

import { toggleFavorite } from "@/app/utils/query-functions";
import { Book } from "../types";

export default function ToggleFavorite({
  book,
  children,
}: {
  book: Book;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const { toast } = useToast();
  const { user } = useUser();

  const { mutate } = useMutation({
    mutationFn: () => toggleFavorite(user!.id, book.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["books"] });
      const currentBooks = queryClient.getQueryData<Book[]>(["books"]);

      queryClient.setQueryData<Book[]>(["books"], (currentBooks) =>
        currentBooks?.map((currentBook) =>
          currentBook.id === book.id
            ? { ...currentBook, favorite: !currentBook.favorite }
            : currentBook
        )
      );

      return { currentBooks };
    },
    onError: (err, _, context) => {
      if (context?.currentBooks) {
        queryClient.setQueryData(["books"], context.currentBooks);
      }

      toast({
        description:
          ((err as AxiosError)?.response?.data as { errMsg: string })?.errMsg ||
          "Something went wrong",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  return <div onClick={() => mutate()}>{children}</div>;
}
