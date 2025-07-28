import Link from "next/link";
import type { Book } from "@/types/bible";

export default function Sidebar({ books }: { books: Book[] }) {
  return (
    <aside className="w-64 bg-white shadow-lg overflow-y-auto">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Books</h1>
      </div>
      <ul className="divide-y">
        {books.map((b) => {
          const slug = encodeURIComponent(b.name);
          return (
            <li key={b.name}>
              <Link
                href={`/${slug}`}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                {b.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
