export const otpHtml = (otp, minutes = 15) => {
  return `
  <div style="background:#f2f4f7;padding:24px 0;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:480px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;">
      <tr>
        <td style="padding:0 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">
            <tr>
              <td style="text-align:center;padding:20px 20px 8px 20px;">
                <div style="font-size:18px;line-height:24px;color:#1f2937;">🔐 VERIFICATION CODE</div>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;padding:0 24px 8px 24px;">
                <p style="margin:0;font-size:14px;line-height:20px;color:#374151;">
                  Use the following One-Time Password (OTP) to continue.
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;padding:8px 24px 16px 24px;">
                <span style="display:inline-block;font-size:28px;line-height:36px;font-weight:700;letter-spacing:3px;color:#1d4ed8;background:#eef2ff;padding:10px 20px;border-radius:6px;">
                  ${otp}
                </span>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;padding:0 24px 20px 24px;">
                <p style="margin:0;font-size:12px;line-height:18px;color:#6b7280;">
                  This code will expire in <span style="color:#dc2626;font-weight:600;">${minutes} minutes</span>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;padding:0 24px 20px 24px;">
                <p style="margin:0;font-size:12px;line-height:18px;color:#9ca3af;">
                  If this was't requested, it can be safely ignored.
                </p>
              </td>
            </tr>
          </table>
          <div style="text-align:center;margin-top:12px;color:#9ca3af;font-size:11px;line-height:16px;">
            Do not forward or share this code.
          </div>
        </td>
      </tr>
    </table>
  </div>`;
};
