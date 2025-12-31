export const middleEllipsis = (text, start = 3, end = 3) => {
  if (!text || typeof text !== "string") return "";

  if (text.length <= start + end) return text;

  return `${text.slice(0, start)}...${text.slice(-end)}`;
};
