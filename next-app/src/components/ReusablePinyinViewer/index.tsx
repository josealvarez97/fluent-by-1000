// pages/pinyin.tsx
"use client";
import React, { useState, useEffect } from "react";
// import type { NextPage } from "next";
import { pinyin } from "pinyin-pro";
import freqData from "@/data/frequency.json";
// import clsx from "clsx";
import Link from "next/link";
import { ChineseWord } from "@tykok/cedict-dictionary";

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
  // extra fields for definitions from cedict api
  definitions?: ChineseWord[]; // optional, may not always be present
}
interface FrequencyData {
  rank: number | null;
  freq: number | null;
  cumFreq: number | null;
}

const PinyinPanel: React.FC<{
  data: PinyinData;
  sentence: string;
  onClose: () => void;
}> = ({ data, sentence, onClose }) => {
  const [aiAnswer, setAiAnswer] = useState<string>("");
  const [loadingAnswer, setLoadingAnswer] = useState<boolean>(false);

  useEffect(() => {
    if (!data.origin) return;
    setAiAnswer(""); // reset any previous answer
    setLoadingAnswer(true);

    const controller = new AbortController(); // to allow aborting if needed
    async function fetchAIExplanation() {
      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sentence, char: data.origin }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          throw new Error(`Request failed: ${res.status}`);
        }
        // Stream the response
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          // Decode the received chunk of text
          const chunk = decoder.decode(value || new Uint8Array(), {
            stream: !done,
          });
          // Update state with new content chunk
          if (chunk) {
            setAiAnswer((prev) => prev + chunk);
          }
        }
      } catch (err) {
        console.error("AI fetch error:", err);
      } finally {
        setLoadingAnswer(false);
      }
    }
    fetchAIExplanation();

    // Cleanup: abort fetch if component unmounts or data changes mid-request
    return () => controller.abort();
  }, [data.origin, sentence]);

  return (
    <div
      //   className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-auto"
      className="
      fixed inset-x-0 bottom-0            /* full‑width bottom on mobile */
      max-h-[50vh]                         /* limit to half the screen height */
      lg:max-h-full
      bg-white shadow-lg p-4 overflow-auto
      rounded-t-lg                        /* rounded top corners for a sheet */
      sm:inset-y-0 sm:inset-x-auto sm:right-0 sm:top-0 /* restore right‑side panel on ≥sm */
      sm:w-80 sm:h-full sm:rounded-none            /* desktop dimensions */
    "
    >
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
        {/* <li>
        <strong>Tone #:</strong> {data.num}
      </li> */}
        {/* <li>
        <strong>Initial:</strong> {data.initial}
      </li> */}
        {/* <li>
        <strong>Final:</strong> {data.final}
      </li> */}
        {/* <li>
        <strong>First letter:</strong> {data.first}
      </li> */}
        {/* <li>
        <strong>Head vowel:</strong> {data.finalHead || "—"}
      </li> */}
        {/* <li>
        <strong>Body vowel:</strong> {data.finalBody}
      </li> */}
        {/* <li>
        <strong>Tail:</strong> {data.finalTail || "—"}
      </li> */}
        <li>
          <strong>Polyphonic:</strong> {data.polyphonic.join(", ")}
        </li>
        {/* <li>
        <strong>IsZh:</strong> {data.isZh ? "Yes" : "No"}
      </li> */}
      </ul>
      <Link
        href={`https://www.zdic.net/hans/${data.origin}`}
        className="text-blue-500 hover:underline mt-4 block"
        target="_blank"
        rel="noopener noreferrer"
      >{`https://www.zdic.net/hans/${data.origin}`}</Link>
      <h3 className="mt-4 mb-1 text-sm font-semibold">CEDICT</h3>
      {data.definitions && data.definitions.length > 0 ? (
        <div className="space-y-2">
          {data.definitions.map((def, index) => (
            <div
              key={index}
              className="p-3 rounded-md bg-gray-50 border border-gray-200"
            >
              {/* <div className="text-sm font-bold">CEDICT</div> */}
              <div className="text-sm text-gray-600 italic mb-1">
                {Array.isArray(def.english)
                  ? def.english.join(", ")
                  : def.english}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No definitions available</p>
      )}
      {/* <>{JSON.stringify(data, null, 2)}</> */}
      {/* AI Explanation section starts here */}
      <h3 className="mt-4 mb-1 text-sm font-semibold">AI Explanation</h3>
      <div className="p-3 rounded-md bg-gray-50 border border-gray-200">
        {loadingAnswer && aiAnswer === "" ? (
          <p className="text-sm text-gray-500">Analyzing usage...</p>
        ) : (
          <p className="text-sm text-gray-800 whitespace-pre-line">
            {aiAnswer}
          </p>
        )}
      </div>
    </div>
  );
};

interface ReusablePinyinViewerProps {
  text: string;
}

const ReusablePinyinViewer: React.FC<ReusablePinyinViewerProps> = ({
  text = "你好，世界！", // default text for testing
}) => {
  const [data, setData] = useState<PinyinData[]>([]);
  const [selected, setSelected] = useState<PinyinData | null>(null);

  // This basically works as an initializer when the change
  // never changes in the prop from the parent component
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

  async function handleClick(item: PinyinData) {
    try {
      console.log("Clicked item:", item);
      const res = await fetch(`/api/char/${item.origin}`);
      console.log("Response status (defs):", res.status);
      if (res.ok) {
        const jsonResults = await res.json();
        // attach definitions (adjust depending on API shape)
        console.log("JSON of definitions:", jsonResults);
        item.definitions = jsonResults || [];
      }
      // Dont panic, assume it's empty I guess
      // else {
      //   throw new Error("Failed to fetch definitions");
      // }
    } catch (err) {
      console.error("Error fetching definitions:", err);
    }

    setSelected({ ...item });
  }

  return (
    <div className=" bg-gray-50">
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
              onClick={() => handleClick(item)}
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
        <PinyinPanel
          data={selected}
          sentence={text}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default ReusablePinyinViewer;
