export const middleEllipsis = (text, start = 3, end = 3) => {
  if (!text || typeof text !== "string") return "";

  if (text.length <= start + end) return text;

  return `${text.slice(0, start)}..${text.slice(-end)}`;
};

export const firstNameWithInitial = (text) => {
  if (!text || typeof text !== "string") return "";

  const words = text.trim().split(/\s+/);

  if (words.length === 1) return words[0];

  return `${words[0]} ${words[1][0]}`;
};


export const formatYesNo = (value) => {
  if (value === true || value === 1) return "Y";
  if (value === false || value === 0) return "N";

  if (typeof value === "string") {
    const v = value.trim().toLowerCase();

    if (["yes", "y", "true", "1"].includes(v)) return "Y";
    if (["no", "n", "false", "0"].includes(v)) return "N";
  }

  return "—";
};



export const limitWords = (text, wordLimit = 10) => {
  if (!text || typeof text !== "string") return "";

  const words = text.trim().split(/\s+/);

  if (words.length <= wordLimit) return text;

  return words.slice(0, wordLimit).join(" ") + "...";
};

export const limitText = (text, charLimit = 10) => {
  if (!text || typeof text !== "string") return "";

  if (text.length <= charLimit) return text;

  return text.slice(0, charLimit) + "...";
};

