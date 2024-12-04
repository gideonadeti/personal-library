"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import GenreDialog from "../../genre-dialog";
import CreateGenre from "../../create-genre";
import DeleteGenre from "../../delete-genre";
import { Button } from "@/components/ui/button";
import { Genre } from "@/app/types";
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
  const genre = row.original as Genre;

  const [openGenreDialog, setOpenGenreDialog] = useState(false);
  const [openUpdateGenre, setOpenUpdateGenre] = useState(false);
  const [openDeleteGenre, setOpenDeleteGenre] = useState(false);

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
        <DropdownMenuItem onClick={() => setOpenGenreDialog(true)}>
          Open
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOpenUpdateGenre(true)}>
          Update
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpenDeleteGenre(true)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <GenreDialog
        open={openGenreDialog}
        onOpenChange={setOpenGenreDialog}
        genre={genre}
      />
      <CreateGenre
        open={openUpdateGenre}
        onOpenChange={setOpenUpdateGenre}
        genre={genre}
      />
      <DeleteGenre
        open={openDeleteGenre}
        onOpenChange={setOpenDeleteGenre}
        genreId={genre.id}
      />
    </DropdownMenu>
  );
}
