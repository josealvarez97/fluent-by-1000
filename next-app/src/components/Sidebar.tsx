"use client";
import { useState } from "react";
import Link from "next/link";
import type { Book } from "@/types/bible";

export default function Sidebar({ books }: { books: Book[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. Mobile hamburger */}
      <div className="md:hidden p-4 bg-white shadow">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="text-2xl"
        >
          ☰
        </button>
      </div>

      {/* 2. Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. Sidebar / drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-white shadow-lg overflow-y-auto
          transform transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-semibold">Books</h1>
          {/* Close button on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="md:hidden text-2xl"
          >
            ×
          </button>
        </div>
        <ul className="divide-y">
          {books.map((b) => {
            const slug = encodeURIComponent(b.name);
            return (
              <li key={b.name}>
                <Link
                  href={`/${slug}`}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)} // close on select
                >
                  {b.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
