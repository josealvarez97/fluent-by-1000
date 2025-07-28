import { getBible } from "@/lib/getBible";
import type { Verse } from "@/types/bible";

// export function generateStaticParams() {
//   const bible = getBible();
//   return bible.books.flatMap((b) =>
//     b.chapters.map((ch) => ({
//       book: encodeURIComponent(b.name.replace(" ", "-")),
//       chapter: ch.chapter.toString(),
//     }))
//   );
// }

// 1. Fully dynamic SSR
// export const dynamic = "force-dynamic";

// 2. (Optional) If you’d rather have ISR, comment out the above line and
//    uncomment the next. This will cache each page for 60s.
export const revalidate = 60;

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>;
}) {
  const bible = getBible();
  const _params = await params;
  // const bookName = decodeURIComponent(_params.book);
  const bookName = decodeURIComponent(_params.book.replace(/-/g, " ")); // Replace hyphens with spaces
  const chapNum = Number(_params.chapter);
  const book = bible.books.find((b) => b.name === bookName);
  const chapter = book?.chapters.find((c) => c.chapter === chapNum);

  if (!chapter) return <p className="text-red-500 p-6">Chapter not found</p>;

  return (
    <div className="space-y-6">
      {chapter.verses.map((v: Verse) => (
        <div
          key={v.verse}
          className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition"
        >
          <span className="font-semibold mr-2">{v.verse}.</span>
          <span className="leading-relaxed">{v.text}</span>
        </div>
      ))}
    </div>
  );
}
