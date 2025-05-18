document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS animation library
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });

  // Initialize cart functionality
  const cart = new Cart();
  cart.init();

  // Initialize product interactions
  const products = new ProductInteractions();
  products.init();

  // Initialize UI components
  const ui = new UI();
  ui.init();

  // Hero Slider Functionality
  const heroSlides = document.querySelectorAll(".hero-slide");
  const heroDots = document.querySelectorAll(".hero-dot");
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    heroSlides.forEach((slide) => slide.classList.remove("active"));
    heroDots.forEach((dot) => dot.classList.remove("active"));
    heroSlides[index].classList.add("active");
    heroDots[index].classList.add("active");
    currentSlide = index;
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % heroSlides.length;
    showSlide(nextIndex);
  }

  function startSlideInterval() {
    clearInterval(slideInterval); // Clear any existing interval
    slideInterval = setInterval(nextSlide, 5000);
  }

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startSlideInterval();
    });
  });

  if (heroSlides.length > 0) {
    showSlide(currentSlide);
    startSlideInterval();
  }

  // Dropdown hover effects for desktop
  const dropdowns = document.querySelectorAll(".dropdown");

  function handleDropdownHover() {
    if (window.innerWidth >= 992) {
      dropdowns.forEach((dropdown) => {
        dropdown.addEventListener("mouseenter", function () {
          this.querySelector(".dropdown-menu").classList.add("show");
        });

        dropdown.addEventListener("mouseleave", function () {
          this.querySelector(".dropdown-menu").classList.remove("show");
        });
      });
    } else {
      // Remove hover listeners if window width is less than 992px
      dropdowns.forEach((dropdown) => {
        dropdown.removeEventListener("mouseenter", function () {
          this.querySelector(".dropdown-menu").classList.add("show");
        });
        dropdown.removeEventListener("mouseleave", function () {
          this.querySelector(".dropdown-menu").classList.remove("show");
        });
      });
    }
  }

  handleDropdownHover();
  window.addEventListener("resize", handleDropdownHover);

  // Add CSS for notifications (since they're created dynamically)
  const notificationStyle = document.createElement("style");
  notificationStyle.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #fff;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            z-index: 2000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }

        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }

        .notification-content {
            display: flex;
            align-items: center;
        }

        .notification-content i {
            color: var(--success-color);
            font-size: 1.2rem;
            margin-right: 10px;
        }

        .btn-ripple {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.5);
            display: block;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.8s linear;
        }

        @keyframes ripple {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }

        /* Cart Sidebar Styles (added dynamically for completeness if not in CSS) */
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid var(--border-color);
        }

        .cart-item .item-details {
            flex-grow: 1;
        }

        .cart-item .item-name {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .cart-item .item-price {
            font-size: 0.9rem;
            color: var(--primary-color);
        }

        .cart-item .quantity-controls {
            display: flex;
            align-items: center;
            margin-top: 5px;
        }

        .cart-item .quantity-controls button {
            background: none;
            border: 1px solid var(--gray-color);
            width: 25px;
            height: 25px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 0.8rem;
            margin: 0 5px;
        }

        .cart-item .item-qty {
            font-size: 0.9rem;
            margin: 0 5px;
        }

        .cart-item .remove-item {
            background: none;
            border: none;
            color: var(--danger-color);
            font-size: 1rem;
            cursor: pointer;
        }

        .empty-cart {
            text-align: center;
            padding: 20px;
            color: var(--gray-color);
        }

        .empty-cart i {
            font-size: 2rem;
            margin-bottom: 10px;
        }
    `;
  document.head.appendChild(notificationStyle);

  // Add CSS for scrollbar customization (moved to dynamic style for completeness)
  const scrollbarStyle = document.createElement("style");
  scrollbarStyle.textContent = `
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--primary-hover);
        }
    `;
  document.head.appendChild(scrollbarStyle);
});

// Cart Class
class Cart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.cartIcon = document.querySelector(".cart-icon");
    this.cartSidebar = document.querySelector(".cart-sidebar");
    this.cartOverlay = document.querySelector(".cart-overlay");
    this.closeCart = document.querySelector(".close-cart");
    this.cartItemsContainer = document.querySelector(".cart-items");
    this.cartTotalElement = document.querySelector(".total-price");
    this.checkoutBtn = document.querySelector(".checkout-btn");
  }

  init() {
    this.bindEvents();
    this.updateCartDisplay();
  }

  bindEvents() {
    this.cartIcon?.addEventListener("click", () => this.openCart());
    this.closeCart?.addEventListener("click", () => this.closeCartSidebar());
    this.cartOverlay?.addEventListener("click", () => this.closeCartSidebar());
  }

  openCart() {
    this.cartSidebar?.classList.add("active");
    this.cartOverlay?.classList.add("active");
    document.body.style.overflow = "hidden";
    this.updateCartDisplay();
  }

  closeCartSidebar() {
    this.cartSidebar?.classList.remove("active");
    this.cartOverlay?.classList.remove("active");
    document.body.style.overflow = "";
  }

  addItem(product) {
    const existingItem = this.items.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.updateCartDisplay();
    this.showNotification(`${product.name} added to cart!`);
  }

  updateCartDisplay() {
    if (!this.cartItemsContainer) return;

    this.cartItemsContainer.innerHTML = "";
    this.total = 0;

    if (this.items.length === 0) {
      this.cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="#" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
      this.cartTotalElement.textContent = "$0.00";
      this.checkoutBtn.disabled = true;
      return;
    }

    this.checkoutBtn.disabled = false;
    this.items.forEach((item) => {
      const cartItem = this.createCartItemElement(item);
      this.cartItemsContainer.appendChild(cartItem);
      this.total += item.price * item.quantity;
    });

    this.cartTotalElement.textContent = `$${this.total.toFixed(2)}`;
    this.updateCartCount();
  }

  createCartItemElement(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
            <div class="item-details">
                <h4 class="item-name">${item.name}</h4>
                <p class="item-price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="decrease-qty" data-id="${item.id}">-</button>
                    <span class="item-qty">${item.quantity}</span>
                    <button class="increase-qty" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;

    this.bindCartItemEvents(div, item);
    return div;
  }

  bindCartItemEvents(element, item) {
    element
      .querySelector(".decrease-qty")
      .addEventListener("click", () => this.updateQuantity(item.id, -1));
    element
      .querySelector(".increase-qty")
      .addEventListener("click", () => this.updateQuantity(item.id, 1));
    element
      .querySelector(".remove-item")
      .addEventListener("click", () => this.removeItem(item.id));
  }

  updateQuantity(itemId, change) {
    const item = this.items.find((i) => i.id === itemId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeItem(itemId);
      } else {
        this.updateCartDisplay();
      }
    }
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
    this.updateCartDisplay();
    this.showNotification("Item removed from cart!");
  }

  updateCartCount() {
    const cartCount = document.querySelector(".cart-count");
    if (cartCount) {
      cartCount.textContent = this.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    }
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
    document.body.appendChild(notification);

    requestAnimationFrame(() => notification.classList.add("show"));
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Product Interactions Class
class ProductInteractions {
  constructor() {
    this.actionBtns = document.querySelectorAll(".action-btn");
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.actionBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleActionClick(e, btn));
    });
  }

  handleActionClick(e, btn) {
    e.preventDefault();
    const buttonType = btn.querySelector("i").classList;
    const productCard = btn.closest(".product-card");

    if (!productCard) return;

    const product = {
      id: productCard.dataset.productId,
      name: productCard.querySelector(".product-title").textContent,
      price: parseFloat(
        productCard.querySelector(".product-price").textContent.replace("$", "")
      ),
    };

    this.addRippleEffect(btn);

    if (buttonType.contains("fa-cart-plus")) {
      window.cart.addItem(product);
    } else if (buttonType.contains("fa-heart")) {
      this.showNotification("Product added to wishlist!");
    } else if (buttonType.contains("fa-eye")) {
      this.showNotification("Quick view is coming soon!");
    }
  }

  addRippleEffect(btn) {
    const ripple = document.createElement("span");
    ripple.classList.add("btn-ripple");
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  }

  showNotification(message) {
    window.cart.showNotification(message);
  }
}

// UI Class
class UI {
  constructor() {
    this.backToTopBtn = document.getElementById("backToTop");
    this.dropdowns = document.querySelectorAll(".dropdown");
  }

  init() {
    this.initBackToTop();
    this.initDropdowns();
    this.initTestimonialCarousel();
  }

  initBackToTop() {
    if (!this.backToTopBtn) return;

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        this.backToTopBtn.classList.add("active");
      } else {
        this.backToTopBtn.classList.remove("active");
      }
    });

    this.backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  initDropdowns() {
    if (window.innerWidth >= 992) {
      this.dropdowns.forEach((dropdown) => {
        dropdown.addEventListener("mouseenter", () => {
          dropdown.querySelector(".dropdown-menu").classList.add("show");
        });

        dropdown.addEventListener("mouseleave", () => {
          dropdown.querySelector(".dropdown-menu").classList.remove("show");
        });
      });
    }
  }

  initTestimonialCarousel() {
    const carousel = document.getElementById("testimonialCarousel");
    if (!carousel) return;

    new bootstrap.Carousel(carousel, {
      interval: 5000,
      ride: "carousel",
    });
  }
}

// for testmoinal carousel
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('testimonialCarousel');
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const indicators = Array.from(carousel.querySelectorAll('.indicator'));
    const nextButton = carousel.querySelector('.carousel-control-next');
    const prevButton = carousel.querySelector('.carousel-control-prev');
    
    let currentIndex = 0;
    let autoplayInterval;
    const autoplayDelay = 5000; // 5 seconds
    
    // Update the carousel to show the slide at the current index
    function updateCarousel() {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        slides[currentIndex].classList.add('active');
        
        // Update indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        indicators[currentIndex].classList.add('active');
        
        // Update track position to show current slide (100% width per slide)
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update button states
        updateButtonStates();
    }
    
    // Update button states based on current slide
    function updateButtonStates() {
        // Reset button states
        prevButton.classList.remove('disabled');
        nextButton.classList.remove('disabled');
        
        // Disable previous button on first slide
        if (currentIndex === 0) {
            prevButton.classList.add('disabled');
        }
        
        // Disable next button on last slide
        if (currentIndex === slides.length - 1) {
            nextButton.classList.add('disabled');
        }
    }
    
    // Next slide function
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }
    
    // Previous slide function
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }
    
    // Set up event listeners for next/prev buttons
    nextButton.addEventListener('click', function() {
        nextSlide();
        resetAutoplay();
    });
    
    prevButton.addEventListener('click', function() {
        prevSlide();
        resetAutoplay();
    });
    
    // Set up event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentIndex = index;
            updateCarousel();
            resetAutoplay();
        });
    });
    
    // Set up autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', function() {
        clearInterval(autoplayInterval);
    });
    
    carousel.addEventListener('mouseleave', function() {
        startAutoplay();
    });
    
    // Touch support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            nextSlide();
            resetAutoplay();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            prevSlide();
            resetAutoplay();
        }
    }
    
    // Initialize carousel
    updateCarousel();
    startAutoplay();
});






 // Get references to navbar links
  document.addEventListener("DOMContentLoaded", function() {
            // Get references to navbar links
            const featuredProductsLink = document.getElementById('featuredProducts');
            const tournamentLink = document.getElementById('tournament');
            
            // Add event listeners for smooth scroll
            if (featuredProductsLink) {
                featuredProductsLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    const featuredSection = document.getElementById('featuredSection');
                    if (featuredSection) {
                        featuredSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
            
            if (tournamentLink) {
                tournamentLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    const tournamentSection = document.getElementById('tournamentS');
                    if (tournamentSection) {
                        tournamentSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        });