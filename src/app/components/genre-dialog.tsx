import GenreBooksTable from "./tables/genre-books/genre-books-table";
import { Genre } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function GenreDialog({
  open,
  onOpenChange,
  genre,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  genre: Genre;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>{genre.name}</DialogTitle>
          <DialogDescription>
            You have {genre.books.length} book(s) in this genre
          </DialogDescription>
        </DialogHeader>
        <div>
          <GenreBooksTable genre={genre} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
