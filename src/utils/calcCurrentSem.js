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

  while (tempYear < currentYear || tempSeason !== currentSeason) {
    semester++;

    if (tempSeason === "spring") {
      tempSeason = "fall";
    } else {
      tempSeason = "spring";
      tempYear++;
    }
  }

  return semester;
};

module.exports = calcCurrentSem;