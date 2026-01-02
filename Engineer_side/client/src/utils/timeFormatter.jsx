export function formatDateDDMMYY(input) {
    if (!input) return "—";

    const date = new Date(input);

    if (isNaN(date.getTime())) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
}
export const calculateDurationInDays = (startDate, endDate, fallback = "—") => {
    if (!startDate || !endDate) return fallback;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) return fallback;

    const diffMs = end - start;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays >= 0 ? diffDays : fallback;
}

export const calculateProgressDays = (startDate, actualEndDate) => {
    if (!startDate) return 0;

    const start = new Date(startDate);
    const end = actualEndDate ? new Date(actualEndDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffMs = end - start;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

export const toInputDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
};


export const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return "—";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};