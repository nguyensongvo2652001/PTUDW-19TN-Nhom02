export const sendRequest = async (url, options) => {
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

export const redirect = (url) => {
  window.location.href = url;
};

export const addErrorElement = (element, message) => {
  const errorElement = document.createElement("p");
  errorElement.textContent = message;
  errorElement.classList.add("error");
  element.insertAdjacentElement("afterend", errorElement);

  return errorElement;
};

export const showElement = (element) => {
  element.classList.remove("hidden");
};

export const hideElement = (element) => {
  element.classList.add("hidden");
};
