export const mapFrontendToBackend = (formData, JobNumber) => {
  const backend = {
    status: formData.project.rows[0]?.completed || false,
    JobNumber: JobNumber,
    startDate: formData.project.rows[0]?.startDate || "",
    endDate: formData.project.rows[0]?.endDate || "",
    DaysConsumed: formData.project.rows[0]?.daysConsumed || "0",

    fileReading: toBackendObj(formData.document.rows[0]),
    pId: toBackendObj(formData.document.rows[1]),
    systemConfig: toBackendObj(formData.document.rows[2]),
    generalArrangement: toBackendObj(formData.document.rows[3]),
    powerWiring: toBackendObj(formData.document.rows[4]),
    moduleWiring: toBackendObj(formData.document.rows[5]),
    ioList: toBackendObj(formData.document.rows[6]),

    alarm: toBackendBoolObj(formData.screen.rows[1]),
    scadaScreen: [
      {
        scadastartDate: formData.screen.rows[0]?.startDate || "",
        scadaendDate: formData.screen.rows[0]?.endDate || "",
        scadaconsumedDays: formData.screen.rows[0]?.daysConsumed || "0",
        status: formData.screen.rows[0]?.completed || false,
      },
    ],
    Trend: toBackendBoolObj(formData.screen.rows[2]),
    dataLog: toBackendBoolObj(formData.screen.rows[3]),

    aiMapping: toBackendBoolObj(formData.logic.rows[0]),
    aoMapping: toBackendBoolObj(formData.logic.rows[1]),
    diMapping: toBackendBoolObj(formData.logic.rows[2]),
    doMapping: toBackendBoolObj(formData.logic.rows[3]),
    oprationalLogic: toBackendBoolObj(formData.logic.rows[4]),
    moduleStatus: toBackendBoolObj(formData.logic.rows[5]),
    redundencyStatus: toBackendBoolObj(formData.logic.rows[6]),

    rangeSet: toBackendObj(formData.testing.rows[0]),
    ioTesting: toBackendObj(formData.testing.rows[1]),
    alarmTest: toBackendObj(formData.testing.rows[2]),
    trendsTest: toBackendObj(formData.testing.rows[3]),
    operationLogic: toBackendObj(formData.testing.rows[4]),
    moduleStatusTest: toBackendObj(formData.testing.rows[5]),
    dlrStatusTest: toBackendObj(formData.testing.rows[6]),
    redundencyStatusTest: toBackendObj(formData.testing.rows[7]),
    // summary: {}
  };

  return backend;
};

const toBackendObj = (row) => ({
  ...(row?.Reqiredval && { requireMent: row.Reqiredval }),
  ...(row?.title && { title: row.title }),
  startDate: row?.startDate || "",
  endDate: row?.endDate || "",
  consumedDays: row?.daysConsumed || "0",
  status: row?.completed || false,
});

const toBackendBoolObj = (row) => ({
  startDate: row?.startDate || "",
  ...(row?.title && { title: row.title }),
  endDate: row?.endDate || "",
  consumedDays: row?.daysConsumed || "0",
  status: row?.completed || false,
});
