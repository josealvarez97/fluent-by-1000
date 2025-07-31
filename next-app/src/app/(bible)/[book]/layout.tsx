import { getBible } from "@/lib/getBible";
import Link from "next/link";

export function generateStaticParams() {
  return getBible().books.map((b) => ({
    book: encodeURIComponent(b.name.replaceAll(" ", "-")),
  }));
}

export default async function BookLayout({
  params: _params,
  children,
}: {
  params: Promise<{ book: string }>;
  children: React.ReactNode;
}) {
  const bible = getBible();
  const params = await _params;
  // const bookName = decodeURIComponent(params.book);
  const bookName = decodeURIComponent(params.book.replaceAll(/-/g, " ")); // Replace hyphens with spaces
  const book = bible.books.find((b) => b.name === bookName);

  if (!book) return <p className="p-6 text-red-500">Book not found</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold border-b pb-2">{book.name}</h2>
      <nav className="flex flex-wrap gap-2">
        {book.chapters.map((ch) => (
          <Link
            key={ch.chapter}
            href={`/${params.book}/${ch.chapter}`}
            className="px-3 py-1 bg-white shadow rounded hover:bg-gray-100"
          >
            Chapter {ch.chapter}
          </Link>
        ))}
      </nav>
      <div>{children}</div>
    </div>
  );
}
