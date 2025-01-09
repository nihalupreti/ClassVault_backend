const calcCurrentSem = (enrolledYear, enrolledIntake) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;

  const currentSeason = currentMonth >= 3 && currentMonth <= 8 ? "spring" : "fall";

  if (enrolledIntake !== "spring" && enrolledIntake !== "fall") {
    throw new Error("Invalid enrolledIntake value.");
  }

  let semester = 1;
  let tempYear = enrolledYear;
  let tempSeason = enrolledIntake;

  while ((tempYear < currentYear || tempSeason !== currentSeason) && semester < 8) {
    semester++;


    if (tempSeason === "spring") {
      tempSeason = "fall";
    } else {
      tempSeason = "spring";
      tempYear++;
    }
  }

  return semester > 8 ? 8 : semester;
};

// Test Cases
try {
  console.log("Test 1 (2021, spring):", calcCurrentSem(2021, "spring"));
  console.log("Test 2 (2022, fall):", calcCurrentSem(2022, "spring"));
  console.log("Test 3 (2020, fall):", calcCurrentSem(2024, "fall"));
  console.log("Test 4 (2023, spring):", calcCurrentSem(2023, "spring"));
  console.log("Test 5 (2025, spring):", calcCurrentSem(2018, "fall"));
} catch (error) {
  console.error("Error:", error.message);
}
