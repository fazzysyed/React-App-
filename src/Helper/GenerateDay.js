export const GenerateDay = (id) => {
  let days = [
    {
      day: "Sun",
      name: "Sunday",
      id: "3",
    },
    {
      day: "Mon",

      name: "Monday",

      id: "4",
    },
    {
      day: "Tues",

      name: "Tuesday",

      id: "5",
    },
    {
      day: "Wed",

      name: "Wednesday",

      id: "6",
    },
    {
      day: "Thu",
      name: "Thursday",

      id: "7",
    },
    {
      day: "Fri",

      name: "Friday",

      id: "1",
    },
    {
      day: "Sat",

      name: "Saturday",

      id: "2",
    },
  ];

  let day = days.filter((i) => i.id === id);
  console.log(day[0].day, "Faraz shah");
  return day[0];
};
