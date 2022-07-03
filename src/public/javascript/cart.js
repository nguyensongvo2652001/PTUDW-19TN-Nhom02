const getCartItemHTML = (
  idx,
  product,
  id
) => `<li class="cart__item" data-id = ${id}>
  <div class="cart__item-image-container">
    <img src="/images/products/thumbnails/${product.thumbnail}" alt="Item image" class="cart__item-image" />
  </div>

  <p class="cart__item-name">${product.name}</p>

  <div class="basic-info__price-container">
    <div class="basic-info__counter">
      <button class="basic-info__counter-btn basic-info__counter-minus">
        -
      </button>
      <input
        class="basic-info__counter-input"
        type="number"
        value="${product.count}"
        name="products[${idx}][count]"
        required
      />
      <input type="hidden" name="products[${idx}][product]" value="${id}">
      <button class="basic-info__counter-btn basic-info__counter-plus">
        +
      </button>
    </div>
  </div>

  <p class="cart__item-price">$${product.price}</p>

  <ion-icon name="close-outline" class="cart__item-remove-icon"></ion-icon>
</li>`;

const cart = JSON.parse(localStorage.getItem("cart")) || {};
const cartList = document.querySelector(".cart__list");

const updateCartForLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const addFunctionalitiesToCartItems = () => {
  const cartItems = document.querySelectorAll(".cart__item");
  cartItems.forEach((cartItem) => {
    const { id } = cartItem.dataset;
    addFunctionalitiesToCartItem(cartItem, id);
  });
};

const addFunctionalitiesToCartItem = (cartItem, productId) => {
  const minusButton = cartItem.querySelector(".basic-info__counter-minus");
  const plusButton = cartItem.querySelector(".basic-info__counter-plus");
  const countValue = cartItem.querySelector(".basic-info__counter-input");
  const cartPrice = cartItem.querySelector(".cart__item-price");

  minusButton.addEventListener("click", function () {
    const oldCount = Number(countValue.value);
    const newCount = Number(countValue.value) - 1;

    const newPrice =
      (Number(cartPrice.textContent.slice(1)) / oldCount) * newCount;
    countValue.value = newCount;

    cartPrice.textContent = `$${newPrice}`;

    cart[productId]["count"] = newCount;
    cart[productId]["price"] = newPrice;
    updateCartForLocalStorage();
  });

  plusButton.addEventListener("click", function () {
    const oldCount = Number(countValue.value);
    const newCount = Number(countValue.value) + 1;

    const newPrice =
      (Number(cartPrice.textContent.slice(1)) / oldCount) * newCount;
    countValue.value = newCount;

    cartPrice.textContent = `$${newPrice}`;

    cart[productId]["count"] = newCount;
    cart[productId]["price"] = newPrice;
    updateCartForLocalStorage();
  });
};

const cartItemsHTML = Object.keys(cart)
  .map((id, idx) => getCartItemHTML(idx, cart[id], id))
  .join("\n");

cartList.insertAdjacentHTML("beforeend", cartItemsHTML);
addFunctionalitiesToCartItems();
