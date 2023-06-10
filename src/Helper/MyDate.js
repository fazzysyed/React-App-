export const myDate = () => {
  let day_id = "";
  var a = new Date();
  var weekdays = new Array(7);
  weekdays[0] = "Sunday";
  weekdays[1] = "Monday";
  weekdays[2] = "Tuesday";
  weekdays[3] = "Wednesday";
  weekdays[4] = "Thursday";
  weekdays[5] = "Friday";
  weekdays[6] = "Saturday";
  var r = weekdays[a.getDay()];

  if (r === "Sunday") {
    return (day_id = "3");
  }
  if (r === "Monday") {
    return (day_id = "4");
  }
  if (r === "Tuesday") {
    return (day_id = "5");
  }
  if (r === "Wednesday") {
    return (day_id = "6");
  }
  if (r === "Thursday") {
    return (day_id = "7");
  }
  if (r === "Friday") {
    return (day_id = "1");
  }
  if (r === "Saturday") {
    return (day_id = "2");
  }
};

export const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  return today;
};
