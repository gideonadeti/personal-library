import AuthorBooksTable from "./tables/author-books/author-books-table";
import { Author } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AuthorDialog({
  open,
  onOpenChange,
  author,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author: Author;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>{author.name}</DialogTitle>
          <DialogDescription>
            You have {author.books.length} book(s) by this author
          </DialogDescription>
        </DialogHeader>
        <div>
          <AuthorBooksTable author={author} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
