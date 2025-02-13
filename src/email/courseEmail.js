const BaseEmail = require("./baseEmail");

class CourseEmail extends BaseEmail {
  constructor({
    recipientName,
    recipientEmail,
    teacherName,
    courseTitle,
    purpose,
  }) {
    super();
    this.name = "SEND_COURSE_EMAIL";
    this.emailData = {
      recipientName,
      recipientEmail,
      teacherName,
      courseTitle,
      purpose,
    };
  }

  async getNodeMailerPayload() {
    const { recipientName, recipientEmail, teacherName, courseTitle, purpose } =
      this.emailData;

    const body =
      purpose === "enroll"
        ? `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Enrollment Confirmation</h2>
            <p style="color: #555;">Hello <strong>${recipientName}</strong>,</p>
            
            <p style="color: #555;">
              You have been enrolled in <strong>${courseTitle}</strong> by <strong>${teacherName}</strong>.
            </p>
      
            <p style="color: #555;">If you have any questions, please contact your instructor.</p>
      
            <p style="color: #555;">Best regards,<br><strong>ClassVault Team</strong></p>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Course Update</h2>
            <p style="color: #555;">Hello <strong>${recipientName}</strong>,</p>
            
            <p style="color: #555;">
              Your instructor, <strong>${teacherName}</strong>, has updated the course <strong>${courseTitle}</strong>.
            </p>
      
            <p style="color: #555;">If you have any questions, please contact your instructor.</p>
      
            <p style="color: #555;">Best regards,<br><strong>ClassVault Team</strong></p>
          </div>
        `;

    return {
      to: `${recipientName} <${recipientEmail}>`,
      from: `"ClassVault" <${process.env.EMAIL}>`,
      subject: "Course Notification",
      html: body,
    };
  }
}

module.exports = CourseEmail;
