export const validateFormData = (formData) => {
    let isValid = true;

    const checkRow = (row, isProject = false, isTime = true) => {
        if (!row) return true;

        const { startDate, endDate, daysConsumed, completed } = row;

        if (isProject && !startDate) {
            isValid = false;
            return false;
        }

        if (isTime && (startDate && endDate && new Date(endDate) < new Date(startDate))) {
            isValid = false;
            return false;
        }

        if (isTime && completed) {
            if (!startDate || !endDate || !daysConsumed || daysConsumed === "0") {
                isValid = false;
                return false;
            }
        }

        return true;
    };

    checkRow(formData.project.rows?.[0], true);
    formData.document.rows.forEach(row => checkRow(row));
    formData.screen.rows.forEach(row => checkRow(row));
    formData.logic.rows.forEach(row => checkRow(row));
    formData.testing.rows.forEach(row => checkRow(row, false, false));
    return isValid;
};