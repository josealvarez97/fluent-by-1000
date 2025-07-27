"use client";
import React, { useState } from "react";
import { pinyin } from "pinyin-pro";
import freqData from "@/data/frequency.json";
import Link from "next/dist/client/link";

type RawFreqEntry = {
  rank: number | null;
  freq: number | null;
  cumFreq: number | null;
};

interface FrequencyItem {
  origin: string;
  rank: number;
  freq: number;
  cumFreq: number;
}

const getBgClass = (rank: number): string => {
  if (rank <= 100) return "bg-yellow-100";
  if (rank <= 300) return "bg-pink-100";
  if (rank <= 600) return "bg-teal-100";
  if (rank <= 1000) return "bg-sky-100";
  return "bg-gray-200";
};

const Flashcard: React.FC<{ item: FrequencyItem }> = ({ item }) => {
  const [flipped, setFlipped] = useState(false);
  const py = pinyin(item.origin, { toneType: "symbol" });

  return (
    <div
      onClick={() => setFlipped((prev) => !prev)}
      className={`
        relative
        ${getBgClass(item.rank)}
        cursor-pointer
        rounded-2xl
        shadow-md
        p-4
        flex
        flex-col
        items-center
        justify-center
        text-center
        transition-transform
        transform
        hover:scale-105
      `}
    >
      {/* Rank badge in top-right corner */}
      <div className="absolute top-2 left-2 text-xs font-semibold text-gray-600">
        {item.rank}
      </div>

      {flipped ? (
        <span className="text-xl lg:text-2xl font-bold">{py}</span>
      ) : (
        <span className="text-2xl lg:text-4xl font-bold">{item.origin}</span>
      )}

      {/* Keep freq/cumFreq in the body, without repeating rank */}
      <div className="mt-2 text-xs text-gray-700">
        {/* Freq {item.freq} · Cum {item.cumFreq} */}
        {flipped ? (
          <Link
            href={`https://www.zdic.net/hans/${item.origin}`}
            target="_blank"
            className="text-blue-500 hover:underline"
            rel="noopener noreferrer"
          >
            {/* {`我不吃到${py}`} */}
            {`不吃到`}
          </Link>
        ) : (
          `${(item.cumFreq * 100).toFixed(2)}%`
        )}
      </div>
    </div>
  );
};

const FrequencyPage: React.FC = () => {
  const freqArray: FrequencyItem[] = Object.entries(
    freqData as Record<string, RawFreqEntry>
  )
    .map(([origin, { rank, freq, cumFreq }]) => ({
      origin,
      rank,
      freq,
      cumFreq,
    }))
    .filter(
      (item): item is FrequencyItem =>
        item.rank !== null && item.freq !== null && item.cumFreq !== null
    );

  return (
    <div className="p-2 lg:p-4">
      <div className="grid grid-cols-5 lg:grid-cols-10 gap-2 lg:gap-4">
        {freqArray.slice(0, 1000).map((item) => (
          <Flashcard key={item.origin} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FrequencyPage;
