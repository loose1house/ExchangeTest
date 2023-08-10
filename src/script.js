const API_KEY = "732b82467a536e82cc1c3b093f00b9b4";
const FIXER_HOST_API = "http://data.fixer.io/api";

let headerData = {
  currencyDesc: "United States Dollar",
  currencySymbolTo: "EUR",
  toValue: 0,
  date: "date",
  error: false,
};

let bodyData = {
  fromValue: 1,
  fromCurrency: "USD",
  toValue: 0,
  toCurrency: "EUR",
  rate: 0.5,
};

let uiElements = {
  currencyDesc: "",
  currencySymbolTo: "",
  toValue: "",
  date: "",
  fromValue: "",
  fromCurrency: "",
  toValue: "",
  toCurrency: "",
  popup: "",
};

let listSymbols = {};
let listRates = {};

const getData = async (type, additionalParam) => {
  try {
    const response = await fetch(
      FIXER_HOST_API + type + "?access_key=" + API_KEY + additionalParam
    );
    if (response.ok) {
      const responseJson = await response.json();
      if (responseJson.success) {
        return responseJson;
      }
    }
  } catch (error) {
    return false;
  }
  return false;
};

const currencyChanged = async () => {
  listRates = await getRates();
  bodyData.rate =
    listRates[bodyData.toCurrency] / listRates[bodyData.fromCurrency];
  valueFromChanged();

  headerData = {
    ...headerData,
    currencyDesc: listSymbols[bodyData.fromCurrency],
    currencySymbolTo: listSymbols[bodyData.toCurrency],
    toValue: bodyData.rate.toFixed(4),
  };
  updateHeaderUI();
};

const currencyFromChanged = (event) => {
  bodyData.fromCurrency = event.target.value;
  currencyChanged();
};
const currencyToChanged = (event) => {
  bodyData.toCurrency = event.target.value;
  currencyChanged();
};

const valueFromChangedEvent = async (event) => {
  if (event.target.value != "") {
    listRates = await getRates();
    bodyData.fromValue = event.target.value;
    valueFromChanged();
  } else {
    uiElements.toValue.value = "";
  }
};

const valueFromChanged = () => {
  bodyData.toValue = bodyData.fromValue * bodyData.rate;
  // updateUI("main_currency-to-value", bodyData.toValue);
  uiElements.toValue.value = bodyData.toValue;
  updateDateUI();
};

const valueToChangedEvent = async (event) => {
  if (event.target.value != "") {
    listRates = await getRates();
    bodyData.toValue = event.target.value;
    valueToChanged();
  } else {
    uiElements.fromValue.value = "";
  }
};

const valueToChanged = () => {
  bodyData.fromValue = bodyData.toValue * (1 / bodyData.rate);
  uiElements.fromValue.value = bodyData.fromValue;
  updateDateUI();
};

const getSymbols = async () => {
  const { symbols, success } = await getData("/symbols", "");
  setError(!success);
  return symbols;
};

const setError = (err) => {
  bodyData.error = err;
  uiElements.popup.style.display = err ? "block" : "none";
};

const getRates = async () => {
  const { rates, success } = await getData("/latest", "");
  setError(!success);
  return rates;
};

const updateDateUI = () => {
  const date = new Date();
  const options = {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  };
  headerData.date = date.toLocaleDateString("en-US", options);
  uiElements.date.textContent = headerData.date;
};

const getApiValues = async () => {
  setListSymbols(await getSymbols());
  setListRates(await getRates());
  updateDateUI();
};

const setListSymbols = (_listSymbols) => {
  listSymbols = _listSymbols;
  updateHeaderUI();
  initialBodyUI();
};
const setListRates = (_listRates) => {
  listRates = _listRates;
  if (listSymbols) {
    headerData = {
      currencyDesc: listSymbols[Object.keys(listRates)[0]],
      currencySymbolTo: Object.keys(listRates)[0],
      toValue: 1,
      date: "date",
    };

    bodyData = {
      fromValue: 1,
      fromCurrency: Object.keys(listRates)[0],
      toValue: 1,
      toCurrency: Object.keys(listRates)[0],
      rate: 1,
    };
  }
  updateHeaderUI();
  initialBodyUI();
};

const initialBodyUI = () => {
  if (listSymbols) {
    uiElements.fromValue.value = bodyData.fromValue;
    const selectFrom = uiElements.fromCurrency;
    Object.keys(listSymbols).forEach((el) => {
      selectFrom.add(new Option(`${listSymbols[el]}`, `${el}`));
    });
    uiElements.toValue.value = bodyData.toValue;
    const selectTo = uiElements.toCurrency;
    Object.keys(listSymbols).forEach((el) => {
      selectTo.add(new Option(`${listSymbols[el]}`, `${el}`));
    });
  }
};

const updateHeaderUI = () => {
  uiElements.currencyDesc.textContent = headerData.currencyDesc;
  uiElements.currencySymbolTo.textContent = headerData.currencySymbolTo;
  uiElements.headerToValue.textContent = headerData.toValue;
  uiElements.date.textContent = headerData.date;
};

window.addEventListener("load", async () => {
  uiElements = {
    currencyDesc: document.getElementById("header-currency-description"),
    currencySymbolTo: document.getElementById("header-currency-symbol"),
    headerToValue: document.getElementById("header-currency-value"),
    date: document.getElementById("header_date"),
    fromValue: document.getElementById("main_currency-from-value"),
    fromCurrency: document.getElementById("main_currency-from"),
    toValue: document.getElementById("main_currency-to-value"),
    toCurrency: document.getElementById("main_currency-to"),
    popup: document.getElementById("myPopup"),
  };

  uiElements.fromCurrency.addEventListener("change", currencyFromChanged);
  uiElements.toCurrency.addEventListener("change", currencyToChanged);
  uiElements.fromValue.addEventListener("input", valueFromChangedEvent);
  uiElements.toValue.addEventListener("input", valueToChangedEvent);

  await getApiValues();
  updateHeaderUI();
});
