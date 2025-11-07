// export const handlePrint = (printRef) => {
//   if (!printRef.current) return;

//   const content = printRef.current.innerHTML;

//   // Create hidden iframe
//   const iframe = document.createElement("iframe");
//   iframe.style.position = "absolute";
//   iframe.style.width = "0px";
//   iframe.style.height = "0px";
//   iframe.style.border = "none";
//   document.body.appendChild(iframe);

//   const doc = iframe.contentWindow.document;
//   doc.open();
//   doc.write(`
//     <html>
//       <head>
//         <title>ENGINEER LIST</title>
//         <style>
//           @media print {
//             body {
//               font-family: Arial, sans-serif;
//               margin: 10mm;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//             }
//             th, td {
//               border: 1px solid #333;
//               padding: 6px;
//               text-align: left;
//             }
//             th {
//               background-color: #4f46e5;
//               color: black;
//               font-weight: bold;
//             }
//             tr {
//               page-break-inside: avoid;
//             }
//           }
//         </style>
//       </head>
//       <body>${content}</body>
//     </html>
//   `);
//   doc.close();

//   iframe.contentWindow.focus();
//   iframe.contentWindow.print();

//   setTimeout(() => {
//     document.body.removeChild(iframe);
//   }, 1000);
// };

export const handlePrint = (printRef, printTitle = "") => {
  if (!printRef.current) return;
  const content = printRef.current.outerHTML;
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <html>
      <head>
        <title>${printTitle}</title>
        <style>
          @media print {
            body {
              font-family: Arial, sans-serif;
              margin: 10mm;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #333;
              padding: 6px;
              text-align: left;
            }
            th {
              background-color: #4f46e5;
              color: black;
              font-weight: bold;
            }
            tr {
              page-break-inside: avoid;
            }

            /* ✅ Hide last column (both header & cells) during print */
            th:last-child,
            td:last-child {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `);
  doc.close();

  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
};
