const editProfileButton = document.querySelector(".editProfileButton")

editProfileButton.addEventListener("click", () => {
    console.log(document.getElementsByClassName("popupProfileForm")[0])
    document.getElementsByClassName("popupProfileForm")[0].style.visibility = "visible";
})