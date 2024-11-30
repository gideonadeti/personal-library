"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

import ColumnHeader from "../column-header";
import RowActions from "./row-actions";
import BookStatus from "../../book-status";
import { Book } from "@/app/types";

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
        <span>
          {book.genres.map((genre) => genre.name.toLowerCase()).join(", ")}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const book = row.original;

      return <BookStatus status={book.status} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];
