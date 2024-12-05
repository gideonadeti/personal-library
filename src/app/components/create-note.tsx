import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { createNote, updateNote } from "@/app/utils/query-functions";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "../types";
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

const formSchema = z.object({
  content: z.string().trim().min(1, { message: "Content is required" }),
});

export default function CreateNote({
  open,
  onOpenChange,
  bookId,
  note,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  note?: Note;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? "Update Note" : "Create Note"}</DialogTitle>
        </DialogHeader>
        <CreateNoteForm
          bookId={bookId}
          note={note}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}

function CreateNoteForm({
  bookId,
  note,
  onOpenChange,
}: {
  bookId: string;
  note?: Note;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: note?.content || "",
    },
  });
  const queryClient = useQueryClient();

  const { user } = useUser();
  const { toast } = useToast();
  const { mutate, status } = useMutation<string, AxiosError>({
    mutationFn: () => {
      if (note) {
        return updateNote(user!.id, bookId, note.id, form.getValues("content"));
      } else {
        return createNote(user!.id, bookId, form.getValues("content"));
      }
    },
    onSuccess: (message) => {
      form.reset({ content: "" });
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });

      toast({
        description: message,
      });

      if (note) {
        onOpenChange(false);
      }
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  rows={3}
                  {...field}
                  disabled={status === "pending"}
                />
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
