import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGenre, updateGenre } from "@/app/utils/query-functions";
import { useToast } from "@/hooks/use-toast";
import { Genre } from "../types";
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
  name: z.string().min(1, { message: "Name is required" }),
});

export default function CreateGenre({
  open,
  onOpenChange,
  genre,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  genre?: Genre;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{genre ? "Update Genre" : "Create Genre"}</DialogTitle>
        </DialogHeader>
        <CreateGenreForm genre={genre} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}

function CreateGenreForm({
  genre,
  onOpenChange,
}: {
  genre?: Genre;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: genre?.name || "",
    },
  });
  const queryClient = useQueryClient();

  const { user } = useUser();
  const { toast } = useToast();
  const { mutate, status } = useMutation<string, AxiosError>({
    mutationFn: () => {
      if (genre) {
        return updateGenre(user!.id, genre.id, form.getValues("name"));
      } else {
        return createGenre(user!.id, form.getValues("name"));
      }
    },
    onSuccess: (message) => {
      form.reset({ name: "" });
      queryClient.invalidateQueries({
        queryKey: ["genres"],
      });

      if (genre) {
        queryClient.invalidateQueries({
          queryKey: ["books"],
        });
      }

      toast({
        description: message,
      });

      if (genre) {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={status === "pending"} />
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
