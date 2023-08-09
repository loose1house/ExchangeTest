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

const updateUI = (id, value) => {
  document.getElementById(id).value = value;
};

const currencyChanged = () => {
  bodyData.rate =
    listRates[bodyData.toCurrency] / listRates[bodyData.fromCurrency];
  valueFromChanged();
};

const currencyFromChanged = (event) => {
  bodyData.fromCurrency = event.target.value;
  currencyChanged();
};
const currencyToChanged = (event) => {
  bodyData.toCurrency = event.target.value;
  currencyChanged();
};

const valueFromChangedEvent = (event) => {
  bodyData.fromValue = event.target.value;
  valueFromChanged();
};

const valueFromChanged = () => {
  bodyData.toValue = bodyData.fromValue * bodyData.rate;
  updateUI("main_currency-to-value", bodyData.toValue);
};

const valueToChangedEvent = (event) => {
  bodyData.toValue = event.target.value;
  valueToChanged();
};

const valueToChanged = () => {
  bodyData.fromValue = bodyData.toValue * (1 / bodyData.rate);
  updateUI("main_currency-from-value", bodyData.fromValue);
};

const getSymbols = async () => {
  const { symbols, success } = await getData("/symbols", "");
  setError(!success);
  return symbols;
};

const setError = (err) => {
  bodyData.error = err;
  document.getElementById("error-message").style.display = err
    ? "block"
    : "none";
};

const getRates = async () => {
  const { rates, success } = await getData("/latest", "");
  setError(!success);
  return rates;
};

const updateDateUI = () => {
  headerData.date = new Date();
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

  updateHeaderUI();
  initialBodyUI();
};

const initialBodyUI = () => {
  document.getElementById("main_currency-from-value").value =
    bodyData.fromValue;
  const selectFrom = document.getElementById("main_currency-from");
  Object.keys(listSymbols).forEach((el) => {
    selectFrom.add(new Option(`${listSymbols[el]}`, `${el}`));
  });
  document.getElementById("main_currency-to-value").value = bodyData.toValue;
  const selectTo = document.getElementById("main_currency-to");
  Object.keys(listSymbols).forEach((el) => {
    selectTo.add(new Option(`${listSymbols[el]}`, `${el}`));
  });
};

const updateHeaderUI = () => {
  document.getElementById("header-currency-description").textContent =
    headerData.currencyDesc;
  document.getElementById("header-currency-symbol").textContent =
    headerData.currencySymbolTo;
  document.getElementById("header-currency-value").textContent =
    headerData.toValue;
  document.getElementById("header_date").textContent = headerData.date;
};

window.addEventListener("load", async (event) => {
  document
    .getElementById("main_currency-from")
    .addEventListener("change", currencyFromChanged);

  document
    .getElementById("main_currency-to")
    .addEventListener("change", currencyToChanged);

  document
    .getElementById("main_currency-from-value")
    .addEventListener("input", valueFromChangedEvent);

  document
    .getElementById("main_currency-to-value")
    .addEventListener("input", valueToChangedEvent);

  await getApiValues();

  updateHeaderUI();
});
