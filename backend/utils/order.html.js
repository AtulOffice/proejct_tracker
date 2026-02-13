export const newOrderCreatedHtml = (orderDetails = {}) => {
  const {
    jobNumber,
    entityType,
    soType,
    client,
    orderNumber,
    orderDate,
    orderValueTotal,
    status,
    createdBy,
    bookingDate
  } = orderDetails;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : null;

  const formatCurrency = (amount) =>
    typeof amount === "number"
      ? `₹${amount.toLocaleString("en-IN")}`
      : null;

  const row = (label, value, isHtml = false) => {
    if (value === undefined || value === null || value === "") return "";
    return `
      <div class="detail-row">
        <div class="detail-label">${label}</div>
        <div class="detail-value">${isHtml ? value : String(value)}</div>
      </div>
    `;
  };

  const createdByName =
    typeof createdBy === "object"
      ? createdBy?.name || createdBy?.email || null
      : createdBy;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    line-height: 1.6;
    color: #1f2937;
    margin: 0;
    padding: 0;
    background-color: #f8fafc;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }

  .header {
    background-color: #047857;
    color: white;
    padding: 35px 25px;
    text-align: center;
  }

  .header h2 {
    margin: 0;
    font-size: 22px;
  }

  .content {
    padding: 30px 25px;
  }

  .order-card {
    background: #f8fafc;
    padding: 25px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    margin-bottom: 25px;
  }

  .detail-row {
    display: grid;
    grid-template-columns: 160px 1fr;
    padding: 14px 0;
    border-bottom: 1px solid #e2e8f0;
    column-gap: 25px;
    align-items: center;
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-label {
    font-weight: 600;
    color: #64748b;
    font-size: 14px;
  }

  .detail-value {
    color: #1f2937;
    font-weight: 500;
    font-size: 14px;
    word-break: break-word;
  }

  .amount-highlight {
    font-size: 20px;
    font-weight: 700;
    color: #dc2626;
  }

  .created-by {
    background: #3b82f6;
    color: white;
    padding: 18px;
    border-radius: 12px;
    text-align: center;
    margin-top: 20px;
  }

  .footer {
    text-align: center;
    padding: 20px;
    color: #64748b;
    font-size: 13px;
    border-top: 1px solid #e2e8f0;
  }

  .note-box {
    background: #fef3c7;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
  }
</style>
</head>

<body>
  <div class="container">

    <div class="header">
      <h2>🎉 New Order Created</h2>
    </div>

    <div class="content">

      <div class="order-card">
        ${row("Job Number", `<strong>${jobNumber}</strong>`, true)}
        ${row("Order Number", orderNumber)}
        ${row("Entity Type", entityType)}
        ${row("SO Type", soType)}
        ${row("Client", client)}
        ${row("Order Date", formatDate(orderDate))}
        ${row("Booking Date", formatDate(bookingDate))}
        ${row(
    "Order Value",
    `<span class="amount-highlight">${formatCurrency(orderValueTotal)}</span>`,
    true
  )}
      </div>

      ${createdByName
      ? `
        <div class="created-by">
          <div style="font-size:13px;">Created By</div>
          <div style="font-size:17px; font-weight:700;">${createdByName}</div>
        </div>
      `
      : ""
    }

      <div class="note-box">
        <strong>👉 Please review the order details and take necessary actions.</strong>
      </div>

    </div>

    <div class="footer">
      <p>This is an automated notification. Please do not reply to this email.</p>
      <p>© ${new Date().getFullYear()} Your Company Name</p>
    </div>

  </div>
</body>
</html>
`;
};



export const newOrderCreatedText = (orderDetails) => {
  const {
    jobNumber,
    entityType,
    soType,
    client,
    orderNumber,
    orderDate,
    orderValueTotal,
    status,
    createdBy,
    bookingDate
  } = orderDetails;

  return `🎉 NEW ORDER CREATED 🎉

Your order has been successfully processed!

📋 ORDER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Job Number: ${jobNumber}
${orderNumber ? `Order Number: ${orderNumber}\n` : ''}
Entity Type: ${entityType}
SO Type: ${soType}
Client: ${client}
${orderDate ? `Order Date: ${new Date(orderDate).toLocaleDateString('en-IN')}\n` : ''}
${bookingDate ? `Booking Date: ${new Date(bookingDate).toLocaleDateString('en-IN')}\n` : ''}
Order Value: ₹${orderValueTotal ? orderValueTotal.toLocaleString('en-IN') : '0'}
Status: ${status || 'OPEN'}

${createdBy ? `👤 Created By: ${createdBy}\n` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👉 Please review the order details and take necessary actions.

This is an automated notification.
`;
};
