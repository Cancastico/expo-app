export const getUTCHour = (dateTime: Date): string => {
  return dateTime.getHours().toString().padStart(2, '0') + ':' +
         dateTime.getMinutes().toString().padStart(2, '0') + ':' +
         dateTime.getSeconds().toString().padStart(2, '0');
};