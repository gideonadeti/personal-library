"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import CreateBook from "../../create-book";
import ToggleFavorite from "../../toggle-favorite";
import UpdateBookStatus from "../../update-book-status";
import DeleteBook from "../../delete-book";
import { Button } from "@/components/ui/button";
import { Book } from "@/app/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export default function RowActions<TData>({ row }: RowActionsProps<TData>) {
  const router = useRouter();
  const book = row.original as Book;

  const [openUpdateBook, setOpenUpdateBook] = useState(false);
  const [openUpdateBookStatus, setOpenUpdateBookStatus] = useState(false);
  const [openDeleteBook, setOpenDeleteBook] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() =>
            router.push(`/groups/${book.groupId}/books/${book.id}`)
          }
        >
          Open
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOpenUpdateBook(true)}>
          Update
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ToggleFavorite book={book}>
            {book.favorite ? "Un-mark as favorite" : "Mark as favorite"}
          </ToggleFavorite>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOpenUpdateBookStatus(true)}>
          Update book status
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpenDeleteBook(true)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <CreateBook
        open={openUpdateBook}
        onOpenChange={setOpenUpdateBook}
        book={book}
      />
      <UpdateBookStatus
        open={openUpdateBookStatus}
        onOpenChange={setOpenUpdateBookStatus}
        book={book}
      />
      <DeleteBook
        open={openDeleteBook}
        onOpenChange={setOpenDeleteBook}
        bookId={book.id}
      />
    </DropdownMenu>
  );
}
