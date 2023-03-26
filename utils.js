import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const planets_default = [
  {
    name: "रवि",
    num: 7000,
  },
  {
    name: "चंद्र",
    num: 11000,
  },
  {
    name: "मंगळ",
    num: 10000,
  },
  {
    name: "बुध",
    num: 4000,
  },
  {
    name: "गुरु",
    num: 19000,
  },
  {
    name: "शुक्र",
    num: 16000,
  },
  {
    name: "शनी",
    num: 23000,
  },
  {
    name: "राहू",
    num: 18000,
  },
  {
    name: "केतू",
    num: 17000,
  },
];

export const KEYS = {
  CHANTS_LIST: "@chants_list",
  ITEM_LIST: "@item_list", // the items that are added by the user
};

export const showAlert = (title, message) => {
  Alert.alert(title, message, [{ text: "OK" }], { cancelable: false });
};

export const setMantras = async (js_object) => {
  try {
    await AsyncStorage.setItem(KEYS.CHANTS_LIST, JSON.stringify(js_object));
  } catch (e) {
    showAlert("Error", `${e.name} - ${e.message}}`);
  }
};

export const getMantras = async () => {
  try {
    const value = await AsyncStorage.getItem(KEYS.CHANTS_LIST); // its a json object
    if (value == null) {
      await AsyncStorage.setItem(
        KEYS.CHANTS_LIST,
        JSON.stringify(planets_default)
      );
      return planets_default;
    } else {
      return JSON.parse(value);
    }
  } catch (e) {
    showAlert("Error", `${e.name} - ${e.message}}`);
  }
};

export const getTodayDateString = () => {
  const date = new Date();
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const getDateFromDateString = (date) => {
  const [D, M, Y] = date.split("/");
  return new Date(Y, M - 1, D);
};

export const addDateToExistingDateString = (dateString, daysToAdd) => {
  const date = getDateFromDateString(dateString);
  date.setDate(date.getDate() + daysToAdd);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const getStringFromDate = (date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const datediff = (first, second) => {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
};

export const getList = async () => {
  try {
    const value = await AsyncStorage.getItem(KEYS.ITEM_LIST); // its a json object
    if (value == null) {
      return [];
    } else {
      return JSON.parse(value);
    }
  } catch (e) {
    showAlert("Error", `${e.name} - ${e.message}}`);
  }
};

export const saveList = async (js_object) => {
  try {
    await AsyncStorage.setItem(KEYS.ITEM_LIST, JSON.stringify(js_object));
  } catch (e) {
    showAlert("Error", `${e.name} - ${e.message}}`);
  }
};

export const getJapCount = (japSankhya, startDate, endDate) => {
  const days = datediff(
    getDateFromDateString(startDate),
    getDateFromDateString(endDate)
  );
  return Math.ceil(japSankhya / days);
};

export const checkBetweenTwoDates = (
  startDateString,
  endDateString,
  todayDate
) => {
  const d1 = startDateString.split("/");
  const d2 = endDateString.split("/");

  const date_parts = todayDate.split("/");

  const from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]); // -1 because months are from 0 to 11
  const to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);

  const date = new Date(
    date_parts[2],
    parseInt(date_parts[1]) - 1,
    date_parts[0]
  );

  if (date >= from && date < to) {
    return true;
  }

  return false;
};

export const getInitialState = () => {
  return {
    name: "",
    gotra: "",

    chantName: "",
    chantSankhya: 0,
    times: 1,

    startDate: getTodayDateString(),
    endDate: addDateToExistingDateString(getTodayDateString(), 30),

    additional_text: "",
    cost_text: "",
  };
};
