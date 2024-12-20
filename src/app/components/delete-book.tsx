import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useUser } from "@clerk/nextjs";

import { useToast } from "@/hooks/use-toast";
import { deleteBook } from "@/app/utils/query-functions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteBook({
  open,
  onOpenChange,
  bookId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
}) {
  const queryClient = useQueryClient();

  const { user } = useUser();
  const { toast } = useToast();
  const { mutate, status } = useMutation<string, AxiosError>({
    mutationFn: () => deleteBook(user!.id, bookId),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      queryClient.invalidateQueries({ queryKey: ["genres"] });

      toast({
        description: message,
      });

      onOpenChange(false);
    },
    onError: (error) => {
      const description =
        (error?.response?.data as { errMsg: string })?.errMsg ||
        "Something went wrong";

      toast({
        description,
        variant: "destructive",
      });
    },
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => isOpen && onOpenChange(isOpen)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this book?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={status === "pending"}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600"
            disabled={status === "pending"}
            onClick={() => mutate()}
          >
            {status === "pending" ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
