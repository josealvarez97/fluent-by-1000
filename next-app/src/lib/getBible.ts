// /data/bible.json
// (your large JSON blob)

// /lib/getBible.ts
import bibleData from "@/storage/ChiSB.json";
import type { Bible } from "@/types/bible";

export function getBible(): Bible {
  return bibleData as Bible;
}
