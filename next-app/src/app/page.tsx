"use client";
// pages/pinyin.tsx
import {
  useState,

  // Fragment
} from "react";
import type { NextPage } from "next";
import { pinyin } from "pinyin-pro";
// import { pinyin } from "pinyin‑pro";

// match the library’s AllData interface
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
}

const PinyinPanel: React.FC<{
  data: PinyinData;
  onClose: () => void;
}> = ({ data, onClose }) => (
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
        <strong>Head vowel:</strong> {data.finalHead || "—"}
      </li>
      <li>
        <strong>Body vowel:</strong> {data.finalBody}
      </li>
      <li>
        <strong>Tail:</strong> {data.finalTail || "—"}
      </li>
      <li>
        <strong>Polyphonic readings:</strong> {data.polyphonic.join(", ")}
      </li>
      <li>
        <strong>Is Chinese?</strong> {data.isZh ? "Yes" : "No"}
      </li>
    </ul>
  </div>
);

const PinyinViewer: React.FC = () => {
  const [text, setText] = useState<string>("你好，世界！");
  const [data, setData] = useState<PinyinData[]>(
    () => pinyin(text, { type: "all", nonZh: "consecutive" }) as PinyinData[]
  );
  const [selected, setSelected] = useState<PinyinData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setText(v);
    setData(pinyin(v, { type: "all", nonZh: "consecutive" }) as PinyinData[]);
    setSelected(null);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Chinese → Pinyin Explorer</h1>
      <textarea
        className="w-full h-24 p-2 border border-gray-300 rounded mb-6 resize-none"
        value={text}
        onChange={handleChange}
      />
      <div className="flex flex-wrap gap-1">
        {data.map((item, i) => (
          <span
            key={i}
            onClick={() => setSelected(item)}
            title={item.pinyin}
            className="relative inline-block px-1 py-0.5 text-lg cursor-pointer
                       hover:bg-yellow-100 rounded group"
          >
            {item.origin}
            <span
              className="absolute -top-6 left-1/2 -translate-x-1/2
                             bg-black text-white text-xs px-1 py-px rounded
                             opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {item.pinyin}
            </span>
          </span>
        ))}
      </div>

      {selected && (
        <PinyinPanel data={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

const Page: NextPage = () => <PinyinViewer />;

export default Page;
