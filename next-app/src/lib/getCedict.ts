// https://chatgpt.com/c/68849065-53c8-832d-88aa-bf20a0deb31e
import Cedict from "@tykok/cedict-dictionary";

export async function getDefinition(char: string) {
  // Search for this exact simplified/traditional character
  const result = Cedict.getByTraditional(char);

  return result;
}
