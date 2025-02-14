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

  return Math.max(0, Math.min(8, totalSemesters));
};

// console.log(calcCurrentSem(2021, "spring"));
// console.log(calcCurrentSem(2022, "spring"));
// console.log(calcCurrentSem(2022, "fall"));
// console.log(calcCurrentSem(2020, "spring"));
// console.log(calcCurrentSem(2020, "fall"));

module.exports = calcCurrentSem;

// // Test Cases
// try {
//   console.log("Test 1 (2021, spring):", calcCurrentSem(2021, "spring")); // Expected: 6 (Pandemic Adjusted)
//   console.log("Test 2 (2021, fall):", calcCurrentSem(2021, "fall"));     // Expected: 5 (Pandemic Adjusted)
//   console.log("Test 3 (2023, spring):", calcCurrentSem(2023, "spring")); // Expected: 4
//   console.log("Test 4 (2023, fall):", calcCurrentSem(2023, "fall"));     // Expected: 3
//   console.log("Test 5 (2025, spring):", calcCurrentSem(2025, "spring")); // Expected: 1
//   console.log("Test 6 (2025, fall):", calcCurrentSem(2025, "fall"));     // Expected: 0 - hasn't started yet
//   console.log("Test 7 (2020, fall):", calcCurrentSem(2020, "fall"));     // Expected: 7 (Pandemic Adjusted)
// } catch (error) {
//   console.error("Error:", error.message);
// }
