export function formatDateDDMMYY(dateInput) {
    if (!dateInput) return "—";

    const date = new Date(dateInput);

    if (isNaN(date)) return "—";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
}
