const StudentUser = require("../models/StudentUser");
const emailClasses = {
  SEND_CONFIRMATION_EMAIL: require("../email/confirmationEmail"),
  SEND_COURSE_EMAIL: require("../email/courseEmail"),
};

const sendEmail = async ({ emailType, emailData }) => {
  const EmailClass = emailClasses[emailType];
  const emailInstance = new EmailClass(emailData);
  emailInstance.sendEmail();
  console.log("successfully sent email");
};

const sendEmailToMultipleUser = async ({ BatchId, emailType }) => {
  try {
    const allUsers = await StudentUser.find({
      batchEnrolled: { $in: [BatchId] },
    })
      .select("fullName email batchEnrolled")
      .populate({
        path: "batchEnrolled",
        select: "subject",
        populate: {
          path: "subject.teacher",
          select: "fullName",
        },
      });

    console.log(`Found ${allUsers.length} users to send emails.`);

    const batchSize = 10;
    for (let i = 0; i < allUsers.length; i += batchSize) {
      const batch = allUsers.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (user) => {
          const subject = user.batchEnrolled[0].subject;

          await sendEmail({
            emailType,
            emailData: {
              recipientName: user.fullName,
              recipientEmail: user.email,
              teacherName: subject.teacher.fullName,
              courseTitle: subject.courseName,
            },
          });
        })
      );
      console.log(`Batch of ${batchSize} emails sent.`);
    }
  } catch (error) {
    console.error("Error in sending emails to multiple users:", error);
  }
};

module.exports = { sendEmail, sendEmailToMultipleUser };
