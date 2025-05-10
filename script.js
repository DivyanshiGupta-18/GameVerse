document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Hero Slider Functionality
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroDots.forEach(dot => dot.classList.remove('active'));
        heroSlides[index].classList.add('active');
        heroDots[index].classList.add('active');
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
        dot.addEventListener('click', () => {
            showSlide(index);
            startSlideInterval();
        });
    });

    if (heroSlides.length > 0) {
        showSlide(currentSlide);
        startSlideInterval();
    }

    // Shopping Cart functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');
    let cart = []; // Array to store cart items (for demo purposes)

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Your cart is empty.</p></div>';
            cartTotalElement.textContent = '$0.00';
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <div class="item-details">
                        <h4 class="item-name">${item.name}</h4>
                        <p class="item-price">$${item.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button class="decrease-qty" data-id="${item.id}">-</button>
                            <span class="item-qty">${item.quantity}</span>
                            <button class="increase-qty" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                `;
                cartItemsContainer.appendChild(cartItem);
                total += item.price * item.quantity;
            });
            cartTotalElement.textContent = `$${total.toFixed(2)}`;

            // Add event listeners for quantity changes and removal
            cartItemsContainer.querySelectorAll('.decrease-qty').forEach(btn => {
                btn.addEventListener('click', function() {
                    updateQuantity(this.dataset.id, -1);
                });
            });

            cartItemsContainer.querySelectorAll('.increase-qty').forEach(btn => {
                btn.addEventListener('click', function() {
                    updateQuantity(this.dataset.id, 1);
                });
            });

            cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    removeItem(this.dataset.id);
                });
            });
        }

        // Update cart count on the header
        const cartCount = document.querySelector('.cart-count');
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function addItemToCart(productId, productName, productPrice) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }
        updateCartDisplay();
        showNotification(`${productName} added to cart!`);
    }

    function updateQuantity(itemId, change) {
        const item = cart.find(i => i.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeItem(itemId);
            } else {
                updateCartDisplay();
            }
        }
    }

    function removeItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        updateCartDisplay();
        showNotification('Item removed from cart!');
    }

    if (cartIcon && cartSidebar && cartOverlay && closeCart && cartItemsContainer && cartTotalElement && checkoutBtn) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateCartDisplay(); // Initial cart display
        });

        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        cartOverlay.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Product Quick Actions
    const actionBtns = document.querySelectorAll('.action-btn');

    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const buttonType = this.querySelector('i').classList;
            const productCard = this.closest('.product-card');
            const productId = productCard ? productCard.dataset.productId : null;
            const productName = productCard ? productCard.querySelector('.product-title').textContent : 'Product';
            const productPrice = productCard ? parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')) : 10.00;

            const ripple = document.createElement('span');
            ripple.classList.add('btn-ripple');
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 800);

            if (buttonType.contains('fa-cart-plus') && productId) {
                addItemToCart(productId, productName, productPrice);
            } else if (buttonType.contains('fa-heart')) {
                showNotification('Product added to wishlist!');
            } else if (buttonType.contains('fa-eye')) {
                showNotification('Quick view is coming soon!');
            }
        });
    });

    // Show notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Back to top button functionality
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Dropdown hover effects for desktop
    const dropdowns = document.querySelectorAll('.dropdown');

    function handleDropdownHover() {
        if (window.innerWidth >= 992) {
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('mouseenter', function() {
                    this.querySelector('.dropdown-menu').classList.add('show');
                });

                dropdown.addEventListener('mouseleave', function() {
                    this.querySelector('.dropdown-menu').classList.remove('show');
                });
            });
        } else {
            // Remove hover listeners if window width is less than 992px
            dropdowns.forEach(dropdown => {
                dropdown.removeEventListener('mouseenter', function() {
                    this.querySelector('.dropdown-menu').classList.add('show');
                });
                dropdown.removeEventListener('mouseleave', function() {
                    this.querySelector('.dropdown-menu').classList.remove('show');
                });
            });
        }
    }

    handleDropdownHover();
    window.addEventListener('resize', handleDropdownHover);

    // Add CSS for notifications (since they're created dynamically)
    const notificationStyle = document.createElement('style');
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
    const scrollbarStyle = document.createElement('style');
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



// for testmoinal carousel
function addCustomSlickAttributes() {
    $("[data-my-slick-attr]").removeAttr("data-my-slick-attr");

    $(".slick-active").each(function(index, el) {
        $(el).attr("data-my-slick-attr", index);
    });
}

$(".slider").on("init", function(event, slick) {
    addCustomSlickAttributes();
});
$(document).ready(function () {
    $('#testimonialCarousel').carousel({
      interval: 5000,
      ride: 'carousel'
    });
  }); 
$('.slider').slick({
   slidesToShow: 3,
   slidesToScroll: 1,
   asNavFor: '.slider-for',
   dots: true,
   focusOnSelect: true
 });

$(".slider").on("afterChange", function(event, slick, current_slide_index, next_slide_index) {
    addCustomSlickAttributes();
});
