export function formatDate(originalDate: string) {
  const parsedDate = Date.parse(originalDate);
  const indianTimeZoneOffset = 5.5 * 60 * 60 * 1000;
  const indianTime = parsedDate + indianTimeZoneOffset;
  const parsedIndianDate = indianTime / 1000;

  return parsedIndianDate;
}

// tickMarkFormatter: (time: number) => {
//   const date = new Date(time * 1000);
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const period = hours >= 12 ? "PM" : "AM";
//   const formattedHours = hours % 12 || 12;
//   return `${formattedHours}:${
//     minutes < 10 ? "0" : ""
//   }${minutes} ${period}`;
// },
