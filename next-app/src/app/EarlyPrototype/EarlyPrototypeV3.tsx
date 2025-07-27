// pages/pinyin.tsx
"use client";
import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { pinyin } from "pinyin-pro";
import freqData from "@/data/frequency.json";
// import clsx from "clsx";
import Link from "next/link";

// match the library’s AllData interface plus freq fields
interface PinyinData {
  origin: string;
  pinyin: string;
  initial: string;
  final: string;
  first: string;
  finalHead: string;
  finalBody: string;
  finalTail: string;
  num: number;
  isZh: boolean;
  polyphonic: string[];
  inZhRange: boolean;
  result: string;
  // frequency fields from external source
  rank: number | null;
  freq: number | null;
  cumFreq: number | null;
}
interface FrequencyData {
  rank: number | null;
  freq: number | null;
  cumFreq: number | null;
}

const PinyinPanel: React.FC<{ data: PinyinData; onClose: () => void }> = ({
  data,
  onClose,
}) => (
  <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-auto">
    <button
      onClick={onClose}
      className="mb-4 text-gray-500 hover:text-gray-800"
    >
      × Close
    </button>
    <h2 className="text-xl font-semibold mb-2">{data.origin}</h2>
    <ul className="space-y-1 text-sm">
      <li>
        <strong>Pinyin:</strong> {data.pinyin}
      </li>
      <li>
        <strong>Freq Rank:</strong> {data.rank ?? "N/A"}
      </li>
      <li>
        <strong>Abs Freq:</strong> {data.freq ?? "N/A"}
      </li>
      <li>
        <strong>Cum Freq:</strong> {data.cumFreq ?? "N/A"}
      </li>
      <li>
        <strong>Tone #:</strong> {data.num}
      </li>
      <li>
        <strong>Initial:</strong> {data.initial}
      </li>
      <li>
        <strong>Final:</strong> {data.final}
      </li>
      <li>
        <strong>First letter:</strong> {data.first}
      </li>
      <li>
        <strong>Head vowel:</strong> {data.finalHead || "—"}
      </li>
      <li>
        <strong>Body vowel:</strong> {data.finalBody}
      </li>
      <li>
        <strong>Tail:</strong> {data.finalTail || "—"}
      </li>
      <li>
        <strong>Polyphonic:</strong> {data.polyphonic.join(", ")}
      </li>
      <li>
        <strong>IsZh:</strong> {data.isZh ? "Yes" : "No"}
      </li>
    </ul>
    <Link
      href={`https://www.zdic.net/hans/${data.origin}`}
      className="text-blue-500 hover:underline mt-4 block"
      target="_blank"
      rel="noopener noreferrer"
    >{`https://www.zdic.net/hans/${data.origin}`}</Link>
  </div>
);

const PinyinViewer: React.FC = () => {
  const [text, setText] = useState<string>("你好，世界！");
  const [data, setData] = useState<PinyinData[]>([]);
  const [selected, setSelected] = useState<PinyinData | null>(null);

  useEffect(() => {
    // compute pinyin metadata
    const raw = pinyin(text, { type: "all", nonZh: "consecutive" }); //as any[];
    // merge with frequency JSON
    const merged = raw.map((item) => {
      //   console.log("Processing item:", item);
      //   console.log("Frequency data for origin:", item.origin);
      const itemFreq = (freqData as Record<string, FrequencyData>)[item.origin];
      const mergedItem = {
        ...item,
        rank: itemFreq?.rank ?? null,
        freq: itemFreq?.freq ?? null,
        cumFreq: itemFreq?.cumFreq ?? null,
      };
      return mergedItem;
    });
    setData(merged);
    setSelected(null);
  }, [text]);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">
        Chinese → Pinyin + Frequency Explorer
      </h1>

      <textarea
        className="w-full h-24 p-2 border border-gray-300 rounded mb-6 resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div
        style={{ border: "2px dotted green" }}
        className="flex flex-wrap gap-1"
      >
        {data.map((item, i) => {
          //   const hoverBg = clsx("hover:bg-yellow-100", {
          //     "hover:bg-gray-200": item.rank === null,
          //     "hover:bg-red-100": item.rank && item.rank > 100,
          //     "hover:bg-green-100": item.rank && item.rank > 300,
          //     "hover:bg-blue-100": item.rank && item.rank <= 600,
          //   });
          let hoverBg = "bg-yellow-100"; // default

          if (item.rank === null) {
            hoverBg = "bg-gray-200";
          } else if (item.rank > 1000) {
            hoverBg = "bg-gray-200";
          } else if (item.rank > 600) {
            hoverBg = "bg-sky-200";
          } else if (item.rank > 300) {
            hoverBg = "bg-green-200";
          } else if (item.rank > 100) {
            hoverBg = "bg-pink-200";
          }
          return (
            <span
              style={{
                border: "2px dotted red",
              }}
              key={i}
              onClick={() => setSelected(item)}
              title={item.pinyin}
              className={`relative inline-block px-1 py-0.5 text-lg cursor-pointer ${hoverBg} rounded group`}
            >
              {item.origin}
              {false && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-1 py-px rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.pinyin}
                </span>
              )}
            </span>
          );
        })}
      </div>

      {selected && (
        <PinyinPanel data={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

const EarlyPrototypePageV3: NextPage = () => <PinyinViewer />;

export default EarlyPrototypePageV3;
