const formatValue = (date: Date): string => {
  const parsedDate = date.toString().split('T')[0].split('-');
  const formatedDate = `${parsedDate[2]}/${parsedDate[1]}/${parsedDate[0]}`;
  return formatedDate;
};

export default formatValue;
