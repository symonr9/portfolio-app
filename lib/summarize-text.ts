export function summarizeText(
  value: string,
  { minWords = 60, maxWords = 90 } = {},
) {
  const normalizedValue = value.trim().replace(/\s+/g, " ");
  const words = normalizedValue.split(" ");

  if (words.length <= maxWords) {
    return normalizedValue;
  }

  const sentences =
    normalizedValue.match(/[^.!?]+[.!?]+(?:["”’']?)(?=\s|$)|[^.!?]+$/g) ??
    [normalizedValue];
  const summary: string[] = [];
  let wordCount = 0;

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    const sentenceWords = trimmedSentence.split(/\s+/);

    if (wordCount >= minWords && wordCount + sentenceWords.length > maxWords) {
      break;
    }

    if (wordCount + sentenceWords.length > maxWords) {
      const remainingWords = maxWords - wordCount;
      summary.push(`${sentenceWords.slice(0, remainingWords).join(" ")}…`);
      break;
    }

    summary.push(trimmedSentence);
    wordCount += sentenceWords.length;

    if (wordCount >= minWords) {
      break;
    }
  }

  return summary.join(" ");
}
