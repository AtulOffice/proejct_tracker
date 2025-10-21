export const mapBackendToFrontend = (backend) => {
  return {
    project: {
      rows: [
        {
          JobNumber: backend.JobNumber || "",
          projectName: backend.projectName || "",
          startDate: backend.startDate || "",
          endDate: backend.endDate || "",
          daysConsumed: backend.DaysConsumed || "0",
          completed: backend.status || false,
        },
      ],
    },
    document: {
      rows: [
        fromBackendObj(backend.fileReading),
        fromBackendObj(backend.pId),
        fromBackendObj(backend.systemConfig),
        fromBackendObj(backend.generalArrangement),
        fromBackendObj(backend.powerWiring),
        fromBackendObj(backend.moduleWiring),
        fromBackendObj(backend.ioList),
      ],
    },
    screen: {
      rows: [
        {
          title: backend.scadaScreen?.[0]?.title || "SCREENS",
          startDate: backend.scadaScreen?.[0]?.scadastartDate || "",
          endDate: backend.scadaScreen?.[0]?.scadaendDate || "",
          daysConsumed: backend.scadaScreen?.[0]?.scadaconsumedDays || "0",
          completed: backend.scadaScreen?.[0]?.status || false,
        },
        fromBackendBoolObj(backend.alarm),
        fromBackendBoolObj(backend.Trend),
        fromBackendBoolObj(backend.dataLog),
      ],
    },
    logic: {
      rows: [
        fromBackendBoolObj(backend.aiMapping),
        fromBackendBoolObj(backend.aoMapping),
        fromBackendBoolObj(backend.diMapping),
        fromBackendBoolObj(backend.doMapping),
        fromBackendBoolObj(backend.oprationalLogic),
        fromBackendBoolObj(backend.moduleStatus),
        fromBackendBoolObj(backend.redundencyStatus),
      ],
    },
    testing: {
      rows: [
        fromBackendObj(backend.rangeSet),
        fromBackendObj(backend.ioTesting),
        fromBackendObj(backend.alarmTest),
        fromBackendObj(backend.trendsTest),
        fromBackendObj(backend.operationLogic),
        fromBackendObj(backend.moduleStatusTest),
        fromBackendObj(backend.dlrStatusTest),
        fromBackendObj(backend.redundencyStatusTest),
      ],
    },
  };
};

const fromBackendObj = (row) => ({
  title: row?.title || "",
  Reqiredval: row?.requireMent || "",
  startDate: row?.startDate || "",
  endDate: row?.endDate || "",
  daysConsumed: row?.consumedDays || "0",
  completed: row?.status || false,
});

const fromBackendBoolObj = (row) => ({
  title: row?.title || "",
  startDate: row?.startDate || "",
  endDate: row?.endDate || "",
  daysConsumed: row?.consumedDays || "0",
  completed: row?.status || false,
});
