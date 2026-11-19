// ============================================
// 1. PRODUCT LIST
// ============================================

// One entry per shirt, in the same order as the shirts on the rack (left to right)
const products = [
  { name: 'Saint', price: 80, sizes: ['S', 'M', 'L'], image: 'images/saint.png' },
  { name: 'Burnt Red', price: 140, sizes: ['M', 'L', 'XL'], image: 'images/Lazydev.png' },
  { name: 'Evil Angel', price: 110, sizes: ['S', 'M', 'L'], image: 'images/Lazydev.png' },
];


// ============================================
// 2. VARIABLES THAT REMEMBER THINGS
// ============================================

// Every shirt button on the rack
const garments = document.querySelectorAll('.garment');

// Position of the shirt that is pulled out (null means none)
let selected = null;

// The product currently shown in the popup
let currentProduct = null;

// The size the shopper tapped in the popup
let selectedSize = null;


// ============================================
// 3. RACK: PUT SHIRTS BACK / PULL ONE OUT
// ============================================

// Puts every shirt back to its resting place
function resetRack() {
  garments.forEach(function (g) {
    // Remove the swing and slide classes from each shirt
    g.classList.remove('peek', 'push-left', 'push-right');
  });

  // Nothing is pulled out now
  selected = null
}

// Pulls out the shirt at position "index" and moves the others aside
function peekGarment(index) {
  // First put everything back
  resetRack();

  // Go through every shirt (g is the shirt, i is its position)
  garments.forEach(function (g, i) {
    if (i === index) {
      // The tapped shirt swings out
      g.classList.add('peek');
    } else if (i < index) {
      // Shirts before it slide left
      g.classList.add('push-left')
    } else {
      // Shirts after it slide right
      g.classList.add('push-right')
    }
  });

  // Remember which shirt is pulled out
  selected = index;

  // Find the hanger of the pulled-out shirt
  const hanger = garments[index].querySelector('.hanger');

  // Remove the swing animation so it can start again
  hanger.classList.remove('swing');

  // Forces the browser to reset, so the animation replays every time
  void hanger.offsetWidth;

  // Start the hanger swing animation
  hanger.classList.add('swing');

  // Slide the page so the pulled-out shirt is in the middle
  garments[index].scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
    block: 'nearest'
  });
}

// Add a tap listener to every shirt
garments.forEach(function (g, i) {
  g.addEventListener('click', function () {
    if (selected === i) {
      // Already pulled out, so a second tap opens the popup
      openFullview(i);
    } else {
      // Not pulled out yet, so a first tap pulls it out
      peekGarment(i);
    }
  });
});


// ============================================
// 4. THE POPUP (FULL VIEW)
// ============================================

// The popup box on the page
const modal = document.getElementById('modal');

// Fills the popup with product number "i" and shows it
function openFullview(i) {
  // Get the product from the list
  const p = products[i];

  // Remember which product is open
  currentProduct = p;

  // Reset the chosen size, so an old choice doesn't carry over
  selectedSize = null;

  // Write the name into the popup
  document.getElementById('modalname').textContent = p.name;

  // Write the price into the popup
  document.getElementById('modalprice').textContent ='$'+ p.price;

  // The box that holds the big picture
  const modalimage = document.getElementById('modalimage');

  // Use the product's picture as the box background
  modalimage.style.backgroundImage = `url("${p.image}")`;

  // Make the picture cover the whole box
  modalimage.style.backgroundSize = 'cover';

  // Keep the picture centered
  modalimage.style.backgroundPosition = 'center';

  // Don't repeat the picture
  modalimage.style.backgroundRepeat = 'no-repeat';

  // The empty box where size buttons go
  const sizesbox = document.getElementById('modalsizes');

  // Clear old size buttons so they don't pile up
  sizesbox.innerHTML = '';

  // Make one button for each size of this product
  p.sizes.forEach(function (size) {
    // Create a new button
    const b = document.createElement('button');

    // Put the size text on it (S, M, L...)
    b.textContent = size;

    // Give it the CSS class for styling
    b.className = 'size-btn';

    // When this size button is tapped...
    b.addEventListener('pointerup', function () {
      // Remember the chosen size
      selectedSize = size;

      // Remove the highlight from all size buttons
      sizesbox.querySelectorAll('.size-btn').forEach(function (x) {
        x.classList.remove('selected');
      });

      // Highlight only the tapped one
      b.classList.add('selected');
    });

    // Put the button inside the sizes box
    sizesbox.appendChild(b);
  });

  // Show the popup
  modal.hidden = false;
}


// ============================================
// 5. CLOSING THE POPUP / PUTTING SHIRTS BACK
// ============================================

// The X button closes the popup
document.getElementById('closebtn').addEventListener('click', function () {
  modal.hidden = true;
});

// Tapping the dark area outside the card closes the popup
modal.addEventListener('click', function (e) {
  // e.target is what was tapped; only close if it was the dark background itself
  if (e.target === modal) {
    modal.hidden = true;
  }
})

// Tapping empty space puts the shirts back
document.addEventListener('click', function (e) {
  // If the tap was not on a shirt and not inside the popup...
  if (!e.target.closest('.garment') && !e.target.closest('.modal')) {
    resetRack();
  }
});


// ============================================
// 6. KEYBOARD CONTROLS
// ============================================

document.addEventListener('keydown', function (e) {
  // Escape key
  if (e.key === 'Escape') {
    if (!modal.hidden) {
      // Popup is open, so close it
      modal.hidden = true;
    } else if (!cartPanel.hidden || !menuPanel.hidden) {
      // Close the cart or menu if either one is open
      closePanels();
    } else {
      // No popup or side panel is open, so put shirts back
      resetRack();
    }
  }

  // Stop here if no shirt is pulled out, or the popup is open
  if (selected === null || !modal.hidden) return;

  // Right arrow: pull out the next shirt (if there is one)
  if (e.key === 'ArrowRight' && selected < garments.length - 1) {
    peekGarment(selected + 1);
  }

  // Left arrow: pull out the previous shirt (if there is one)
  if (e.key === 'ArrowLeft' && selected > 0) {
    peekGarment(selected - 1);
  }
});


// ============================================
// 7. SWIPE (PHONES)
// ============================================

// The rack area where swipes are detected
const rack = document.querySelector('.rack');

// Where the finger first touched (left-to-right position)
let startX = 0;

// When a finger touches down, remember where
rack.addEventListener('touchstart', function (e) {
  startX = e.touches[0].clientX;
});

// When the finger lifts off...
rack.addEventListener('touchend', function (e) {
  // How far it moved sideways (negative = left, positive = right)
  const diff = e.changedTouches[0].clientX - startX;

  // Under 50 pixels is just a tap, so do nothing
  if (Math.abs(diff) < 50) return;

  // Swipe left = right arrow, swipe right = left arrow
  const key = diff < 0 ? 'ArrowRight' : 'ArrowLeft';

  // Pretend that arrow key was pressed, so the keyboard code above does the work
  document.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
});


// ============================================
// 8. AUTO SPACING FOR THE RACK
// ============================================

/**
 for spacing to automatically adjust itself no matter amount of clothes on a rack
 */

// The row that holds all the shirts
const clothesRow = document.querySelector('.clothes');

// Count the shirts and give that number to the CSS variable --n
clothesRow.style.setProperty('--n', clothesRow.children.length);


// ============================================
// 9. CART
// ============================================

// Load the saved cart from the browser, or start with an empty one
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// The little red circle with the number
const badge = document.getElementById('cart-count');

// Updates the red circle
function showCount() {
  // Write how many items are in the cart
  badge.textContent = cart.length;

  // Hide the circle when the cart is empty
  badge.hidden = cart.length === 0;
}

// When "Add to cart" is tapped...
document.querySelector('.add-btn').addEventListener('click', function () {
  // No size picked yet, so ask for one and stop
  if (!selectedSize) {
    alert('Please pick a size');
    return;
  }

  // Add the item (its name and size) to the cart list
  cart.push({ id: currentProduct.name, size: selectedSize });

  // Save the cart in the browser so it survives a refresh
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update the red circle
  showCount();

  // Close the popup
  document.getElementById('modal').hidden = true;
});

// Show the right number when the page first loads
showCount();

const cartPanel = document.getElementById('cart-panel');

// The dark layer behind the menu and cart
const backdrop = document.getElementById('backdrop');

document.querySelector('.cart-btn').addEventListener('click', function () {
  renderCart();
  cartPanel.hidden = false;
  showBackdrop();
});

document.getElementById('close-cart').addEventListener('click', function () {
  cartPanel.hidden = true;
  hideBackdropIfNoPanels();
});


function renderCart() {
  const box = document.getElementById('cart-items')
  let html = '';
  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const product = products.find(function(p){
      return p.name === item.id;

    }
  );
  if (!product) continue;

  total = total + product.price;

  html += `
      <div class="cart-row">
        <img src="${product.image}" alt="">
        <div>
          <p>${product.name}</p>
          <p>Size ${item.size} · $${product.price}</p>
        </div>
        <button class="remove-btn" onclick="removeItem(${i})">Remove</button>
      </div>
    `;
  }
  if (cart.length === 0) {
    html = '<p> Your cart is empty </p>';
  }
  box.innerHTML= html;
  document.getElementById('cart-total').textContent = '$' + total;
}

function removeItem(i) {
  cart.splice(i, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  showCount();
  renderCart();
}

const menuPanel = document.getElementById('menu-panel');

// Show the dark background and prevent the page behind it from scrolling
function showBackdrop() {
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
}

// Hide the dark background only when both side panels are closed
function hideBackdropIfNoPanels() {
  if (cartPanel.hidden && menuPanel.hidden) {
    backdrop.hidden = true;
    document.body.style.overflow = '';
  }
}

// Close both side panels and restore the page
function closePanels() {
  cartPanel.hidden = true;
  menuPanel.hidden = true;
  backdrop.hidden = true;
  document.body.style.overflow = '';
}

// Open the menu
document.getElementById('menu-btn').addEventListener('click', function () {
  menuPanel.hidden = false;
  showBackdrop();
});

// Close with the X
document.getElementById('close-menu').addEventListener('click', function () {
  menuPanel.hidden = true;
  hideBackdropIfNoPanels();
});

// "Shop" just closes the menu and shows the rack
document.getElementById('menu-shop').addEventListener('click', function (e) {
  e.preventDefault();
  menuPanel.hidden = true;
  hideBackdropIfNoPanels();
});


// Tapping the dark background closes the menu and cart
backdrop.addEventListener('click', function () {
  closePanels();
});