import VerseList from "@/components/VerseList";
import { getBible } from "@/lib/getBible";
import type { Verse } from "@/types/bible";
import React from "react";

export const revalidate = 60;

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>;
}) {
  const bible = getBible();
  const { book: rawBook, chapter: rawChapter } = await params;
  const bookName = decodeURIComponent(rawBook.replaceAll(/-/g, " "));
  const chapNum = Number(rawChapter);

  const book = bible.books.find((b) => b.name === bookName);
  const chapter = book?.chapters.find((c) => c.chapter === chapNum);

  if (!chapter) {
    return <p className="text-red-500 p-6">Chapter not found</p>;
  }

  // pass the raw verses array into our client component
  return <VerseList verses={chapter.verses as Verse[]} />;
}
