export const upCommingReminderHtml = ({
  engineerName,
  projectName,
  sectionName,
  phaseStartDate,
  phaseEndDate,
  sectionType
}) => {

  const formatDateDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return `
  <div style="background:linear-gradient(135deg,#0f1923 0%,#1a2b3c 100%);padding:36px 0;min-height:100%;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
      style="max-width:520px;margin:0 auto;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
      <tr>
        <td style="padding:0 16px;">

          <!-- CARD -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
            style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.4);">

            <!-- HEADER BAND -->
            <tr>
              <td style="background:linear-gradient(135deg,#1a2b3c 0%,#0f1923 100%);padding:28px 28px 24px 28px;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td>
                      <div style="display:inline-block;background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.35);border-radius:20px;padding:4px 12px;margin-bottom:12px;">
                        <span style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:#fbbf24;text-transform:uppercase;">Upcoming Reminder</span>
                      </div>
                      <div style="font-size:22px;font-weight:700;color:#111827;line-height:1.3;margin-bottom:4px;">
                     ⏰ ${sectionType}
                       </div>
                      <div style="font-size:13px;color:#94a3b8;">Project phase starting in <strong style="color:#fbbf24;">2 days</strong></div>
                    </td>
                    <td style="text-align:right;vertical-align:top;">
                      <div style="width:48px;height:48px;background:rgba(251,191,36,0.1);border:2px solid rgba(251,191,36,0.3);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-size:22px;line-height:48px;text-align:center;">
                        ⚡
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- AMBER DIVIDER LINE -->
            <tr>
              <td style="padding:0;">
                <div style="height:3px;background:linear-gradient(90deg,#f59e0b,#fbbf24,#fde68a,#fbbf24,#f59e0b);"></div>
              </td>
            </tr>

            <!-- GREETING -->
            <tr>
              <td style="padding:24px 28px 0 28px;">
                <p style="margin:0;font-size:14.5px;color:#374151;line-height:1.7;">
                  Hello <strong style="color:#1a2b3c;">${engineerName}</strong>, this is your scheduled reminder for an upcoming project phase. Please review the details below and ensure everything is on track.
                </p>
              </td>
            </tr>

            <!-- DETAILS BLOCK -->
            <tr>
              <td style="padding:20px 28px;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0"
                  style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">

                  <!-- Project Row -->
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width:14px;vertical-align:middle;">
                            <div style="width:8px;height:8px;background:#fbbf24;border-radius:50%;"></div>
                          </td>
                          <td style="padding-left:10px;">
                            <div style="font-size:10px;font-weight:700;letter-spacing:1px;color:#9ca3af;text-transform:uppercase;margin-bottom:2px;">Project</div>
                            <div style="font-size:14px;font-weight:600;color:#111827;">${projectName}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Section Row -->
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width:14px;vertical-align:middle;">
                            <div style="width:8px;height:8px;background:#60a5fa;border-radius:50%;"></div>
                          </td>
                          <td style="padding-left:10px;">
                            <div style="font-size:10px;font-weight:700;letter-spacing:1px;color:#9ca3af;text-transform:uppercase;margin-bottom:2px;">Section</div>
                            <div style="font-size:14px;font-weight:600;color:#111827;">${sectionName}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Phase Duration Row -->
                  <tr>
                    <td style="padding:14px 16px;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width:14px;vertical-align:middle;">
                            <div style="width:8px;height:8px;background:#34d399;border-radius:50%;"></div>
                          </td>
                          <td style="padding-left:10px;">
                            <div style="font-size:10px;font-weight:700;letter-spacing:1px;color:#9ca3af;text-transform:uppercase;margin-bottom:6px;">Phase Duration</div>
                            <table cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <td style="background:#dbeafe;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;color:#1d4ed8;">${formatDateDDMMYYYY(phaseStartDate)}</td>
                                <td style="padding:0 8px;color:#9ca3af;font-size:13px;">→</td>
                                <td style="background:#dcfce7;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;color:#15803d;">${formatDateDDMMYYYY(phaseEndDate)}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- CTA NOTE -->
            <tr>
              <td style="padding:0 28px 24px 28px;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0"
                  style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1px solid #fde68a;border-radius:10px;">
                  <tr>
                    <td style="padding:12px 16px;">
                      <table cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="font-size:16px;vertical-align:middle;padding-right:10px;">📋</td>
                          <td style="font-size:13px;color:#92400e;line-height:1.5;">
                            Please review the phase details and ensure all required documents are collected and understood before the phase begins
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
          <!-- END CARD -->

          <!-- FOOTER -->
          <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;">
            <tr>
              <td style="text-align:center;padding:0 16px;">
                <div style="height:1px;background:rgba(255,255,255,0.1);margin-bottom:16px;"></div>
                <p style="margin:0 0 4px 0;font-size:11px;color:#64748b;letter-spacing:0.3px;">This is an automated notification — please do not reply.</p>
                <p style="margin:0;font-size:11px;color:#475569;font-weight:600;letter-spacing:0.5px;">© ${new Date().getFullYear()} SI ENERGY VENTURES PVT. LTD.</p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </div>
  `;
};


export const progressReminderHtml = ({
  engineerName,
  projectName,
  sectionName,
  phaseStartDate,
  phaseEndDate,
  completion,
  sectionType
}) => {

  const formatDateDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getCompletionColor = (pct) => {
    if (pct >= 75) return { bg: '#dcfce7', text: '#15803d', bar: '#22c55e' };
    if (pct >= 40) return { bg: '#fef9c3', text: '#a16207', bar: '#eab308' };
    return { bg: '#fee2e2', text: '#b91c1c', bar: '#ef4444' };
  };

  const colors = getCompletionColor(Number(completion));

  return `
  <div style="background:linear-gradient(135deg,#0f1923 0%,#1a2b3c 100%);padding:36px 0;min-height:100%;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
      style="max-width:520px;margin:0 auto;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
      <tr>
        <td style="padding:0 16px;">

          <!-- CARD -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
            style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.4);">

            <!-- HEADER BAND -->
            <tr>
              <td style="background:linear-gradient(135deg,#1a2b3c 0%,#0f1923 100%);padding:28px 28px 24px 28px;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td>
                      <div style="display:inline-block;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.35);border-radius:20px;padding:4px 12px;margin-bottom:12px;">
                        <span style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:#f87171;text-transform:uppercase;">Action Required</span>
                      </div>
                      <div style="font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;margin-bottom:4px;">
                        📊 Progress Update Reminder — ${sectionType}
                      </div>
                      <div style="font-size:13px;color:#94a3b8;">No update logged in the last <strong style="color:#f87171;">2+ days</strong></div>
                    </td>
                    <td style="text-align:right;vertical-align:top;">
                      <div style="width:48px;height:48px;background:rgba(239,68,68,0.1);border:2px solid rgba(239,68,68,0.3);border-radius:12px;font-size:22px;line-height:48px;text-align:center;">
                        🔔
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- RED DIVIDER LINE -->
            <tr>
              <td style="padding:0;">
                <div style="height:3px;background:linear-gradient(90deg,#dc2626,#f87171,#fca5a5,#f87171,#dc2626);"></div>
              </td>
            </tr>

            <!-- GREETING -->
            <tr>
              <td style="padding:24px 28px 0 28px;">
                <p style="margin:0;font-size:14.5px;color:#374151;line-height:1.7;">
                  Hello <strong style="color:#1a2b3c;">${engineerName}</strong>, our records show that the following phase has not had a progress update in over 2 days. Please log in and sync your latest status.
                </p>
              </td>
            </tr>

            <!-- DETAILS BLOCK -->
            <tr>
              <td style="padding:20px 28px 16px 28px;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0"
                  style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">

                  <!-- Project Row -->
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width:14px;vertical-align:middle;">
                            <div style="width:8px;height:8px;background:#fbbf24;border-radius:50%;"></div>
                          </td>
                          <td style="padding-left:10px;">
                            <div style="font-size:10px;font-weight:700;letter-spacing:1px;color:#9ca3af;text-transform:uppercase;margin-bottom:2px;">Project</div>
                            <div style="font-size:14px;font-weight:600;color:#111827;">${projectName}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Section Row -->
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width:14px;vertical-align:middle;">
                            <div style="width:8px;height:8px;background:#60a5fa;border-radius:50%;"></div>
                          </td>
                          <td style="padding-left:10px;">
                            <div style="font-size:10px;font-weight:700;letter-spacing:1px;color:#9ca3af;text-transform:uppercase;margin-bottom:2px;">Section</div>
                            <div style="font-size:14px;font-weight:600;color:#111827;">${sectionName}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Phase Duration Row -->
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width:14px;vertical-align:middle;">
                            <div style="width:8px;height:8px;background:#34d399;border-radius:50%;"></div>
                          </td>
                          <td style="padding-left:10px;">
                            <div style="font-size:10px;font-weight:700;letter-spacing:1px;color:#9ca3af;text-transform:uppercase;margin-bottom:6px;">Phase Duration</div>
                            <table cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <td style="background:#dbeafe;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;color:#1d4ed8;">${formatDateDDMMYYYY(phaseStartDate)}</td>
                                <td style="padding:0 8px;color:#9ca3af;font-size:13px;">→</td>
                                <td style="background:#dcfce7;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;color:#15803d;">${formatDateDDMMYYYY(phaseEndDate)}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Completion Row -->
                  <tr>
                    <td style="padding:14px 16px;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width:14px;vertical-align:middle;">
                            <div style="width:8px;height:8px;background:${colors.bar};border-radius:50%;"></div>
                          </td>
                          <td style="padding-left:10px;">
                            <div style="font-size:10px;font-weight:700;letter-spacing:1px;color:#9ca3af;text-transform:uppercase;margin-bottom:6px;">Completion</div>
                            <span style="background:${colors.bg};color:${colors.text};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">
                              ${completion}%
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- CTA NOTE -->
            <tr>
              <td style="padding:0 28px 24px 28px;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0"
                  style="background:linear-gradient(135deg,#fff1f2,#fee2e2);border:1px solid #fecaca;border-radius:10px;">
                  <tr>
                    <td style="padding:12px 16px;">
                      <table cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="font-size:16px;vertical-align:middle;padding-right:10px;">⚠️</td>
                          <td style="font-size:13px;color:#991b1b;line-height:1.5;">
                            Please <strong>log in to the system</strong> and update your progress to keep the project timeline on track.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
          <!-- END CARD -->

          <!-- FOOTER -->
          <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;">
            <tr>
              <td style="text-align:center;padding:0 16px;">
                <div style="height:1px;background:rgba(255,255,255,0.1);margin-bottom:16px;"></div>
                <p style="margin:0 0 4px 0;font-size:11px;color:#64748b;letter-spacing:0.3px;">This is an automated notification — please do not reply.</p>
                <p style="margin:0;font-size:11px;color:#475569;font-weight:600;letter-spacing:0.5px;">© ${new Date().getFullYear()} SI ENERGY VENTURES PVT. LTD.</p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </div>
  `;
};

export const ActionReminderHtml = ({
  engineerName,
  projectName,
  sectionName,
  phaseStartDate,
  phaseEndDate,
  sectionType
}) => {

  const formatDateDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return `
  <div style="background:linear-gradient(135deg,#0f1923 0%,#1a2b3c 100%);padding:36px 0;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
      style="max-width:520px;margin:0 auto;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
      <tr>
        <td style="padding:0 16px;">

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
            style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.4);">

            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(135deg,#1a2b3c 0%,#0f1923 100%);padding:28px;">
                <table width="100%">
                  <tr>

                    <td>
                      <div style="display:inline-block;background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.35);border-radius:20px;padding:4px 12px;margin-bottom:12px;">
                        <span style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:#fbbf24;text-transform:uppercase;">
                          Action Required
                        </span>
                      </div>

                      <div style="font-size:22px;font-weight:700;color:#ffffff;margin-bottom:4px;">
                        📊 ${sectionType}
                      </div>

                      <div style="font-size:13px;color:#94a3b8;">
                        No progress update has been submitted yet.
                      </div>

                    </td>

                    <td style="text-align:right;">
                      <div style="width:48px;height:48px;background:rgba(239,68,68,0.1);border:2px solid rgba(239,68,68,0.3);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-size:22px;">
                        ⚠️
                      </div>
                    </td>

                  </tr>
                </table>
              </td>
            </tr>

            <!-- RED LINE -->
            <tr>
              <td>
                <div style="height:3px;background:linear-gradient(90deg,#dc2626,#f87171,#fca5a5,#f87171,#dc2626);"></div>
              </td>
            </tr>

            <!-- MESSAGE -->
            <tr>
              <td style="padding:24px 28px 0 28px;">
                <p style="margin:0;font-size:14.5px;color:#374151;line-height:1.7;">
                  Hello <strong>${engineerName}</strong>, the following phase has started but no progress has been recorded yet.
                  Please review the project details and submit your first update.
                </p>
              </td>
            </tr>

            <!-- DETAILS -->
            <tr>
              <td style="padding:20px 28px 24px 28px;">
                <table width="100%" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">

                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;">
                      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:700;margin-bottom:4px;">
                        Project
                      </div>
                      <div style="font-size:14px;font-weight:600;color:#111827;">
                        ${projectName}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;">
                      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:700;margin-bottom:4px;">
                        Section
                      </div>
                      <div style="font-size:14px;font-weight:600;color:#111827;">
                        ${sectionName}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:14px 16px;">
                      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;font-weight:700;margin-bottom:6px;">
                        Phase Duration
                      </div>

                      <span style="background:#dbeafe;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;color:#1d4ed8;">
                        ${formatDateDDMMYYYY(phaseStartDate)}
                      </span>

                      <span style="padding:0 8px;color:#9ca3af;">→</span>

                      <span style="background:#dcfce7;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;color:#15803d;">
                        ${formatDateDDMMYYYY(phaseEndDate)}
                      </span>

                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- ACTION NOTE -->
            <tr>
              <td style="padding:0 28px 24px 28px;">
                <table width="100%" style="background:#fee2e2;border:1px solid #fecaca;border-radius:10px;">
                  <tr>
                    <td style="padding:12px 16px;font-size:13px;color:#991b1b;">
                      ⚠️ Please <strong>log in to the system</strong> and submit your progress update.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>

          <!-- FOOTER -->
           <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;">
            <tr>
              <td style="text-align:center;padding:0 16px;">
                <div style="height:1px;background:rgba(255,255,255,0.1);margin-bottom:16px;"></div>
                <p style="margin:0 0 4px 0;font-size:11px;color:#64748b;letter-spacing:0.3px;">This is an automated notification — please do not reply.</p>
                <p style="margin:0;font-size:11px;color:#475569;font-weight:600;letter-spacing:0.5px;">© ${new Date().getFullYear()} SI ENERGY VENTURES PVT. LTD.</p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </div>
  `;
};