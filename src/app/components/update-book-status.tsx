import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { updateBookStatus } from "@/app/utils/query-functions";
import { useToast } from "@/hooks/use-toast";
import { Book } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  status: z.string(),
});

export default function UpdateBookStatus({
  open,
  onOpenChange,
  book,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Book Status</DialogTitle>
        </DialogHeader>
        <UpdateBookStatusForm book={book} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}

function UpdateBookStatusForm({
  book,
  onOpenChange,
}: {
  book: Book;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: book.status,
    },
  });
  const queryClient = useQueryClient();

  const { user } = useUser();
  const { toast } = useToast();
  const { mutate, status } = useMutation<string, AxiosError>({
    mutationFn: () =>
      updateBookStatus(user!.id, book.id, form.getValues("status")),
    onSuccess: (msg) => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });

      toast({
        description: msg,
      });

      onOpenChange(false);
    },
    onError: (err) => {
      const description =
        (err?.response?.data as { errMsg: string })?.errMsg ||
        "Something went wrong";

      toast({
        description,
        variant: "destructive",
      });
    },
  });

  function onSubmit() {
    mutate();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={status === "pending"}>
          {status === "pending" ? "Submitting" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
