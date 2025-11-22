const months = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const convertDateToNice = date => {
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

export const createDeepCopy = obj => JSON.parse(JSON.stringify(obj));

export const getFullDateTime = timestamp => {
  const creationTime = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(timestamp);
  const d = creationTime.split(',')[0].split('/');
  const t = creationTime.split(',')[1];
  let onlyDate = `${monthsShort[(+d[0] - 1)]} ${d[1]}`;
  if (new Date().getFullYear() !== +d[2]) {
    onlyDate += `, ${d[2]}`;
  }
  return `${onlyDate}, ${t}`;
}

export const timeAgo = timestamp => {

  const intialDate = new Date(timestamp);
  let output = '';
  let from = + intialDate;
  const to = + new Date();
  let diff = to - from;
  const secDiff = Math.floor(diff / 1000); // seconds
  const minDiff = Math.floor(secDiff / 60); // minutes
  const hourDiff = Math.floor(minDiff / 60); // hours
  const dayDiff = Math.floor(hourDiff / 24); // days
  const monthDiff = Math.floor(dayDiff / 30); // months

  const datevalues = [
    intialDate.getFullYear(),
    intialDate.getMonth() + 1,
    intialDate.getDate(),
    intialDate.getHours(),
    intialDate.getMinutes(),
    intialDate.getSeconds()
  ];

  if (secDiff < 59) {
    output = 'Just now';
  }
  else if (secDiff > 59 && minDiff < 60) {
    output = minDiff + ' min ago';
  }
  else if (minDiff >= 60 && hourDiff < 24) {
    output = hourDiff + ' hr ago';
  }
  else if (hourDiff >= 24 && dayDiff === 1) {
    output = 'Yesterday';
  }
  else if (dayDiff > 1 && dayDiff <= 31) {
    output = dayDiff + ' days ago';
  }
  else if (monthDiff >= 1 && monthDiff <= 10) {
    output = monthsShort[datevalues[1] - 1] + ' ' + datevalues[2];
  }
  else if (monthDiff > 10) {
    output = datevalues[2] + '/' + datevalues[1] + '/' + datevalues[0];
  }

  return output;
}