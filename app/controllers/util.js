exports.convertDate = (d) => {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return `${day}/${month}/${year}`
}


exports.convertMonth = (month) => {
  const months = {
    "Janvier": "January",
    "Février": "February",
    "Mars": "March",
    "Avril": "April",
    "Mai": "May",
    "Juin": "June",
    "Juillet": "July",
    "Août": "August",
    "Aout": "August",
    "Septembre": "September",
    "Octobre": "October",
    "Novembre": "November",
    "Décembre": "December"
  }
  return months[month];
}