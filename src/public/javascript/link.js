const headerProfileIcon = document.querySelector(".header__profile-icon");
const headerCartIcon = document.querySelector(".header__cart-icon");
const headerMainIcon = document.querySelector(".header__shop-name");
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

//Cart
const cartBackToShopping = document.querySelector(".cartBackPageText");
const cartCheckout = document.querySelector(".cartCheckout");
clickElement(cartBackToShopping, "api/v1/products");
clickElement(cartCheckout, "/api/v1/");
//

clickElement(headerMainIcon, "/api/v1/products");
clickElement(headerHomeIcon, "/api/v1/products");
clickElement(headerProfileIcon, "/api/v1/users/me");
clickElement(headerCartIcon, "/cart");

clickElement(productProfileLink, "/api/v1/users/me");
clickElement(productManagerProfileLink, "/api/v1/users/me/products");
clickElement(profitProfileLink, "/api/v1/users/me/statistics");

clickElement(loginLinkButton, "/api/v1/users/login");
clickElement(signupLinkButton, "/api/v1/users/signUp");
