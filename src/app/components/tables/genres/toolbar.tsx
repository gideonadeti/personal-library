"use client";

import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import ViewOptions from "../view-options";

interface ToolbarProps<TData> {
  table: Table<TData>;
}

export default function Toolbar<TData>({ table }: ToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder="Search genre..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="h-8 w-[150px] lg:w-[250px]"
      />
      <ViewOptions table={table} />
    </div>
  );
}
