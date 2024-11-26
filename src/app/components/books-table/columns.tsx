"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

import ColumnHeader from "./column-header";
import RowActions from "./row-actions";
import { Book } from "@/app/types";
import { Badge } from "@/components/ui/badge";

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
          <span>{book.title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const book = row.original;

      return (
        <span>
          {book.description.length > 50
            ? book.description.slice(0, 50) + "..."
            : book.description}
        </span>
      );
    },
  },
  {
    accessorKey: "author",
    header: ({ column }) => <ColumnHeader column={column} title="Author" />,
    cell: ({ row }) => {
      const book = row.original;

      return <span>{book.author.name}</span>;
    },
  },
  {
    accessorKey: "genres",
    header: ({ column }) => <ColumnHeader column={column} title="Genre(s)" />,
    cell: ({ row }) => {
      const book = row.original;

      return (
        <span className="space-x-2">
          {book.genres.map((genre) => (
            <Badge key={genre.id} variant="outline" className="rounded-full">
              {genre.name.toLowerCase()}
            </Badge>
          ))}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];
