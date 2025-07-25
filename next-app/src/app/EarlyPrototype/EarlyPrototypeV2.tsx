"use client";
// data/frequency.json
// (mocked frequency info for a handful of characters)
// {
//   "你": { "rank": 15, "freq": 54321, "cumFreq": 0.0234 },
//   "好": { "rank": 30, "freq": 32100, "cumFreq": 0.0456 },
//   "世": { "rank": 85, "freq": 12000, "cumFreq": 0.0912 },
//   "界": { "rank": 90, "freq": 11500, "cumFreq": 0.1023 },
//   "，": { "rank": null, "freq": null, "cumFreq": null },
//   "！": { "rank": null, "freq": null, "cumFreq": null }
// }

// pages/pinyin.tsx
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { pinyin } from "pinyin-pro";
import freqData from "@/data/frequency.json";

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
  // frequency fields
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
        <strong>Frequency Rank:</strong> {data.rank ?? "N/A"}
      </li>
      <li>
        <strong>Absolute Frequency:</strong> {data.freq ?? "N/A"}
      </li>
      <li>
        <strong>Cumulative Frequency:</strong> {data.cumFreq ?? "N/A"}
      </li>
      <li>
        <strong>Tone (num):</strong> {data.num}
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
        <strong>Polyphonic:</strong> {data.polyphonic.join(", ")}
      </li>
    </ul>
  </div>
);

const PinyinViewer: React.FC = () => {
  const [text, setText] = useState("你好，世界！");
  const [data, setData] = useState<PinyinData[]>([]);
  const [selected, setSelected] = useState<PinyinData | null>(null);

  useEffect(() => {
    // generate pinyin metadata
    const raw = pinyin(text, { type: "all", nonZh: "consecutive" }) as any[];
    // merge with frequency data
    const merged: PinyinData[] = raw.map((item) => ({
      ...item,
      rank: freqData[item.origin]?.rank ?? null,
      freq: freqData[item.origin]?.freq ?? null,
      cumFreq: freqData[item.origin]?.cumFreq ?? null,
    }));
    setData(merged);
    setSelected(null);
  }, [text]);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Pinyin + Frequency Explorer</h1>
      <textarea
        // className="w-full h-24 p-2 border rounded mb-6"
        className="w-full h-24 p-2 border border-gray-300 rounded mb-6 resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex flex-wrap gap-1">
        {data.map((item, i) => (
          <span
            key={i}
            onClick={() => setSelected(item)}
            title={`Freq: ${item.freq ?? "N/A"}`}
            className="inline-block px-1 py-0.5 text-lg cursor-pointer hover:bg-yellow-100 rounded"
          >
            {item.origin}
          </span>
        ))}
      </div>
      {selected && (
        <PinyinPanel data={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

const EarlyPrototypePageV2: NextPage = () => <PinyinViewer />;

export default EarlyPrototypePageV2;
