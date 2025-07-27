"use client";
import React, { useState } from "react";
import { pinyin } from "pinyin-pro";
import freqData from "@/data/frequency.json";

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
  // get pinyin (tone marks)
  const py = pinyin(item.origin, { toneType: "symbol" });

  return (
    <div
      onClick={() => setFlipped((prev) => !prev)}
      className={`
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
      {flipped ? (
        <span className="text-2xl font-bold">{py}</span>
      ) : (
        <span className="text-4xl font-bold">{item.origin}</span>
      )}
      <div className="mt-2 text-xs text-gray-700">
        Rank {item.rank} · Freq {item.freq} · Cum. {item.cumFreq}
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
    <div className="p-4">
      <div className="grid grid-cols-10 gap-4">
        {freqArray.slice(0, 1000).map((item) => (
          <Flashcard key={item.origin} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FrequencyPage;
