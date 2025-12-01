import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 9,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
    color: "#1e40af",
  },
  tableContainer: {
    border: "1 solid #cbd5e1",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e7ff",
    borderBottom: "1 solid #cbd5e1",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e5e7eb",
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontWeight: "bold",
  },
  engineerCell: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontWeight: "bold",
    backgroundColor: "#eef2ff",
  },
  dayCell: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    textAlign: "center",
    wordWrap: "break-word",
  },
  footer: {
    marginTop: 10,
    fontSize: 8,
    textAlign: "center",
    color: "#6b7280",
  },
});

const getWeekDaysFromMonday = (weekStart) => {
  const start = new Date(weekStart);
  const day = start.getDay();
  const monday = new Date(start);
  monday.setDate(start.getDate() - ((day + 6) % 7));

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday", 
  ];

  return weekdays.map((weekday, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const dateLabel = d.toLocaleDateString("en-GB").split("/").join("-");

    return `${weekday}\n${dateLabel}`;
  });
};

const prepareTableData = (assignmentsArray) => {
  const days = assignmentsArray.map((d) => d.date);
  const engineerMap = {};

  assignmentsArray.forEach((dayData) => {
    dayData.engineers.forEach((eng) => {
      const name = eng.engineerName || eng.engineerId || "Unknown";
      if (!engineerMap[name]) engineerMap[name] = {};
      engineerMap[name][dayData.date] = eng.projectName
        ? `${eng.projectName} (${eng.jobNumber || "-"})`
        : eng.tasks || "-";
    });
  });

  const engineers = Object.keys(engineerMap);
  return { days, engineers, engineerMap };
};

const AssignmentsPDF = ({ assignmentsArray, weekData }) => {
  const { days, engineers, engineerMap } = prepareTableData(assignmentsArray);
  const weekDays = getWeekDaysFromMonday(weekData?.weekStart);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>
          Weekly Assignments —{" "}
          {weekData?.weekStart
            ? new Date(weekData.weekStart).toLocaleDateString("en-GB")
            : ""}
        </Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 1.2 }]}>Engineer</Text>
            {weekDays.map((day, idx) => (
              <Text key={idx} style={styles.headerCell}>
                {day}
              </Text>
            ))}
          </View>
          {engineers.map((eng, eIdx) => (
            <View key={eIdx} style={styles.tableRow}>
              <Text style={[styles.engineerCell, { flex: 1.2 }]}>{eng}</Text>
              {days.map((day, dIdx) => (
                <Text key={dIdx} style={styles.dayCell}>
                  {engineerMap[eng][day] || "-"}
                </Text>
              ))}
            </View>
          ))}
        </View>
        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString("en-GB")}
        </Text>
      </Page>
    </Document>
  );
};

export default AssignmentsPDF;
