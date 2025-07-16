document.addEventListener('DOMContentLoaded', function() {
  // Food data 
  const foodItems = [
    {
      id: 1,
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice cooked with tender chicken pieces and aromatic spices',
      price: 250,
      category: 'biryani',
      image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=1188&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 2,
      name: 'Veg Biryani',
      description: 'Flavorful rice dish with mixed vegetables and aromatic spices',
      price: 200,
      category: 'biryani',
      image: 'https://images.unsplash.com/photo-1630409346824-4f0e7b080087?q=80&w=1246&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 3,
      name: 'Butter Chicken',
      description: 'Tender chicken in a creamy tomato-based sauce',
      price: 300,
      category: 'chicken',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format'
    },
    {
      id: 4,
      name: 'Chicken Tikka Masala',
      description: 'Grilled chicken chunks in spiced curry sauce',
      price: 350,
      category: 'chicken',
      image: 'https://images.unsplash.com/photo-1602253057119-44d745d9b860?w=600&auto=format'
    },
    {
      id: 5,
      name: 'Paneer Butter Masala',
      description: 'Cottage cheese in rich creamy tomato gravy',
      price: 250,
      category: 'vegetarian',
      image: 'https://images.unsplash.com/photo-1701579231378-3726490a407b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 6,
      name: 'Dal Makhani',
      description: 'Creamy black lentils slow-cooked with butter and spices',
      price: 150,
      category: 'vegetarian',
      image: 'https://sinfullyspicy.com/wp-content/uploads/2015/03/1200-by-1200-images-1.jpg',
    },
    {
      id: 7,
      name: 'Veg Fried Rice',
      description: 'Stir-fried rice with mixed vegetables and soy sauce',
      price: 100,
      category: 'vegetarian',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format'
    },
    {
      id: 8,
      name: 'Chicken Manchurian',
      description: 'Crispy chicken in sweet and spicy sauce',
      price: 120,
      category: 'chicken',
      image: 'https://pupswithchopsticks.com/wp-content/uploads/chicken-manchurian-tnnew.webp'
    }
  ];

  // DOM elements
  const elements = {
    foodGrid: document.getElementById('food-grid'),
    cartItems: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    cartCount: document.getElementById('cart-count'),
    cartOverlay: document.getElementById('cart-overlay'),
    cartIcon: document.getElementById('cart-icon'),
    closeCart: document.getElementById('close-cart'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    suggestionsContainer: document.getElementById('search-suggestions'),
    categoryCards: document.querySelectorAll('.category-card'),
    addAddress: document.getElementById('add-address'),
    orderNowBtn: document.querySelector('.order-now')
  };

  // Create delivery time badge
  const deliveryTimeBadge = document.createElement('div');
  deliveryTimeBadge.className = 'delivery-time';
  deliveryTimeBadge.innerHTML = '<i class="fas fa-clock"></i> <span>Calculating...</span>';
  document.body.appendChild(deliveryTimeBadge);

  // Cart state
  let cart = [];

  /* ========== CORE FUNCTIONS ========== */

  // Initialize app
  function init() {
    renderFoodItems(foodItems);
    setupEventListeners();
    initDarkMode();
    initDeliveryTime();
    loadCart(); // Load saved cart after rendering
  }

  /* ========== CART SYSTEM ========== */

  function loadCart() {
    try {
      const savedCart = localStorage.getItem('crave-hunter-cart');
      if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      cart = [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem('crave-hunter-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  function addToCart(itemId) {
    const item = foodItems.find(i => i.id === itemId);
    if (!item) {
      console.error('Item not found:', itemId);
      return;
    }

    const existingItem = cart.find(i => i.id === itemId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    // Button animation
    const addButton = document.querySelector(`.add-to-cart[data-id="${itemId}"]`);
    if (addButton) {
      addButton.classList.add('add-to-cart-animate');
      setTimeout(() => addButton.classList.remove('add-to-cart-animate'), 500);
    }

    showNotification(`${item.name} added to cart!`);
    updateCartDisplay();
    saveCart();
  }

  function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;

    // Update cart items display
    if (cart.length === 0) {
      elements.cartItems.innerHTML = '<p style="text-align: center; color: #666; margin: 2rem 0;">Your cart is empty</p>';
    } else {
      elements.cartItems.innerHTML = '';
      cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <p class="cart-item-price">₹${item.price}</p>
            <div class="cart-item-actions">
              <button class="decrease-quantity" data-id="${item.id}">-</button>
              <span class="cart-item-quantity">${item.quantity}</span>
              <button class="increase-quantity" data-id="${item.id}">+</button>
              <button class="remove-item" data-id="${item.id}">×</button>
            </div>
          </div>
        `;
        elements.cartItems.appendChild(cartItem);
      });
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    elements.cartTotal.textContent = `₹${total}`;
  }

  function handleCartAction(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    const itemId = parseInt(btn.dataset.id);
    if (isNaN(itemId)) return;

    if (btn.classList.contains('increase-quantity')) {
      updateQuantity(itemId, 1);
    } else if (btn.classList.contains('decrease-quantity')) {
      updateQuantity(itemId, -1);
    } else if (btn.classList.contains('remove-item')) {
      removeFromCart(itemId);
    }
  }

  function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartDisplay();
      saveCart();
    }
  }

  function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    saveCart();
    
    const removedItem = foodItems.find(item => item.id === itemId);
    if (removedItem) {
      showNotification(`${removedItem.name} removed from cart!`);
    }
  }

  function toggleCart() {
    const isVisible = elements.cartOverlay.style.display === 'flex';
    elements.cartOverlay.style.display = isVisible ? 'none' : 'flex';
  }

  // Dark mode 
  function initDarkMode() {
    const themeToggle = document.querySelector('.theme-toggle');
    const isDark = localStorage.getItem('darkMode') === 'true';
    
    if (isDark) {
      document.body.classList.add('dark-mode');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkNow = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDarkNow);
      themeToggle.innerHTML = isDarkNow ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
  }

  // Delivery time 
  function initDeliveryTime() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const distance = Math.sqrt(lat*lat + lon*lon);
          const time = Math.max(20, Math.min(60, Math.round(distance * 10)));
          deliveryTimeBadge.innerHTML = `<i class="fas fa-clock"></i> <span>~${time} mins</span>`;
          deliveryTimeBadge.style.display = 'flex';
        },
        (error) => {
          console.error("Geolocation error:", error);
          deliveryTimeBadge.innerHTML = '<i class="fas fa-clock"></i> <span>Enable location</span>';
          deliveryTimeBadge.style.display = 'flex';
        }
      );
    } else {
      deliveryTimeBadge.innerHTML = '<i class="fas fa-clock"></i> <span>Location unavailable</span>';
      deliveryTimeBadge.style.display = 'flex';
    }
  }

  // Search and filter 
  function handleSearch() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const filteredItems = searchTerm 
      ? foodItems.filter(item => 
          item.name.toLowerCase().includes(searchTerm) || 
          item.description.toLowerCase().includes(searchTerm)
        )
      : foodItems;
    renderFoodItems(filteredItems);
  }

  function handleSearchSuggestions() {
    const inputText = elements.searchInput.value.toLowerCase();
    elements.suggestionsContainer.innerHTML = '';
    
    if (inputText.length > 0) {
      const matches = foodItems.filter(item => 
        item.name.toLowerCase().includes(inputText) || 
        item.description.toLowerCase().includes(inputText)
      );
      
      if (matches.length > 0) {
        elements.suggestionsContainer.style.display = 'block';
        matches.forEach(match => {
          const suggestion = document.createElement('div');
          suggestion.textContent = match.name;
          suggestion.addEventListener('click', () => {
            elements.searchInput.value = match.name;
            elements.suggestionsContainer.style.display = 'none';
            handleSearch();
          });
          elements.suggestionsContainer.appendChild(suggestion);
        });
      } else {
        elements.suggestionsContainer.style.display = 'none';
      }
    } else {
      elements.suggestionsContainer.style.display = 'none';
    }
  }

  function filterFoodItems(category) {
    const filteredItems = category === 'all' 
      ? foodItems 
      : foodItems.filter(item => item.category === category);
    renderFoodItems(filteredItems);
  }

  // Render functions
  function renderFoodItems(items) {
    elements.foodGrid.innerHTML = '';
    items.forEach(item => {
      const foodCard = document.createElement('div');
      foodCard.className = 'food-card';
      foodCard.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="food-img">
        <div class="food-info">
          <h3 class="food-name">${item.name}</h3>
          <p class="food-desc">${item.description}</p>
          <p class="food-price">₹${item.price}</p>
          <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
        </div>
      `;
      elements.foodGrid.appendChild(foodCard);
    });
  }

  function showNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.cart-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }

  /* ========== EVENT LISTENERS ========== */

  function setupEventListeners() {
    // Cart events
    elements.cartIcon.addEventListener('click', toggleCart);
    elements.closeCart.addEventListener('click', toggleCart);
    elements.cartOverlay.addEventListener('click', (e) => {
      if (e.target === elements.cartOverlay) toggleCart();
    });
    elements.cartItems.addEventListener('click', handleCartAction);

    // Food grid events
    elements.foodGrid.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        const itemId = parseInt(e.target.dataset.id);
        if (!isNaN(itemId)) {
          addToCart(itemId);
        }
      }
    });

    // Search events
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('input', handleSearchSuggestions);
    elements.searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') handleSearch();
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!elements.searchInput.contains(e.target) && !elements.suggestionsContainer.contains(e.target)) {
        elements.suggestionsContainer.style.display = 'none';
      }
    });

    // Category events
    elements.categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        filterFoodItems(card.dataset.category);
        elements.categoryCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    // Other events
    elements.addAddress.addEventListener('click', () => {
      const newAddress = prompt('Enter your delivery address:');
      if (newAddress && newAddress.trim()) {
        elements.addAddress.querySelector('span').textContent = newAddress.trim();
      }
    });

    elements.orderNowBtn.addEventListener('click', () => {
      document.querySelector('#popular-items').scrollIntoView({
        behavior: 'smooth'
      });
    });

    // Smooth scrolling for menu links
    document.querySelectorAll('.menu-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
          showNotification('Your cart is empty!');
          return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Order placed successfully!\nTotal: ₹${total}\nThank you for your order!`);
        
        // Clear cart after successful order
        cart = [];
        updateCartDisplay();
        saveCart();
        toggleCart();
      });
    }
  }

  // Initialize the app
  init();
});
