const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Get individual date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so adding 1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

//   const dateString = "2025-01-20T11:15:53.894+00:00";
//   console.log(formatDate(dateString));
// Output: "2025-01-20"

module.exports = formatDate;
