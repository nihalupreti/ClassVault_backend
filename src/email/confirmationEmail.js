const BaseEmail = require("./baseEmail");

class ConfirmationEmail extends BaseEmail {
  constructor({ recipientName, recipientEmail, confirmationLink }) {
    super();
    this.name = "SEND_CONFIRMATION_EMAIL";
    this.emailData = {
      recipientName,
      recipientEmail,
      confirmationLink,
    };
  }

  async getNodeMailerPayload() {
    const { recipientName, recipientEmail, confirmationLink } = this.emailData;

    return {
      to: `${recipientName} <${recipientEmail}>`,
      from: `"ClassVault" <${process.env.EMAIL}>`,
      subject: "Confirm Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Confirm Your Email</h2>
          <p style="color: #555;">Hello <strong>${recipientName}</strong>,</p>
          <p style="color: #555;">Thank you for signing up. Please click the button below to confirm your account:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${confirmationLink}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Confirm Email</a>
          </div>
          <p style="color: #555;">Or you can copy and paste the following link into your browser:</p>
          <p><a href="${confirmationLink}" style="word-break: break-all; color: #007bff;">${confirmationLink}</a></p>
          <p style="color: #555;">Best regards,<br><strong>ClassVault Team</strong></p>
        </div>
      `,
    };
  }
}

module.exports = ConfirmationEmail;
