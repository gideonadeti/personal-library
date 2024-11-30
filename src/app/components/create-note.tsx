import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { createNote } from "@/app/utils/query-functions";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
        </DialogHeader>
        <CreateNoteForm bookId={bookId} />
      </DialogContent>
    </Dialog>
  );
}

function CreateNoteForm({ bookId }: { bookId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const queryClient = useQueryClient();

  const { user } = useUser();
  const { toast } = useToast();
  const { mutate, status } = useMutation<string, AxiosError>({
    mutationFn: () => createNote(user!.id, bookId, form.getValues("content")),
    onSuccess: (message) => {
      form.reset({ content: "" });
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });

      toast({
        description: message,
      });
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
