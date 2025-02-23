exports.assignmentEmail = ({
  recipientName,
  teacherName,
  courseTitle,
  assignmentTitle,
  dueDate,
}) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <h2 style="color: #333; text-align: center;">New Assignment Assigned</h2>
  <p style="color: #555;">Hello <strong>${recipientName}</strong>,</p>
  
  <p style="color: #555;">
    Your instructor, <strong>${teacherName}</strong>, has assigned a new assignment for <strong>${courseTitle}</strong>.
  </p>

  <p style="color: #555;"><strong>Assignment Title:</strong> ${assignmentTitle}</p>
  <p style="color: #555;"><strong>Due Date:</strong> ${dueDate}</p>

  <p style="color: #555;">
    Please make sure to complete and submit the assignment before the deadline.
    You can find more details in your course portal.
  </p>

  <p style="color: #555;">If you have any questions, feel free to reach out to your instructor.</p>

  <p style="color: #555;">Best regards,<br><strong>ClassVault Team</strong></p>
</div>
`;

exports.enrollEmail = ({ recipientName, courseTitle, teacherName }) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <h2 style="color: #333; text-align: center;">Enrollment Confirmation</h2>
  <p style="color: #555;">Hello <strong>${recipientName}</strong>,</p>
  
  <p style="color: #555;">
    You have been enrolled in <strong>${courseTitle}</strong> by <strong>${teacherName}</strong>.
  </p>

  <p style="color: #555;">If you have any questions, please contact your instructor.</p>

  <p style="color: #555;">Best regards,<br><strong>ClassVault Team</strong></p>
</div>
`;

exports.updateEmail = ({ recipientName, teacherName, courseTitle }) => `
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
