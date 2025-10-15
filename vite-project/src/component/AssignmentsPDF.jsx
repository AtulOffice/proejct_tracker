import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// === Styles ===
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

// === Helper: Extract Unique Engineers & Days ===
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

// === Main PDF Document ===
const AssignmentsPDF = ({ assignmentsArray, weekData }) => {
  const { days, engineers, engineerMap } = prepareTableData(assignmentsArray);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>
          Weekly Assignments —{" "}
          {weekData?.weekStart
            ? new Date(weekData.weekStart).toLocaleDateString()
            : ""}
        </Text>

        {/* Table */}
        <View style={styles.tableContainer}>
          {/* Header Row */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 1.2 }]}>Engineer</Text>
            {days.map((day, idx) => (
              <Text key={idx} style={styles.headerCell}>
                {day}
              </Text>
            ))}
          </View>

          {/* Engineer Rows */}
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

        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
};

export default AssignmentsPDF;

// // ✅ Define styles
// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: "#f9fafb",
//     padding: 20,
//     fontFamily: "Helvetica",
//     fontSize: 10,
//   },
//   title: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#374151",
//     fontWeight: "bold",
//   },
//   dayContainer: {
//     marginBottom: 15,
//     border: "1 solid #cbd5e1",
//     borderRadius: 6,
//     padding: 8,
//     backgroundColor: "#eef2ff",
//   },
//   dayTitle: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#4338ca",
//     marginBottom: 6,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#e0e7ff",
//     borderBottom: "1 solid #cbd5e1",
//     paddingVertical: 4,
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottom: "1 solid #e5e7eb",
//     paddingVertical: 4,
//   },
//   cell: {
//     flex: 1,
//     paddingHorizontal: 4,
//     wordWrap: "break-word",
//   },
//   headerText: {
//     fontWeight: "bold",
//   },
// });

// // ✅ PDF Document Component
// const AssignmentsPDF = ({ assignmentsArray, weekData }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.title}>
//         Weekly Assignments —{" "}
//         {weekData?.weekStart
//           ? new Date(weekData.weekStart).toLocaleDateString()
//           : ""}
//       </Text>

//       {assignmentsArray.map((day, index) => (
//         <View key={index} style={styles.dayContainer}>
//           <Text style={styles.dayTitle}> {day.date}</Text>

//           {/* Table Header */}
//           <View style={styles.tableHeader}>
//             <Text style={[styles.cell, styles.headerText]}>Engineer</Text>
//             <Text style={[styles.cell, styles.headerText]}>Task</Text>
//             <Text style={[styles.cell, styles.headerText]}>Project</Text>
//             <Text style={[styles.cell, styles.headerText]}>Job No.</Text>
//           </View>

//           {/* Table Rows */}
//           {day.engineers.map((eng, i) => (
//             <View key={i} style={styles.tableRow}>
//               <Text style={styles.cell}>{eng.engineerName}</Text>
//               <Text style={styles.cell}>{eng.tasks || "-"}</Text>
//               <Text style={styles.cell}>{eng.projectName || "-"}</Text>
//               <Text style={styles.cell}>{eng.jobNumber || "-"}</Text>
//             </View>
//           ))}
//         </View>
//       ))}
//     </Page>
//   </Document>
// );

// export default AssignmentsPDF;
