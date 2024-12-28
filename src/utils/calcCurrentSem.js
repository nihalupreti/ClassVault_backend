const calcCurrentSem = (enrolledYear, enrolledIntake) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMnt = date.getMonth() + 1;

  let semester = 1;
  let tempSeason = enrolledIntake;

  const currentSeason = currentMnt >= 3 && currentMnt <= 8 ? "fall" : "spring";

  while (enrolledYear < currentYear || tempSeason !== currentSeason) {
    semester++;

    if (tempSeason === "fall") {
      tempSeason = "spring";
    } else {
      tempSeason = "fall";
      enrolledYear++;
    }
  }

  return semester;
};

module.exports = calcCurrentSem;
