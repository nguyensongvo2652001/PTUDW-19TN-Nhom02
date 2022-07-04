const profilePage = document.querySelector(".main-display");
const editProfileForm = document.querySelector(".popupProfileForm");
const editProfileButton = document.querySelector(".editProfileButton");
const saveEditProfileButton = document.querySelector(".saveEditProfileButton");
const cancelEditProfileButton = document.querySelector(
  ".cancelEditProfileButton"
);
const profileMainBoard = document.querySelector(".main-display");
console.log(editProfileForm);
const nameInput = editProfileForm.querySelector("#Username");
const descriptionInput = editProfileForm.querySelector("#description");
const phoneNumberInput = editProfileForm.querySelector("#PhoneNumber");
const shopNameInput = editProfileForm.querySelector("#shopName");
const avatarInput = editProfileForm.querySelector("#avatar");

editProfileButton.addEventListener("click", () => {
  showElement(editProfileForm);
  hideElement(profileMainBoard);
});

saveEditProfileButton.addEventListener("click", () => {
  updateProfile();
});

cancelEditProfileButton.addEventListener("click", () => {
  hideElement(editProfileForm);
  showElement(profileMainBoard);
});

const updateProfile = async () => {
  try {
    const data = {};
    if (avatarInput.files.length > 0) data["avatar"] = avatarInput.files[0];
    data["username"] = nameInput.value;
    data["description"] = descriptionInput.value;
    data["phoneNumber"] = phoneNumberInput.value;
    data["storeName"] = shopNameInput.value;

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    await sendRequest("/api/v1/users/me", {
      method: "PATCH",
      body: formData,
    });

    hideElement(editProfileForm);
    showElement(profileMainBoard);
    redirect("/api/v1/users/me");
  } catch {
    console.log("error");
  }
};
