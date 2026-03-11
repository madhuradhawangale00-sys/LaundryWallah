// --------------------
// ELEMENT SELECTORS
// --------------------
const addButtons = document.querySelectorAll(".service-item .add");
const cartTable = document.querySelector(".cartTable");
const addedItemsDiv = document.querySelector(".added-items");
const totalAmountEl = document.querySelector(".totalAmount");
const bookBtn = document.querySelector(".book-btn");
const bookMsg = document.getElementById("b-msg");

// Subscribe elements
const subBtn = document.querySelector(".sub-btn");
const subText = document.querySelector("#sub-p");

// --------------------
// STATE VARIABLES
// --------------------
let cart = [];
let totalAmount = 0;
bookBtn.style.backgroundColor = "rgba(86,20,200,0.2)";


// --------------------
// CART BUTTON CLICK
// --------------------
addButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const parent = btn.closest(".service-item");
    const name = parent.dataset.name;
    const price = parseFloat(parent.dataset.price);

    const index = cart.findIndex((item) => item.name === name);

    if (index === -1) {
      // Add item
      cart.push({ name, price });
      btn.innerHTML = `<p>Remove Item</p><ion-icon name="remove-circle-outline"></ion-icon>`;
      btn.style.backgroundColor = "rgba(253,233,233,1)";
      btn.style.color = "red";
    } else {
      // Remove item
      cart.splice(index, 1);
      btn.innerHTML = `<p>Add item</p><ion-icon name="add-circle-outline"></ion-icon>`;
      btn.style.backgroundColor = "";
      btn.style.color = "black";
    }

    updateCart();
  });
});


// --------------------
// UPDATE CART TABLE
// --------------------
function updateCart() {
  const oldRows = cartTable.querySelectorAll("tr:not(:first-child)");
  oldRows.forEach((row) => row.remove());

  if (cart.length === 0) {
    addedItemsDiv.style.display = "flex";
    totalAmountEl.textContent = "0.00";
    totalAmount = 0;
    bookBtn.style.backgroundColor = "rgba(86,20,200,0.2)";
    return;
  }

  addedItemsDiv.style.display = "none";
  totalAmount = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>₹${item.price.toFixed(2)}</td>
    `;

    cartTable.appendChild(row);
    totalAmount += item.price;
  });

  totalAmountEl.textContent = totalAmount.toFixed(2);
  bookBtn.style.backgroundColor = "rgb(86,20,200)";
}



// --------------------
// BOOK BUTTON CLICK
// --------------------
bookBtn.addEventListener("click", () => {
    // 1. Check if Cart is empty
    if (cart.length === 0) {
        bookMsg.textContent = "⚠️ Please add a service to your cart before booking!";
        bookMsg.style.color = "red";
        return;
    }

    // 2. Get Form Values
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#phone").value.trim();

    // 3. Validate Form
    if (!name || !email || !phone) {
        bookMsg.textContent = "⚠️ Please fill all fields before booking!";
        bookMsg.style.color = "red";
        return;
    }

    // 4. UI Loading State
    bookBtn.disabled = true;
    bookBtn.style.opacity = "0.5";
    bookMsg.textContent = "⏳ Processing your booking...";
    bookMsg.style.color = "orange";

    // 5. Collect service list for the email
    const servicesText = cart.map(
        (item) => `• ${item.name} - ₹${item.price.toFixed(2)}`
    ).join("\n");

    // 6. EMAIL SENDING
    // Make sure 'message' in your EmailJS template matches this key
    const templateParams = {
        to_name: name,
        to_email: email,
        from_email: email,
        phone: phone,
        total_amount: totalAmount.toFixed(2),
        message: `Selected Services:\n${servicesText}\n\nTotal: ₹${totalAmount.toFixed(2)}`
    };

    emailjs.send("service_i3dkckd", "template_6utmdwj", templateParams)
        .then(() => {
            // SUCCESS UI
            bookMsg.textContent = "✅ Booking confirmed! Email sent successfully.";
            bookMsg.style.color = "green";
            
            // Wait 3 seconds so they can read it, then reset
            setTimeout(() => { 
                bookMsg.textContent = ""; 
                resetAll(); 
                bookBtn.disabled = false;
                bookBtn.style.opacity = "1";
            }, 3000);
        })
        .catch((error) => {
            // ERROR UI
            console.error("EmailJS Error:", error);
            bookMsg.textContent = "⚠️ Booking failed. Please try again or check your connection.";
            bookMsg.style.color = "red";
            bookBtn.disabled = false;
            bookBtn.style.opacity = "1";
        });
});


// --------------------
// RESET AFTER BOOKING
// --------------------
function resetAll() {
  cart = [];
  updateCart();

  addButtons.forEach((btn) => {
    btn.innerHTML = `<p>Add item</p><ion-icon name="add-circle-outline"></ion-icon>`;
    btn.style.backgroundColor = "";
    btn.style.color = "black";
  });

  document.querySelector("#name").value = "";
  document.querySelector("#email").value = "";
  document.querySelector("#phone").value = "";
}



// --------------------
// SUBSCRIBE SECTION
// --------------------
subBtn.addEventListener("click", () => {
  const subName = document.querySelector("#sub-name");
  const subEmail = document.querySelector("#sub-email");

  if (subName.value.trim() === "" || subEmail.value.trim() === "") {
    subText.textContent = "⚠️ Please fill all fields before Subscribing🔔.";
    subText.style.color = "red";
    setTimeout(() => (subText.textContent = ""), 1200);
    return;
  }

  subText.textContent = "Thank you for Subscribing🔔 us!";
  subText.style.color = "green";

  setTimeout(() => {
    subText.textContent = "";
    subName.value = "";
    subEmail.value = "";
  }, 1200);
});

