export const chatEmailTemplate = (data) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="background:#0d6efd; color:#fff; padding:15px 20px;">
        <h2 style="margin:0;">💬 New Chat Message</h2>
      </div>

      <!-- Body -->
      <div style="padding:20px;">
        
        <p style="margin:0 0 10px;"><strong>User Name:</strong> ${data.name}</p>
        <p style="margin:0 0 10px;"><strong>User ID:</strong> ${data.user_id}</p>

        <div style="
          background:#f1f3f5;
          padding:15px;
          border-radius:8px;
          margin-top:15px;
        ">
          <p style="margin:0; font-size:15px;">
            ${data.message}
          </p>
        </div>

        <!-- Button -->
        <div style="margin-top:20px; text-align:center;">
          <a href="https://ramana-portfolio-eight.vercel.app/admin-panel/chat?user_id=${data.user_id}" 
             style="
               display:inline-block;
               padding:10px 20px;
               background:#0d6efd;
               color:#fff;
               text-decoration:none;
               border-radius:6px;
               font-weight:bold;
             ">
             Open Chat
          </a>
        </div>

      </div>

      <!-- Footer -->
      <div style="background:#f8f9fa; padding:15px; text-align:center; font-size:12px; color:#888;">
        Ramana Portfolio • Chat Notification System
      </div>

    </div>
  </div>
  `;
};