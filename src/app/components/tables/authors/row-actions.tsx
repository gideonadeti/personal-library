"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import AuthorDialog from "../../author-dialog";
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
        <DropdownMenuItem onClick={() => console.log("Updating", author.name)}>
          Update
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => console.log("Deleting", author.name)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <AuthorDialog
        open={openAuthorDialog}
        onOpenChange={setOpenAuthorDialog}
        author={author}
      />
    </DropdownMenu>
  );
}
