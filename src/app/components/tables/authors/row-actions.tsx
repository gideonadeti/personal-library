"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import AuthorDialog from "../../author-dialog";
import CreateAuthor from "../../create-author";
import DeleteAuthor from "../../delete-author";
import { Button } from "@/components/ui/button";
import { Author } from "@/app/types";
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
  const author = row.original as Author;

  const [openAuthorDialog, setOpenAuthorDialog] = useState(false);
  const [openUpdateAuthor, setOpenUpdateAuthor] = useState(false);
  const [openDeleteAuthor, setOpenDeleteAuthor] = useState(false);

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
        <DropdownMenuItem onClick={() => setOpenAuthorDialog(true)}>
          Open
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOpenUpdateAuthor(true)}>
          Update
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpenDeleteAuthor(true)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <AuthorDialog
        open={openAuthorDialog}
        onOpenChange={setOpenAuthorDialog}
        author={author}
      />
      <CreateAuthor
        open={openUpdateAuthor}
        onOpenChange={setOpenUpdateAuthor}
        author={author}
      />
      <DeleteAuthor
        open={openDeleteAuthor}
        onOpenChange={setOpenDeleteAuthor}
        authorId={author.id}
      />
    </DropdownMenu>
  );
}
