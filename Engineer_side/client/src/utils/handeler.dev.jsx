import { calculateConsumedDays } from "./calcDays";

export const handleDocumentRowChange = (rowIndex, newRowData, setFormData) => {
    const updatedRow = {
        ...newRowData,
        daysConsumed: calculateConsumedDays(newRowData.startDate, newRowData.endDate)
    };
    setFormData(prev => ({
        ...prev,
        document: {
            ...prev.document,
            rows: prev.document.rows.map((row, index) =>
                index === rowIndex ? updatedRow : row
            )
        }
    }));
};


export const handleScreenRowChange = (rowIndex, newRowData, setFormData) => {
    const updatedRow = {
        ...newRowData,
        daysConsumed: calculateConsumedDays(newRowData.startDate, newRowData.endDate)
    };
    setFormData(prev => ({
        ...prev,
        screen: {
            ...prev.screen,
            rows: prev.screen.rows.map((row, index) =>
                index === rowIndex ? updatedRow : row
            )
        }
    }));
};

export const handleLogicRowChange = (rowIndex, newRowData, setFormData) => {
    const updatedRow = {
        ...newRowData,
        daysConsumed: calculateConsumedDays(newRowData.startDate, newRowData.endDate)
    };
    setFormData(prev => ({
        ...prev,
        logic: {
            ...prev.logic,
            rows: prev.logic.rows.map((row, index) =>
                index === rowIndex ? updatedRow : row
            )
        }
    }));
};


export const handleTestingRowChange = (rowIndex, newRowData, setFormData) => {
    const updatedRow = {
        ...newRowData,
        daysConsumed: calculateConsumedDays(newRowData.startDate, newRowData.endDate)
    };
    setFormData(prev => ({
        ...prev,
        testing: {
            ...prev.testing,
            rows: prev.testing.rows.map((row, index) =>
                index === rowIndex ? updatedRow : row
            )
        }
    }));
};

export const handleProjectRowChange = (rowIndex, newRowData, setFormData) => {
    const updatedRow = {
        ...newRowData,
        daysConsumed: calculateConsumedDays(newRowData.startDate, newRowData.endDate)
    };
    setFormData(prev => ({
        ...prev,
        project: {
            ...prev.logic,
            rows: prev.project.rows.map((row, index) =>
                index === rowIndex ? updatedRow : row
            )
        }
    }));
};
