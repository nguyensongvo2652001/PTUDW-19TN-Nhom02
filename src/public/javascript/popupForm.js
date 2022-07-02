const openFormEvent = (buttonName, formName) => {
  const button = document.getElementById(buttonName);
  const form = document.getElementById(formName);
  form.style.display = "none"; //default
  button.addEventListener("click", () => {
    console.log("clicking");
    form.style.display = "block";
  });
};

const closeFormEvent = (buttonName, formName) => {
  const button = document.getElementById(buttonName);
  const form = document.getElementById(formName);
  button.addEventListener("click", () => {
    form.style.display = "none";
  });
};

exports = {
  openFormEvent,
  closeFormEvent,
};
