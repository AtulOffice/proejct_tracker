export const numberToIndianWords = (input) => {
    if (input === null || input === undefined || input === "") return null;

    const cleaned = String(input).replace(/,/g, "");
    if (!/^\d+$/.test(cleaned)) return null;

    const num = Number(cleaned);
    if (!Number.isSafeInteger(num) || num < 0) return null;

    if (num === 0) return "zero";

    const ones = [
        "", "one", "two", "three", "four", "five", "six",
        "seven", "eight", "nine", "ten", "eleven", "twelve",
        "thirteen", "fourteen", "fifteen", "sixteen",
        "seventeen", "eighteen", "nineteen"
    ];

    const tens = [
        "", "", "twenty", "thirty", "forty",
        "fifty", "sixty", "seventy", "eighty", "ninety"
    ];

    const twoDigit = (n) => {
        if (n < 20) return ones[n];
        return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    };

    const scales = [
        { value: 100000000000, name: "kharab" },
        { value: 1000000000, name: "arab" },
        { value: 10000000, name: "crore" },
        { value: 100000, name: "lakh" },
        { value: 1000, name: "thousand" },
    ];

    let result = "";
    let n = num;

    for (const { value, name } of scales) {
        if (n >= value) {
            result += twoDigit(Math.floor(n / value)) + " " + name + " ";
            n %= value;
        }
    }

    if (n >= 100) {
        result += ones[Math.floor(n / 100)] + " hundred ";
        n %= 100;
    }

    if (n > 0) {
        result += twoDigit(n);
    }

    const finalResult = result.trim();

    if (!finalResult || finalResult.includes("undefined") || finalResult.includes("NaN")) {
        return "";
    }

    return finalResult;;
};
