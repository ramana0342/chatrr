export const htmlTemplateForSendEmailUserMessageToAdmin = (data) => {
  return `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color: #333;">New Contact Message From Ramana Portfolio</h2>
      
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Mobile:</b> ${data.mobile}</p>
      
      <div style="margin-top: 15px;">
        <p><b>Message:</b></p>
        <p style="background:#f4f4f4; padding:10px; border-radius:5px;">
          ${data.message}
        </p>
      </div>

      <hr />
      <p style="font-size:12px; color:gray;">
        This message was sent from your portfolio website.
      </p>
    </div>
  `;
};