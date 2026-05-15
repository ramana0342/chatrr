export const loginOtpEmailTemplate = ({ otp, name = "Admin" }) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    
    <div style="max-width:500px; margin:auto; background:#fff; padding:20px; border-radius:10px;">

      <h2 style="color:#111;">🔐 Login Verification OTP</h2>

      <p style="font-size:15px; color:#333;">
        Hello <b>${name}</b>,
      </p>

      <p style="font-size:15px; color:#333;">
        Use the following OTP to login to your admin panel:
      </p>

      <div style="
        text-align:center;
        font-size:28px;
        letter-spacing:6px;
        font-weight:bold;
        background:#f0f0f0;
        padding:12px;
        border-radius:8px;
        margin:20px 0;
      ">
        ${otp}
      </div>

      <p style="font-size:13px; color:#777;">
        ⚠️ This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.
      </p>

      <hr />

      <p style="font-size:12px; color:#999;">
        If you didn’t request this, please ignore this email.
      </p>

    </div>
  </div>
  `;
};