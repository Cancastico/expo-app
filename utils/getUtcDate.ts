export const getUTCDate = (dateTime: Date): string => {
  const year = dateTime.getFullYear();
  const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Mês começa em 0
  const day = dateTime.getDate().toString().padStart(2, '0');
  return `${day}/${month}/${year}`;
};