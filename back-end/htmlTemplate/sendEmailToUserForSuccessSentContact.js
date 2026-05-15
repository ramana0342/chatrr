export const htmlTemplateForUserSuccessSentContact = (data) => {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height:1.6; color:#333;">
      
      <h2 style="color: #2c3e50;">Thank You for Reaching Out 🙌</h2>

      <p>Hi <b>${data.name}</b>,</p>

      <p>
        Thank you for contacting me through my <b>Portfolio Website</b>.
        I’ve received your message successfully and will review it shortly.
      </p>

      <p>
        I’ll get back to you as soon as possible.
      </p>

      <div style="margin-top: 20px;">
        <p><b>Your Message:</b></p>
        <div style="background:#f4f6f8; padding:12px; border-radius:6px; border:1px solid #eee;">
          ${data.message}
        </div>
      </div>

      <div style="margin-top:20px;"></div>

      <p>
        Best regards,<br/>
        <b>Ramana Reddy</b><br/>
      </p>

      <p>
        <a href="https://ramana-portfolio-eight.vercel.app/" 
           style="color:#007bff; text-decoration:none;">
           Visit My Portfolio
        </a>
      </p>

      <hr style="margin:20px 0;" />

      <p style="font-size:12px; color:gray;">
        You are receiving this email because you submitted a contact form on my portfolio website.
      </p>

      <p style="font-size:12px; color:gray;">
        This is an automated confirmation email. If you have additional queries, please reach out through the website.
      </p>

    </div>
  `;
};