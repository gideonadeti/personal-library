"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Star, Eye } from "lucide-react";
import Link from "next/link";

import ColumnHeader from "../column-header";
import BookStatus from "../../book-status";
import { Book } from "@/app/types";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <ColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      const book = row.original;

      return (
        <div className="flex items-center">
          <span>
            {book.favorite && <Star className="text-yellow-500 w-4 h-4 mr-1" />}
          </span>
          <span>
            {book.title.length > 25
              ? book.title.slice(0, 25) + "..."
              : book.title}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    header: () => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 data-[state=open]:bg-accent"
      >
        <span>Author</span>
      </Button>
    ),
    cell: ({ row }) => {
      const book = row.original;

      return <span>{book.author.name}</span>;
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 data-[state=open]:bg-accent"
      >
        <span>Status</span>
      </Button>
    ),
    cell: ({ row }) => {
      const book = row.original;

      return <BookStatus status={book.status} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;

      return (
        <Link href={`/groups/${book.groupId}/books/${book.id}`} title="Open">
          <Eye />
        </Link>
      );
    },
  },
];
