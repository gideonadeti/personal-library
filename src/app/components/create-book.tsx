import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { AxiosError } from "axios";
import { useState } from "react";
import { Plus } from "lucide-react";

import CreateAuthor from "./create-author";
import CreateGenre from "./create-genre";
import { Group, Author, Genre } from "../types";
import { useToast } from "@/hooks/use-toast";
import { createBook } from "@/app/utils/query-functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorItem,
  MultiSelectorList,
} from "@/components/ui/multi-select";
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
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string(),
  groupId: z.string(),
  authorId: z.string(),
  genres: z.array(z.string()),
});

export default function CreateBook({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Book</DialogTitle>
        </DialogHeader>
        <AddTaskForm />
      </DialogContent>
    </Dialog>
  );
}

function AddTaskForm() {
  const { data: groups } = useQuery<Group[]>({ queryKey: ["groups"] });
  const { data: authors } = useQuery<Author[]>({ queryKey: ["authors"] });
  const { data: genres } = useQuery<Genre[]>({ queryKey: ["genres"] });
  const { user } = useUser();
  const { toast } = useToast();

  const [openCreateAuthor, setOpenCreateAuthor] = useState(false);
  const [openCreateGenre, setOpenCreateGenre] = useState(false);

  const queryClient = useQueryClient();

  const defaultValues = {
    title: "",
    description: "",
    groupId: groups?.find((group) => group.default)?.id || "",
    authorId: "",
    genres: [],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutate, status } = useMutation<string, AxiosError>({
    mutationFn: () =>
      createBook(
        user!.id,
        form.getValues("title"),
        form.getValues("description"),
        form.getValues("groupId"),
        form.getValues("authorId"),
        form
          .getValues("genres")
          .map(
            (genre) => genres?.find((g) => g.name.toLowerCase() === genre)?.id
          ) as string[] // Convert selected genres to their ids
      ),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      if (form.getValues("genres").length > 0) {
        queryClient.invalidateQueries({
          queryKey: ["genres"],
        });
      }
      form.reset(defaultValues);

      toast({ description: message });
    },
    onError: (err) => {
      const description =
        (err?.response?.data as { errMsg: string })?.errMsg ||
        "Something went wrong";

      toast({ description, variant: "destructive" });
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="resize-none" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="groupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups?.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="authorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <Button
                      variant="outline"
                      className="ms-auto"
                      onClick={() => setOpenCreateAuthor(true)}
                      title="Create author"
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <SelectContent>
                    {authors?.map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre(s)</FormLabel>
              <FormControl>
                <MultiSelector
                  onValuesChange={field.onChange}
                  values={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <MultiSelectorTrigger className="w-full">
                      <MultiSelectorInput placeholder="Select genre(s)" />
                    </MultiSelectorTrigger>
                    <Button
                      variant="outline"
                      className="ms-auto"
                      onClick={() => setOpenCreateGenre(true)}
                      title="Create genre"
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {genres?.map((genre) => (
                        <MultiSelectorItem
                          key={genre.id}
                          value={genre.name.toLowerCase()}
                        >
                          <span>{genre.name}</span>
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={status === "pending"}>
          {status === "pending" ? "Submitting..." : "Submit"}
        </Button>
      </form>
      <CreateAuthor
        open={openCreateAuthor}
        onOpenChange={setOpenCreateAuthor}
      />
      <CreateGenre open={openCreateGenre} onOpenChange={setOpenCreateGenre} />
    </Form>
  );
}
