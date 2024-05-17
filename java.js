var currentTotal = 0;

function loadCart() {
  var storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  currentTotal = parseFloat(localStorage.getItem("currentTotal")) || 0;
  storedItems.forEach(item => addItem(item, false));
  updateTotal();
}

function addItem(item, shouldSave = true) {
  var cartItems = document.getElementById("cart-items");
  var checkoutCartItems = document.getElementById("checkout-cart-items");

  function createListItem(item) {
    var li = document.createElement("li");

    var removeButton = document.createElement("button");
    removeButton.textContent = "Ta bort";
    removeButton.onclick = function () {
      removeItem(item, li);
    };

    li.textContent = item;
    li.appendChild(removeButton);
    return li;
  }

  var li = createListItem(item);
  var checkoutLi = createListItem(item);

  if (cartItems) cartItems.appendChild(li);
  if (checkoutCartItems) checkoutCartItems.appendChild(checkoutLi);

  if (shouldSave) {
    var matches = item.match(/\$(\d{1,3}(,\d{3})*(\.\d{2})?)/);
    if (matches && matches[1]) {
      var itemPrice = parseFloat(matches[1].replace(/,/g, ""));
      currentTotal += itemPrice;
      updateTotal();
      saveCart();
    } else {
      alert("Price not found in item text.");
    }
  }
}

function removeItem(item, listItem) {
  var cartItems = document.getElementById("cart-items");
  var checkoutCartItems = document.getElementById("checkout-cart-items");

  if (cartItems) cartItems.removeChild(listItem);
  var correspondingLi = [...checkoutCartItems?.children || []].find(
    li => li.textContent.replace("Ta bort", "").trim() === item.trim()
  );
  if (correspondingLi) {
    checkoutCartItems.removeChild(correspondingLi);
  }

  var matches = item.match(/\$(\d{1,3}(,\d{3})*(\.\d{2})?)/);
  if (matches && matches[1]) {
    var itemPrice = parseFloat(matches[1].replace(/,/g, ""));
    currentTotal -= itemPrice;
    updateTotal();
    saveCart();
  }
}

function updateTotal() {
  var totalElement = document.getElementById("total");
  var checkoutTotalElement = document.getElementById("checkout-total");
  var formattedTotal = "Total: $" + currentTotal.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  if (totalElement) totalElement.textContent = formattedTotal;
  if (checkoutTotalElement) checkoutTotalElement.textContent = formattedTotal;
}

function saveCart() {
  var items = [];
  var cartItems = document.getElementById("cart-items");
  cartItems?.querySelectorAll("li").forEach(li => {
    items.push(li.textContent.replace("Ta bort", "").trim());
  });
  localStorage.setItem("cartItems", JSON.stringify(items));
  localStorage.setItem("currentTotal", currentTotal.toString());
}

function proceedToPayment() {
  alert("Ditt ordernummer är: 13204349 \nOrderkonformation skickas på mejl med fakturan");
  clearCart();
}

function clearCart() {
  currentTotal = 0;
  updateTotal();

  var cartItems = document.getElementById("cart-items");
  var checkoutCartItems = document.getElementById("checkout-cart-items");
  while (cartItems?.firstChild) {
    cartItems.removeChild(cartItems.firstChild);
  }
  while (checkoutCartItems?.firstChild) {
    checkoutCartItems.removeChild(checkoutCartItems.firstChild);
  }

  localStorage.removeItem("cartItems");
  localStorage.removeItem("currentTotal");
}

function clearForm() {
  document.getElementById('myForm').reset();
  alert('Förfrågan för värdering har skickats');
}

window.onload = loadCart;