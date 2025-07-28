"use client";

import React, { useState } from "react";
import ReusablePinyinViewer from "@/components/ReusablePinyinViewer";
import type { Verse } from "@/types/bible";

interface VerseListProps {
  verses: Verse[];
}

const VerseList: React.FC<VerseListProps> = ({ verses }) => {
  // track which verse’s pinyin viewer is open
  const [activeVerse, setActiveVerse] = useState<number | null>(null);

  const handleClick = (verseNumber: number) => {
    // clicking an open verse closes it; clicking another opens that one
    setActiveVerse((current) => (current === verseNumber ? null : verseNumber));
  };

  return (
    <div className="space-y-6">
      {verses.map((v) => (
        <div key={v.verse}>
          <div
            onClick={() => handleClick(v.verse)}
            className="
              p-4 bg-white shadow-md rounded-lg 
              hover:shadow-lg transition cursor-pointer
            "
          >
            <span className="font-semibold mr-2">{v.verse}.</span>
            <span className="leading-relaxed">{v.text}</span>
          </div>

          {activeVerse === v.verse && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg shadow-inner">
              <ReusablePinyinViewer text={v.text} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VerseList;
