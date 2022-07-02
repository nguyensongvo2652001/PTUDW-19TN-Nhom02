const sendRequest = async (url, options) => {
  const response = await fetch(url, options);

  let data = null;

  try {
    data = await response.json();
  } catch (_) {
    if (!response.ok) throw new Error("Something went wrong");
  }

  if (!response.ok) throw new Error(data.message);
  return data;
};

const redirect = (url) => {
  window.location.href = url;
};

const addErrorElement = (element, message) => {
  const errorElement = document.createElement("p");
  errorElement.textContent = message;
  errorElement.classList.add("error");
  element.insertAdjacentElement("afterend", errorElement);

  return errorElement;
};

const showElement = (element) => {
  element.classList.remove("hidden");
};

const hideElement = (element) => {
  element.classList.add("hidden");
};

exports = {
  sendRequest,
  redirect,
  addErrorElement,
  showElement,
  hideElement,
};
