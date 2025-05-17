import axios from "axios";
import { arrData } from "./projectName.js";

function convertDateFormat(obj) {
  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const newObj = { ...obj };

  for (let key in newObj) {
    const value = newObj[key];

    if (typeof value === "string") {
      const dmyPattern = /^\d{1,2}-[A-Za-z]{3}-\d{4}$/;
      const isoPattern = /^\d{4}-\d{2}-\d{2}$/;

      if (dmyPattern.test(value)) {
        const [day, mon, year] = value.split("-");
        const month = months[mon];
        const formattedDay = day.padStart(2, "0");
        newObj[key] = `${year}-${month}-${formattedDay}`;
      }
    }
  }

  return newObj;
}

for (let i = 0; i < arrData.length; i++) {
  setTimeout(() => {
    console.log(i);
    saveData(convertDateFormat(arrData[i]));
  }, i * 500);
}

const saveData = async (data) => {
  try {
    const response = await axios.post(`http://localhost:8000/api/v1/save`, {
      ...data,
      requestDate: "",
      entityType: "SI DELHI",
      status: "norequest",
      priority: "high",
      service: "Service not included",
      expenseScope: "company",
      duration: 0,
      checklistStatus: "N/A",
    });
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
};
