"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Star, Plus } from "lucide-react";

import useBooksData from "@/app/hooks/use-books-data";
import BookStatus from "@/app/components/book-status";
import CreateNote from "@/app/components/create-note";
import { H2, Muted, H4, H3 } from "@/app/components/custom-tags";
import { Book } from "@/app/types";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Page() {
  const { bookId } = useParams();
  const { booksQuery, isLoading } = useBooksData();
  const [book, setBook] = useState<Book>();
  const [openCreateNote, setOpenCreateNote] = useState(false);

  useEffect(() => {
    if (booksQuery.data) {
      setBook(booksQuery.data.find((b) => b.id === bookId));
    }
  }, [booksQuery.data, bookId]);
  return (
    <div className="px-8 py-4">
      {isLoading && <Spinner />}
      {book && (
        <div>
          <H4 className="text-sm">{book.author.name}</H4>
          <H2>{book.title}</H2>
          <Muted className="mb-2">{book.description}</Muted>
          <div className="flex items-center h-6 mb-4">
            {book.favorite && (
              <>
                <Star className="text-yellow-500 w-4 h-4 mr-1" />
                <Separator orientation="vertical" className="mx-2" />
              </>
            )}
            <BookStatus status={book.status} />
            <Separator orientation="vertical" className="mx-2" />
            <div className="space-x-2">
              {book.genres.map((genre) => (
                <Badge key={genre.id}>{genre.name.toLowerCase()}</Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <H3>Notes</H3>
              <Button
                variant="ghost"
                size="icon"
                title="Create note"
                className="rounded-full"
                onClick={() => setOpenCreateNote(true)}
              >
                <Plus />
              </Button>
            </div>
            {book.notes.length > 0 ? (
              <Accordion type="single" collapsible>
                {book.notes.map((note) => (
                  <AccordionItem key={note.id} value={note.id}>
                    <AccordionTrigger>
                      {note.content.length > 25
                        ? note.content.slice(0, 25) + "..."
                        : note.content}
                    </AccordionTrigger>
                    <AccordionContent>{note.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Muted>No notes</Muted>
            )}
          </div>
        </div>
      )}
      <CreateNote
        bookId={bookId as string}
        open={openCreateNote}
        onOpenChange={setOpenCreateNote}
      />
    </div>
  );
}
