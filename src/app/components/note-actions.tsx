"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import CreateNote from "./create-note";
import { Button } from "@/components/ui/button";
import { Note } from "@/app/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NoteActions({ note }: { note: Note }) {
  const [openUpdateNote, setOpenUpdateNote] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-4 w-4 px-3 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => setOpenUpdateNote(true)}>
          Update
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
      <CreateNote
        open={openUpdateNote}
        onOpenChange={setOpenUpdateNote}
        bookId={note.bookId}
        note={note}
      />
    </DropdownMenu>
  );
}
