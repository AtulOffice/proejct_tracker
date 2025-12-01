export const calculateConsumedDays = (startDate, endDate) => {
    if (!startDate || !endDate) return "0";

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end) || end < start) return "0";

    const diffMs = end - start;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;

    return diffDays.toString();
};