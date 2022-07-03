const profilePage = document.querySelector(".profilePage");
const editProfileForm = profilePage.querySelector(".popupProfileForm");
const editProfileButton = profilePage.querySelector(".editProfileButton");
const saveEditProfileButton = profilePage.querySelector(
  ".saveEditProfileButton"
);
const cancelEditProfileButton = profilePage.querySelector(
  ".cancelEditProfileButton"
);

const nameInput = editProfileForm.querySelector("#Username");
const descriptionInput = editProfileForm.querySelector("#description");
const phoneNumberInput = editProfileForm.querySelector("#PhoneNumber");
const shopNameInput = editProfileForm.querySelector("#shopName");
const avatarInput = editProfileForm.querySelector("#avatar");

editProfileButton.addEventListener("click", () => {
  document.getElementsByClassName("profileMainBanner")[0].style.height = "140%";
  showElement(editProfileForm);
});

saveEditProfileButton.addEventListener("click", () => {
  updateProfile();
});

cancelEditProfileButton.addEventListener("click", () => {
  hideElement(editProfileForm);
  document.getElementsByClassName("profileMainBanner")[0].style.height = "";
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
    redirect("/api/v1/users/me");
  } catch {
    console.log("error")
  }
};

console.log("???");
