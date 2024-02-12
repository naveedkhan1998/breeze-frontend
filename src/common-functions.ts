export function formatDate(originalDate: string) {
  const parsedDate = Date.parse(originalDate);
  const indianTimeZoneOffset = 5.5 * 60 * 60 * 1000;
  const indianTime = parsedDate + indianTimeZoneOffset
  const parsedIndianDate =indianTime / 1000;

  return parsedIndianDate;
}

