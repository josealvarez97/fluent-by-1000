import React from "react";
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

const FrequencyPage: React.FC = () => {
  // build a typed array and filter out any null ranks
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
        {freqArray.slice(0, 100).map((item) => (
          <div
            key={item.origin}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center"
          >
            <span className="text-2xl font-bold mb-1">{item.origin}</span>
            <span className="text-sm">Rank {item.rank}</span>
            <span className="text-sm">Freq {item.freq}</span>
            <span className="text-sm">Cum. {item.cumFreq}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrequencyPage;
