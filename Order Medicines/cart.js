  var cart = {
    // (A) PROPERTIES
    hPdt : null, // HTML products list
    hItems : null, // HTML current cart
    items : {}, // Current items in cart
    iURL : "images/", // Product image URL folder

    save : () => {
      localStorage.setItem("cart", JSON.stringify(cart.items));
    },

    load : () => {
      cart.items = localStorage.getItem("cart");
      if (cart.items == null) { cart.items = {}; }
      else { cart.items = JSON.parse(cart.items); }
    },
    nuke : () => {
      if (confirm("Empty cart?")) {
        cart.items = {};
        localStorage.removeItem("cart");
        cart.list();
      }
    },

    init : () => {
  
      cart.hPdt = document.getElementById("cart-products");
      cart.hItems = document.getElementById("cart-items");

  
      cart.hPdt.innerHTML = "";
      let p, item, part;
      for (let id in products) {
 
        p = products[id];
        item = document.createElement("div");
        item.className = "p-item";
        cart.hPdt.appendChild(item);


        part = document.createElement("img");
        part.src = cart.iURL + p.img;
        part.className = "p-img";
        item.appendChild(part);


        part = document.createElement("div");
        part.innerHTML = p.name;
        part.className = "p-name";
        item.appendChild(part);


        part = document.createElement("div");
        part.innerHTML = p.desc;
        part.className = "p-desc";
        item.appendChild(part);


        part = document.createElement("div");
        part.innerHTML = "Rs." + p.price;
        part.className = "p-price";
        item.appendChild(part);

        // ADD TO CART
        part = document.createElement("input");
        part.type = "button";
        part.value = "Add to Cart";
        part.className = "button cart p-add ";
        part.onclick = () => { cart.add(id); };
        item.appendChild(part);
      }

      // (C3) LOAD CART FROM PREVIOUS SESSION
      cart.load();

      // (C4) LIST CURRENT CART ITEMS
      cart.list();
    },

    // (D) LIST CURRENT CART ITEMS (IN HTML)
    list : () => {
      // (D1) RESET
      cart.hItems.innerHTML = "";
      let item, part, pdt;
      let empty = true;
      for (let key in cart.items) {
        if(cart.items.hasOwnProperty(key)) { empty = false; break; }
      }

      // (D2) CART IS EMPTY
      if (empty) {
        item = document.createElement("div");
        item.innerHTML = "Cart is empty";
        cart.hItems.appendChild(item);
      }

      // (D3) CART IS NOT EMPTY - LIST ITEMS
      else {
        let p, total = 0, subtotal = 0;
        for (let id in cart.items) {
          // ITEM
          p = products[id];
          item = document.createElement("div");
          item.className = "c-item";
          cart.hItems.appendChild(item);

          // NAME
          part = document.createElement("div");
          part.innerHTML = p.name;
          part.className = "c-name";
          item.appendChild(part);

          // REMOVE
          part = document.createElement("input");
          part.type = "button";
          part.value = "X";
          part.className = "c-del cart";
          part.onclick = () => { cart.remove(id); };
          item.appendChild(part);

          // QUANTITY
          part = document.createElement("input");
          part.type = "number";
          part.min = 0;
          part.value = cart.items[id];
          part.className = "c-qty";
          part.onchange = function () { cart.change(id, this.value); };
          item.appendChild(part);

          // SUBTOTAL
          subtotal = cart.items[id] * p.price;
          total += subtotal;
        }

        // TOTAL AMOUNT
        item = document.createElement("div");
        item.className = "c-total";
        item.id = "c-total";
        item.innerHTML ="TOTAL: Rs." + total;
        cart.hItems.appendChild(item);

        //Button to Empty The Cart
        item = document.createElement("input");
        item.type = "button";
        item.value = "Empty";
        item.onclick = cart.nuke;
        item.className = "c-empty cart";
        cart.hItems.appendChild(item);

        //Button To CheckOut
        item = document.createElement("input");
        item.type = "button";
        item.value = "Checkout";
        item.onclick = cart.checkout;
        item.className = "c-checkout cart";
        cart.hItems.appendChild(item);
      }
    },

    // (E) ADD ITEM INTO CART
    add : (id) => {
      if (cart.items[id] == undefined) { cart.items[id] = 1; }
      else { cart.items[id]++; }
      cart.save(); cart.list();
    },

    // (F) CHANGE QUANTITY
    change : (pid, qty) => {
      // (F1) REMOVE ITEM
      if (qty <= 0) {
        delete cart.items[pid];
        cart.save(); cart.list();
      }

      // (F2) UPDATE TOTAL ONLY
      else {
        cart.items[pid] = qty;
        var total = 0;
        for (let id in cart.items) {
          total += cart.items[id] * products[id].price;
          document.getElementById("c-total").innerHTML ="TOTAL: Rs." + total;
        }
      }
    },

    // (G) REMOVE ITEM FROM CART
    remove : (id) => {
      delete cart.items[id];
      cart.save();
      cart.list();
    },

    // (H) CHECKOUT
    checkout : () => {
      if (confirm("Checkout?")) {
        location.href = 'pay.html';
      }
    }
  };
  window.addEventListener("DOMContentLoaded", cart.init);
