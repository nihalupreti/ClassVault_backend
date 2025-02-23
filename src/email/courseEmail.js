const BaseEmail = require("./baseEmail");
const { assignmentEmail, enrollEmail, updateEmail } = require("./emailBody");

class CourseEmail extends BaseEmail {
  constructor({
    recipientName,
    recipientEmail,
    teacherName,
    courseTitle,
    purpose,
    assignmentTitle,
    dueDate,
  }) {
    super();
    this.name = "SEND_COURSE_EMAIL";
    this.emailData = {
      recipientName,
      recipientEmail,
      teacherName,
      courseTitle,
      purpose,
      assignmentTitle, // Added
      dueDate, // Added
    };
  }

  async getNodeMailerPayload() {
    const {
      recipientName,
      recipientEmail,
      teacherName,
      courseTitle,
      purpose,
      assignmentTitle,
      dueDate,
    } = this.emailData;

    const emailTemplates = {
      enroll: enrollEmail,
      assignment: assignmentEmail,
      update: updateEmail,
    };

    const generateEmail = emailTemplates[purpose]; // Get the function

    if (!generateEmail) {
      throw new Error("Invalid email purpose");
    }

    return {
      to: `${recipientName} <${recipientEmail}>`,
      from: `"ClassVault" <${process.env.EMAIL}>`,
      subject: "Course Notification",
      html: generateEmail({
        recipientName,
        teacherName,
        courseTitle,
        assignmentTitle,
        dueDate,
      }),
    };
  }
}

module.exports = CourseEmail;
