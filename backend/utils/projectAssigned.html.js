export const engineerAssignedHtml = (details = {}) => {
    const {
        engineerName,
        assignedAt,
        durationDays,
        endTime,
        projectName,
        jobNumber,
    } = details;

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString("en-IN") : null;

    const row = (label, value, isHtml = false) => {
        if (!value) return "";
        return `
      <div class="detail-row">
        <div class="detail-label">${label}</div>
        <div class="detail-value">${isHtml ? value : String(value)}</div>
      </div>
    `;
    };

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    background-color: #f8fafc;
    margin: 0;
    padding: 0;
    color: #1f2937;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }

  .header {
    background: #2563eb;
    color: white;
    text-align: center;
    padding: 35px 25px;
  }

  .header h2 {
    margin: 0;
    font-size: 22px;
  }

  .content {
    padding: 30px 25px;
  }

  .card {
    background: #f8fafc;
    padding: 25px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
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
    font-weight: 500;
    font-size: 14px;
    color: #1f2937;
  }

  .highlight {
    font-weight: 700;
    color: #2563eb;
    font-size: 16px;
  }

  .note-box {
    background: #ecfeff;
    padding: 16px;
    border-radius: 10px;
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
  }

  .footer {
    text-align: center;
    padding: 20px;
    font-size: 13px;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
  }
</style>
</head>

<body>

<div class="container">

  <div class="header">
    <h2>🛠 Project Assignment Notification</h2>
  </div>

  <div class="content">

    <p>Hello <strong>${engineerName || "Engineer"}</strong>,</p>

    <p>You have been assigned to the following project:</p>

    <div class="card">
      ${row("Project Name", `<span class="highlight">${projectName}</span>`, true)}
      ${row("Job Number", jobNumber)}
      ${row("Assignment Start Date", formatDate(assignedAt))}
      ${row("Duration (Days)", durationDays)}
      ${row("Expected End Date", formatDate(endTime))}
    </div>

    <div class="note-box">
      👉 Please log in to the system and review your assignment details.
    </div>

  </div>

  <div class="footer">
    <p>This is an automated notification. Please do not reply.</p>
    <p>© ${new Date().getFullYear()} Your Company Name</p>
  </div>

</div>

</body>
</html>
`;
};