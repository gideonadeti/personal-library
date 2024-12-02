"use client";

import { ColumnDef } from "@tanstack/react-table";

import ColumnHeader from "../column-header";
import RowActions from "./row-actions";
import { Author } from "@/app/types";

export const columns: ColumnDef<Author>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "books",
    header: ({ column }) => (
      <ColumnHeader column={column} title="No. of Books" />
    ),

    cell: ({ row }) => {
      const author = row.original;

      return <span>{author.books.length}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];
