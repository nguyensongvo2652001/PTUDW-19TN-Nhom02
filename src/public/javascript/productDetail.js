const cart = JSON.parse(localStorage.getItem("cart")) || {};

const basicProductInfoContainer = document.querySelector(".basic-product-info");
const productName = document.querySelector(".product__name")?.textContent;
const productPrice = document.querySelector(".product__price");
const { productThumbnail } = document.querySelector(
  ".product__thumbnail"
)?.dataset;
const { productId } = basicProductInfoContainer?.dataset;

const addToCartButton = document.querySelector(".btn--addToCart");
const itemCounter = document.querySelector(".basic-info__counter-input");
const plusItemCounter = document.querySelector(".basic-info__counter-plus");
const minusItemCounter = document.querySelector(".basic-info__counter-minus");

if (plusItemCounter) {
  plusItemCounter.addEventListener("click", function () {
    const oldCount = Number(itemCounter.value);
    const newCount = oldCount + 1;
    const newPrice = (Number(productPrice.textContent) * newCount) / oldCount;

    itemCounter.value = newCount;
    productPrice.textContent = newPrice;
  });
}

if (minusItemCounter) {
  minusItemCounter.addEventListener("click", function () {
    const oldCount = Number(itemCounter.value);
    const newCount = oldCount - 1;
    const newPrice = (Number(productPrice.textContent) * newCount) / oldCount;

    itemCounter.value = newCount;
    productPrice.textContent = newPrice;
  });
}

if (addToCartButton) {
  addToCartButton.addEventListener("click", function () {
    cart[productId] = {
      price: Number(productPrice.textContent),
      thumbnail: productThumbnail,
      name: productName,
      count: itemCounter.value,
    };
    localStorage.setItem("cart", JSON.stringify(cart));
  });
}
if (cart && cart[productId]) itemCounter.value = cart[productId].count;
if (cart && cart[productId]) productPrice.textContent = cart[productId].price;
