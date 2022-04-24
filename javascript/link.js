const headerProfileIcon = document.querySelector(".header__profile-icon");
const headerCartIcon = document.querySelector(".header__cart-icon");
const headerHomeIcon = document.querySelector(".header__home-icon");
const productProfileLink = document.querySelector(
  ".profile__product-profile-link"
);
const productManagerProfileLink = document.querySelector(
  ".profile__product-manager-link"
);
const profitProfileLink = document.querySelector(
  ".profile__product-profit-link"
);
const loginLinkButton = document.querySelector(".header__auth-button--login");
const signupLinkButton = document.querySelector(".header__auth-button--signup");

const clickElement = (el, link) => {
  if (!el) return;
  el.addEventListener("click", function () {
    location.href = link;
  });
};

clickElement(headerHomeIcon, "");
clickElement(headerProfileIcon, "profilePage.html");
clickElement(headerCartIcon, "checkOutPage.html");
clickElement(productProfileLink, "profilePage.html");
clickElement(productManagerProfileLink, "productManager.html");
clickElement(profitProfileLink, "statistics.html");
clickElement(loginLinkButton, "Login.html");
clickElement(signupLinkButton, "Signup.html");
