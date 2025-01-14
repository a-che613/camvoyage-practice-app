function formatDate(dateInput) {
  const date = new Date(dateInput);
  const today = new Date();

  // Check if the given date matches the current date
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return "Today";
  }

  // Format the date as "Jan 25th"
  const options = { month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  // Add the suffix to the day
  const day = date.getDate();
  let suffix = "th";
  if (day % 10 === 1 && day !== 11) suffix = "st";
  else if (day % 10 === 2 && day !== 12) suffix = "nd";
  else if (day % 10 === 3 && day !== 13) suffix = "rd";

  return formattedDate.replace(day.toString(), day + suffix);
}


export {formatDate}