const calcCurrentSem = (enrolledYear, enrolledIntake) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;

  if (enrolledIntake !== "spring" && enrolledIntake !== "fall") {
    throw new Error("Invalid enrolledIntake value.");
  }

  const isCurrentSpring = currentMonth >= 1 && currentMonth <= 6;
  const isCurrentFall = currentMonth >= 7 && currentMonth <= 12;

  let totalSemesters = 0;

  if (enrolledYear === 2020 && enrolledIntake === "fall") {
    totalSemesters = 7;
  } else if (enrolledYear === 2021 && enrolledIntake === "spring") {
    totalSemesters = 6;
  } else if (enrolledYear === 2021 && enrolledIntake === "fall") {
    totalSemesters = 5;
  } else {
    if (currentYear === enrolledYear) {
      if (enrolledIntake === "spring") {
        totalSemesters = isCurrentSpring ? 1 : 2;
      } else {
        // fall intake
        totalSemesters = isCurrentFall ? 1 : 0; // 0 if trying to calculate before fall starts
      }
    } else {
      const yearDiff = currentYear - enrolledYear;

      if (enrolledIntake === "spring") {
        totalSemesters = yearDiff * 2;
        if (isCurrentSpring) {
          totalSemesters -= 1;
        }
      } else {
        // fall intake
        totalSemesters = yearDiff * 2 - 1; //second half of the year
        if (isCurrentSpring) {
          totalSemesters -= 1;
        }
      }
    }
  }
  console.log("called");
  return Math.max(0, Math.min(8, totalSemesters));
};

module.exports = calcCurrentSem;
