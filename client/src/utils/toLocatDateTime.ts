export const toLocalDatetime = (date: Date): string =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16); // Formats as "YYYY-MM-DDTHH:mm"
