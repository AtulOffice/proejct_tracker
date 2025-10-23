// export const handlePrint = (printRef) => {
//   if (!printRef.current) return;
//   const printContent = printRef.current.innerHTML;
//   const newWindow = window.open("", "_blank", "width=800,height=600");
//   newWindow.document.write(`
//     <html>
//       <head>
//         <title>ENGINEER LIST</title>
//         <style>
//           table { width: 100%; border-collapse: collapse; }
//           th, td { border: 1px solid #333; padding: 8px; text-align: left; }
//           th { background-color: #4f46e5; color: #000;font-weight: bold; }
//         </style>
//       </head>
//       <body>${printContent}</body>
//     </html>
//   `);
//   newWindow.document.close();
//   newWindow.print();
// };
export const handlePrint = (printRef) => {
  if (!printRef.current) return;

  const printContent = printRef.current.innerHTML;
  const newWindow = window.open("", "_blank", "width=900,height=700");

  newWindow.document.write(`
    <html>
      <head>
        <title>ENGINEER LIST</title>
        <style>
          @page {
            size: A4;
            margin: 10mm; 
          }
          body {
            width: 100%;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          table {
            width: 100% !important;
            border-collapse: collapse;
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #4f46e5;
            color:black;
            font-weight: bold;
          }
          div {
            overflow: visible !important;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

  newWindow.document.close();

  newWindow.onload = () => {
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };
};
