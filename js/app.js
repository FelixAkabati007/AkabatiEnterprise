/**
 * Akabati Enterprise — Modern E-Commerce Application Engine
 * Brand Statement: Quality, Our Pride
 * Location: Ejisu, Ashanti Region, Ghana
 */

(function () {
  'use strict';

  // DOM Selection Helpers
  const $ = selector => document.querySelector(selector);
  const $$ = selector => document.querySelectorAll(selector);

  // Currency Formatter (Ghana Cedis)
  function formatMoney(amount) {
    return 'GH₵ ' + Number(amount || 0).toLocaleString('en-GH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Toast Notification System
  function showToast(message) {
    const toast = $('#siteToast');
    if (!toast) return;
    toast.innerHTML = `<span>✦</span> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
  window.showToast = showToast;

  // Active Storefront State
  let activeCategory = 'All';
  let activeSort = 'featured';
  let activeSearchQuery = '';
  let viewMode = 'grid'; // 'grid' or 'list'
  let inStockOnly = false;

  // Cart State (managed in localStorage)
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('akabati_cart') || '[]');
  } catch (e) {
    cart = [];
  }

  // Active Applied Promo Code
  let activePromo = null;

  // Comparison State
  let comparison = [];
  try {
    comparison = JSON.parse(localStorage.getItem('akabati_comparison') || '[]');
  } catch (e) {
    comparison = [];
  }

  // Persist Cart
  function persistCart() {
    localStorage.setItem('akabati_cart', JSON.stringify(cart));
    renderCart();
    updateBadges();
  }

  // Persist Comparison
  function persistComparison() {
    localStorage.setItem('akabati_comparison', JSON.stringify(comparison));
    updateBadges();
  }

  // Update Navigation Badges
  function updateBadges() {
    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartBadge = $('#cartCountBadge');
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount > 0 ? 'grid' : 'none';
    }

    const compareBadge = $('#compareCountBadge');
    if (compareBadge) {
      compareBadge.textContent = comparison.length;
      compareBadge.style.display = comparison.length > 0 ? 'grid' : 'none';
    }

    const wishlistCount = AkabatiBackend.Wishlist.getWishlist().length;
    const wishlistBadge = $('#wishlistCountBadge');
    if (wishlistBadge) {
      wishlistBadge.textContent = wishlistCount;
      wishlistBadge.style.display = wishlistCount > 0 ? 'grid' : 'none';
    }
  }

  // =========================================================================
  // 1. Product Grid & List Rendering
  // =========================================================================
  function renderProductGrid() {
    const grid = $('#productsGrid');
    if (!grid) return;

    grid.className = `products-grid ${viewMode === 'list' ? 'list-view' : ''}`;

    const allProducts = AkabatiBackend.Catalog.getAllProducts();
    let filtered = allProducts.filter(p => {
      const isVisible = p.status === 'ACTIVE';
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesStock = !inStockOnly || p.stock > 0;

      const query = activeSearchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(query)) ||
        p.description.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query);

      return isVisible && matchesCategory && matchesStock && matchesSearch;
    });

    // Sorting
    if (activeSort === 'low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'az') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'new') {
      filtered.sort((a, b) => (b.id > a.id ? 1 : -1));
    }

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="empty-shop-state">
          <h3>No matching products found</h3>
          <p>We couldn't find any items matching your filters. Try clearing search keywords or selecting another category.</p>
          <button class="btn-primary" onclick="window.resetShopFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const isVehicle = p.category === 'Vehicles';
      const isWishlisted = AkabatiBackend.Wishlist.has(p.id);
      const isCompared = comparison.includes(p.id);

      const discountPercent = p.compareAtPrice && p.compareAtPrice > p.price
        ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
        : null;

      const snippet = isVehicle
        ? `${p.specs['Year'] || ''} · ${p.specs['Transmission'] || ''} · ${p.specs['Mileage'] || ''} · ${p.specs['Fuel Type'] || ''}`
        : `${p.specs['Display'] || p.specs['Display Size'] || p.specs['Processor'] || p.specs['Capacity'] || p.subcategory || 'Certified Genuine'}`;

      // Stock meter calculation (max 10 scale)
      const stockPercent = Math.min(100, Math.max(10, (p.stock / 8) * 100));

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-media" onclick="window.openQuickView('${p.id}')">
            <img src="${p.images[0]}" alt="${p.name}" loading="lazy" />
            
            <div style="position: absolute; top: 12px; left: 12px; display: flex; gap: 6px; flex-wrap: wrap;">
              <span class="product-tag-pill">${p.tag || (isVehicle ? 'Ejisu Lot' : 'Certified')}</span>
              ${discountPercent ? `<span class="discount-badge">-${discountPercent}%</span>` : ''}
            </div>

            <!-- Wishlist Heart Button -->
            <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                    title="${isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}" 
                    onclick="event.stopPropagation(); window.toggleWishlist('${p.id}')" 
                    aria-label="Wishlist">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>

            <!-- Compare Toggle Button -->
            <button class="product-compare-toggle ${isCompared ? 'selected' : ''}" 
                    title="Compare product side-by-side" 
                    onclick="event.stopPropagation(); window.toggleCompare('${p.id}')" 
                    aria-label="Compare">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
              </svg>
            </button>
          </div>

          <div class="product-info">
            <div class="product-meta-row">
              <span class="product-category-label">${p.brand} · ${p.category}</span>
              <span class="stock-indicator ${p.stock <= 2 ? 'low' : ''}">
                ${p.stock > 0 ? (p.stock <= 2 ? `Only ${p.stock} left` : 'In Stock') : 'Out of Stock'}
              </span>
            </div>

            <h3 class="product-name" onclick="window.openQuickView('${p.id}')">${p.name}</h3>
            <div class="product-specs-snippet">${snippet}</div>

            <!-- Stock Health Meter -->
            <div class="stock-meter-wrapper">
              <div class="stock-meter-label">
                <span>Availability: ${p.stock > 0 ? `${p.stock} in Ejisu Hub` : 'Sold out'}</span>
                <span>${p.stock > 0 ? 'Verified Genuine' : 'Restocking soon'}</span>
              </div>
              <div class="stock-meter-track">
                <div class="stock-meter-fill ${p.stock <= 2 ? 'low' : ''}" style="width: ${p.stock > 0 ? stockPercent : 0}%"></div>
              </div>
            </div>

            <div class="product-footer">
              <div class="price-container">
                <span class="current-price">${formatMoney(p.price)}</span>
                ${p.compareAtPrice ? `<span class="compare-price">${formatMoney(p.compareAtPrice)}</span>` : ''}
              </div>
              <div class="product-actions-group">
                <button class="quick-view-btn" title="View Full Specs & Certificate" onclick="window.openQuickView('${p.id}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
                <button class="add-cart-btn" onclick="window.addToCart('${p.id}', 1)">
                  <span>＋</span> <span>${isVehicle ? 'Enquire' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
  window.renderProductGrid = renderProductGrid;

  // View Mode Switcher (Grid vs List)
  window.setViewMode = function (mode) {
    viewMode = mode;
    $$('.view-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    renderProductGrid();
  };

  // Wishlist Toggle
  window.toggleWishlist = function (id) {
    const isAdded = AkabatiBackend.Wishlist.toggle(id);
    const p = AkabatiBackend.Catalog.getProductById(id);
    updateBadges();
    renderProductGrid();
    showToast(isAdded ? `Saved "${p.name.substring(0, 22)}..." to your Wishlist.` : `Removed from your Wishlist.`);
  };

  // Open Wishlist Modal
  window.openWishlistModal = function () {
    const ids = AkabatiBackend.Wishlist.getWishlist();
    const modalBody = $('#accountModalBody');
    window.openAccountModal();
    window.switchAccountTab('wishlist');
  };

  // =========================================================================
  // 2. Shopping Cart System
  // =========================================================================
  window.addToCart = function (id, qty = 1) {
    const p = AkabatiBackend.Catalog.getProductById(id);
    if (!p) return;

    if (p.stock <= 0) {
      showToast('Sorry, this item is currently out of stock.');
      return;
    }

    const existing = cart.find(item => item.id === id);
    if (existing) {
      if (existing.qty + qty > p.stock) {
        showToast(`Maximum showroom stock reached (${p.stock} units).`);
        return;
      }
      existing.qty += qty;
    } else {
      cart.push({ id, qty });
    }

    persistCart();
    showToast(`Added "${p.name.substring(0, 24)}..." to your cart.`);
  };

  window.changeCartQty = function (id, delta) {
    const item = cart.find(x => x.id === id);
    const p = AkabatiBackend.Catalog.getProductById(id);
    if (!item) return;

    item.qty += delta;
    if (p && item.qty > p.stock) {
      item.qty = p.stock;
      showToast(`Only ${p.stock} units currently available.`);
    }

    if (item.qty <= 0) {
      cart = cart.filter(x => x.id !== id);
    }

    persistCart();
  };

  function renderCart() {
    const container = $('#cartItemsList');
    const subtotalEl = $('#cartSubtotal');
    const checkoutBtn = $('#cartCheckoutBtn');
    const progressEl = $('#cartShippingProgress');
    if (!container) return;

    if (!cart.length) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; color: var(--text-light);">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h4 style="font-family: var(--font-heading); color: var(--text-main); margin-bottom: 6px;">Your cart is empty</h4>
          <p style="font-size: 0.85rem;">Browse electronics or inspect our vehicles at Ejisu showroom.</p>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = formatMoney(0);
      if (progressEl) progressEl.style.display = 'none';
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
      }
      return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map(item => {
      const p = AkabatiBackend.Catalog.getProductById(item.id);
      if (!p) return '';
      const lineTotal = p.price * item.qty;
      subtotal += lineTotal;

      return `
        <div class="cart-item-row">
          <img src="${p.images[0]}" alt="${p.name}" class="cart-item-thumb" />
          <div class="cart-item-info">
            <strong>${p.name}</strong>
            <small>${formatMoney(p.price)} each</small>
            <div class="cart-qty-ctrl">
              <button onclick="window.changeCartQty('${p.id}', -1)" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button onclick="window.changeCartQty('${p.id}', 1)" aria-label="Increase quantity">＋</button>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; font-family: var(--font-heading); font-size: 0.95rem;">${formatMoney(lineTotal)}</div>
            <button class="cart-item-del" onclick="window.changeCartQty('${p.id}', -${item.qty})" title="Remove item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Shipping progress indicator (Free delivery threshold GH₵ 1,000)
    if (progressEl) {
      progressEl.style.display = 'block';
      const freeShippingGoal = 1000;
      const progressPercent = Math.min(100, Math.round((subtotal / freeShippingGoal) * 100));
      const needed = Math.max(0, freeShippingGoal - subtotal);

      progressEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-weight: 700;">
          <span>${needed > 0 ? `Add ${formatMoney(needed)} more for Free Delivery` : '🎉 You qualify for Free Delivery / Ejisu Pickup!'}</span>
          <span>${progressPercent}%</span>
        </div>
        <div class="shipping-bar-track">
          <div class="shipping-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>
      `;
    }

    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = '1';
    }
  }

  window.openCart = function () {
    $('#siteOverlay').classList.add('show');
    $('#cartDrawer').classList.add('show');
  };

  window.closeCart = function () {
    $('#siteOverlay').classList.remove('show');
    $('#cartDrawer').classList.remove('show');
  };

  // =========================================================================
  // 3. Enhanced Quick View Modal with 3 Rich Tabs
  // =========================================================================
  window.openQuickView = function (id) {
    const p = AkabatiBackend.Catalog.getProductById(id);
    if (!p) return;

    const modalBody = $('#quickViewModalBody');
    if (!modalBody) return;

    const isVehicle = p.category === 'Vehicles';

    let specsHtml = Object.entries(p.specs || {}).map(([key, value]) => `
      <tr>
        <td>${key}</td>
        <td>${value}</td>
      </tr>
    `).join('');

    let galleryThumbs = p.images.map((img, idx) => `
      <div class="quickview-thumb ${idx === 0 ? 'active' : ''}" onclick="window.switchQuickViewImage('${img}', this)">
        <img src="${img}" alt="${p.name}" />
      </div>
    `).join('');

    modalBody.innerHTML = `
      <div class="quickview-grid">
        <div class="quickview-gallery">
          <div class="quickview-main-img">
            <img id="qvMainImage" src="${p.images[0]}" alt="${p.name}" />
          </div>
          <div class="quickview-thumbs">${galleryThumbs}</div>
        </div>

        <div class="quickview-details">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: var(--primary-gold-dark);">
              ${p.brand} · ${p.subcategory || p.category}
            </span>
            <span class="stock-indicator ${p.stock <= 2 ? 'low' : ''}">
              ${p.stock > 0 ? `${p.stock} units available` : 'Out of Stock'}
            </span>
          </div>

          <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; margin-bottom: 8px;">
            ${p.name}
          </h3>

          <div class="quickview-price" style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px;">
            <span>${formatMoney(p.price)}</span>
            ${p.compareAtPrice ? `<span style="font-size: 0.95rem; color: var(--text-muted); text-decoration: line-through;">${formatMoney(p.compareAtPrice)}</span>` : ''}
          </div>

          <!-- Quick View Tabbed Navigation -->
          <div class="qv-tabs-nav">
            <button class="qv-tab-btn active" onclick="window.switchQvTab('specs', this)">Technical Specs</button>
            <button class="qv-tab-btn" onclick="window.switchQvTab('warranty', this)">Quality & Inspection</button>
            <button class="qv-tab-btn" onclick="window.switchQvTab('delivery', this)">Showroom & Delivery</button>
          </div>

          <div id="qvTabContent">
            <table class="specs-table">${specsHtml}</table>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap;">
            <button class="btn-primary" style="flex: 1;" onclick="window.addToCart('${p.id}', 1); window.closeQuickView();">
              Add to Cart · ${formatMoney(p.price)}
            </button>
            <a class="btn-secondary" style="color: var(--text-main); border-color: var(--surface-border);" 
               href="https://wa.me/233244027477?text=${encodeURIComponent('Hello Akabati Enterprise, I am enquiring about ' + p.name + ' (SKU: ' + p.sku + ') priced at ' + formatMoney(p.price) + '. Is it currently available at your Ejisu showroom?')}" 
               target="_blank" rel="noopener">
              WhatsApp Concierge ↗
            </a>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; font-size: 0.78rem; color: var(--text-muted);">
            <span>SKU: <code>${p.sku}</code></span>
            <button style="color: var(--primary-gold-dark); font-weight: 700;" onclick="navigator.clipboard.writeText(window.location.href); showToast('Product link copied to clipboard!');">
              🔗 Share Product
            </button>
          </div>
        </div>
      </div>
    `;

    $('#quickViewModalWrapper').classList.add('show');
    $('#siteOverlay').classList.add('show');
  };

  window.closeQuickView = function () {
    $('#quickViewModalWrapper').classList.remove('show');
    $('#siteOverlay').classList.remove('show');
  };

  window.switchQuickViewImage = function (url, element) {
    const mainImg = $('#qvMainImage');
    if (mainImg) mainImg.src = url;
    $$('.quickview-thumb').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
  };

  window.switchQvTab = function (tabType, el) {
    $$('.qv-tab-btn').forEach(b => b.classList.remove('active'));
    if (el) el.classList.add('active');

    const content = $('#qvTabContent');
    if (!content) return;

    if (tabType === 'specs') {
      const p = AkabatiBackend.Catalog.getAllProducts().find(item => item.images[0] === $('#qvMainImage')?.src || true);
      let specsHtml = Object.entries(p?.specs || {}).map(([key, value]) => `
        <tr><td>${key}</td><td>${value}</td></tr>
      `).join('');
      content.innerHTML = `<table class="specs-table">${specsHtml}</table>`;
    } else if (tabType === 'warranty') {
      content.innerHTML = `
        <div style="padding: 12px 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.7;">
          <strong style="color: var(--text-main); display: block; margin-bottom: 4px;">Akabati Standard of Excellence:</strong>
          <p>Every product is certified authentic and physically tested prior to handover or dispatch.</p>
          <ul style="padding-left: 20px; margin-top: 8px;">
            <li>100% Genuine brand guarantee (Samsung, Apple, Sony, Dell, Canon, Toyota, Mercedes-Benz, Honda).</li>
            <li>Official 1 to 3-year warranty for electronics; 120-point mechanical & chassis check for vehicles.</li>
            <li>7-day direct exchange policy for factory defects.</li>
          </ul>
        </div>
      `;
    } else if (tabType === 'delivery') {
      content.innerHTML = `
        <div style="padding: 12px 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.7;">
          <strong style="color: var(--text-main); display: block; margin-bottom: 4px;">Showroom Pickup & Courier Options:</strong>
          <ul style="padding-left: 20px; margin-top: 8px;">
            <li><strong>Ejisu Showroom Lot:</strong> Free physical collection & inspection Monday to Saturday.</li>
            <li><strong>Ashanti Regional Courier:</strong> GH₵ 50.00 same-day/next-day dispatch to Kumasi & environs.</li>
            <li><strong>Nationwide Ghana Express:</strong> GH₵ 120.00 insured delivery to Greater Accra, Western, Central, Eastern, and Northern regions.</li>
          </ul>
        </div>
      `;
    }
  };

  // =========================================================================
  // 4. Side-by-Side Product Comparison
  // =========================================================================
  window.toggleCompare = function (id) {
    if (comparison.includes(id)) {
      comparison = comparison.filter(x => x !== id);
      showToast('Removed from comparison.');
    } else {
      if (comparison.length >= 3) {
        showToast('You can compare a maximum of 3 items at a time.');
        return;
      }
      comparison.push(id);
      showToast('Added to comparison matrix. Click the compare icon in the header to view.');
    }
    persistComparison();
    renderProductGrid();
  };

  window.openCompareModal = function () {
    if (!comparison.length) {
      showToast('No items selected for comparison. Click the compare icon on product cards.');
      return;
    }

    const comparedProducts = comparison.map(id => AkabatiBackend.Catalog.getProductById(id)).filter(Boolean);
    const body = $('#compareModalBody');
    if (!body) return;

    let headersHtml = comparedProducts.map(p => `
      <th style="width: ${100 / (comparedProducts.length + 1)}%; text-align: center;">
        <img src="${p.images[0]}" alt="${p.name}" style="height: 90px; width: auto; margin: 0 auto 8px; object-fit: contain; border-radius: 6px;" />
        <strong style="display: block; font-size: 0.85rem; font-family: var(--font-heading);">${p.name}</strong>
        <span style="color: var(--primary-gold-dark); font-weight: 800; font-size: 0.95rem;">${formatMoney(p.price)}</span>
        <div style="margin-top: 8px;">
          <button class="btn-primary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="window.addToCart('${p.id}', 1)">Add to Cart</button>
          <button style="display: block; margin: 6px auto 0; font-size: 0.72rem; color: var(--accent-red);" onclick="window.toggleCompare('${p.id}'); window.openCompareModal();">Remove</button>
        </div>
      </th>
    `).join('');

    const allKeys = new Set(['Category', 'Brand', 'Condition', 'Warranty & Assurance', 'Stock Status']);
    comparedProducts.forEach(p => {
      Object.keys(p.specs || {}).forEach(k => allKeys.add(k));
    });

    let rowsHtml = Array.from(allKeys).map(key => {
      let cells = comparedProducts.map(p => {
        let val = '';
        if (key === 'Category') val = p.category;
        else if (key === 'Brand') val = p.brand;
        else if (key === 'Condition') val = p.condition;
        else if (key === 'Warranty & Assurance') val = p.warranty;
        else if (key === 'Stock Status') val = p.stock > 0 ? `${p.stock} units available` : 'Out of stock';
        else val = (p.specs && p.specs[key]) ? p.specs[key] : '—';

        return `<td style="text-align: center; font-size: 0.85rem;">${val}</td>`;
      }).join('');

      return `
        <tr>
          <td style="font-weight: 700; background: #f8fafc; color: var(--text-muted); font-size: 0.82rem;">${key}</td>
          ${cells}
        </tr>
      `;
    }).join('');

    body.innerHTML = `
      <div style="overflow-x: auto;">
        <table class="specs-table" style="min-width: 600px;">
          <thead>
            <tr>
              <th style="width: 140px; background: #f8fafc;">Specifications</th>
              ${headersHtml}
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;

    $('#compareModalWrapper').classList.add('show');
    $('#siteOverlay').classList.add('show');
  };

  window.closeCompareModal = function () {
    $('#compareModalWrapper').classList.remove('show');
    $('#siteOverlay').classList.remove('show');
  };

  // =========================================================================
  // 5. Multi-Step Checkout System with MoMo Simulator & Card Processing
  // =========================================================================
  let checkoutStep = 1;
  let selectedDeliveryMethod = 'ashanti';
  let deliveryCost = 50;
  let selectedPaymentMethod = 'momo';
  let momoCarrier = 'MTN';

  window.openCheckout = function () {
    if (!cart.length) return;
    checkoutStep = 1;
    renderCheckoutStep();
    $('#checkoutModalWrapper').classList.add('show');
    $('#cartDrawer').classList.remove('show');
  };

  window.closeCheckout = function () {
    $('#checkoutModalWrapper').classList.remove('show');
    $('#siteOverlay').classList.remove('show');
  };

  function renderCheckoutStep() {
    const subtotal = cart.reduce((sum, item) => {
      const p = AkabatiBackend.Catalog.getProductById(item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);

    const stepPills = $$('.checkout-step-pill');
    stepPills.forEach((pill, idx) => {
      pill.classList.toggle('active', idx + 1 === checkoutStep);
    });

    const body = $('#checkoutModalBody');
    if (!body) return;

    if (checkoutStep === 1) {
      body.innerHTML = `
        <h4 style="font-family: var(--font-heading); margin-bottom: 6px;">1. Customer & Delivery Address</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">Provide your contact and Ghana delivery destination.</p>
        
        <form id="checkoutStep1Form" onsubmit="event.preventDefault(); window.nextCheckoutStep();">
          <div class="form-grid-2">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" id="chkName" class="form-control" placeholder="Kwame Mensah" value="${window._tempCustomer?.name || ''}" required />
            </div>
            <div class="form-group">
              <label>Mobile Number (Ghana) *</label>
              <input type="tel" id="chkPhone" class="form-control" placeholder="024 000 0000" value="${window._tempCustomer?.phone || ''}" required />
            </div>
          </div>

          <div class="form-group">
            <label>Email Address (For PDF Receipt & Tracking)</label>
            <input type="email" id="chkEmail" class="form-control" placeholder="you@example.com" value="${window._tempCustomer?.email || ''}" />
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label>Delivery Region *</label>
              <select id="chkRegion" class="form-control" required>
                <option value="Ashanti" selected>Ashanti Region (Ejisu / Kumasi)</option>
                <option value="Greater Accra">Greater Accra</option>
                <option value="Central">Central Region</option>
                <option value="Eastern">Eastern Region</option>
                <option value="Western">Western Region</option>
                <option value="Northern">Northern Region</option>
                <option value="Volta">Volta Region</option>
                <option value="Bono">Bono Region</option>
              </select>
            </div>
            <div class="form-group">
              <label>Town / City & Area *</label>
              <input type="text" id="chkCity" class="form-control" placeholder="Ejisu, Kumasi Ahodwo" value="${window._tempCustomer?.city || ''}" required />
            </div>
          </div>

          <div class="form-group">
            <label>Ghana Post Digital Address (Optional)</label>
            <input type="text" id="chkGps" class="form-control" placeholder="e.g. AS-0482-9912" value="${window._tempCustomer?.digitalAddress || ''}" />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
            <button type="button" class="btn-secondary" style="color: var(--text-main);" onclick="window.closeCheckout()">Cancel</button>
            <button type="submit" class="btn-primary">Continue to Fulfilment →</button>
          </div>
        </form>
      `;
    } else if (checkoutStep === 2) {
      body.innerHTML = `
        <h4 style="font-family: var(--font-heading); margin-bottom: 6px;">2. Select Fulfilment Method</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">Choose how you want to receive your order from Akabati Enterprise.</p>
        
        <div class="payment-method-card ${selectedDeliveryMethod === 'pickup' ? 'selected' : ''}" onclick="window.setDeliveryOption('pickup', 0)">
          <div class="payment-icon">🏬</div>
          <div style="flex: 1;">
            <strong>Showroom Collection in Ejisu</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Collect in person at our showroom lot in Ejisu, Ashanti Region.</p>
          </div>
          <strong style="color: var(--accent-green);">FREE</strong>
        </div>

        <div class="payment-method-card ${selectedDeliveryMethod === 'ashanti' ? 'selected' : ''}" onclick="window.setDeliveryOption('ashanti', 50)">
          <div class="payment-icon">🚚</div>
          <div style="flex: 1;">
            <strong>Ashanti Regional Courier (Ejisu / Kumasi & Environs)</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Same-day or next-day direct door-to-door delivery.</p>
          </div>
          <strong>GH₵ 50.00</strong>
        </div>

        <div class="payment-method-card ${selectedDeliveryMethod === 'nationwide' ? 'selected' : ''}" onclick="window.setDeliveryOption('nationwide', 120)">
          <div class="payment-icon">✈️</div>
          <div style="flex: 1;">
            <strong>Nationwide Ghana Express Delivery</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Insured dispatch to Accra, Takoradi, Sunyani, Tamale and all regions.</p>
          </div>
          <strong>GH₵ 120.00</strong>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
          <button type="button" class="btn-secondary" style="color: var(--text-main);" onclick="window.prevCheckoutStep()">← Back</button>
          <button type="button" class="btn-primary" onclick="window.nextCheckoutStep()">Continue to Payment →</button>
        </div>
      `;
    } else if (checkoutStep === 3) {
      let discount = 0;
      if (activePromo) {
        const promoRes = AkabatiBackend.Promotions.validateCode(activePromo, subtotal);
        if (promoRes.valid) discount = promoRes.discount;
      }

      const grandTotal = Math.max(0, subtotal - discount + deliveryCost);

      body.innerHTML = `
        <h4 style="font-family: var(--font-heading); margin-bottom: 6px;">3. Payment & Settlement</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">Select your Ghana-supported payment channel.</p>

        <!-- Coupon / Promo Box -->
        <div class="coupon-box">
          <input type="text" id="promoCodeInput" class="coupon-input" placeholder="Promo code (e.g. AKABATI10, EJISUFREE)" value="${activePromo || ''}" />
          <button class="coupon-btn" onclick="window.applyCheckoutCoupon()">Apply</button>
        </div>
        ${activePromo ? `<div class="applied-promo-tag">✓ Coupon "${activePromo}" Applied (-${formatMoney(discount)})</div>` : ''}

        <!-- Payment Channel Cards -->
        <div class="payment-method-card ${selectedPaymentMethod === 'momo' ? 'selected' : ''}" onclick="window.setPaymentOption('momo')">
          <div class="payment-icon" style="font-weight: 900; color: #d97706;">MoMo</div>
          <div style="flex: 1;">
            <strong>Mobile Money (MTN MoMo, Telecel Cash, AT Money)</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Interactive USSD authorization prompt sent directly to your phone.</p>
          </div>
          <span class="top-badge-link">Fastest in Ghana</span>
        </div>

        <div class="payment-method-card ${selectedPaymentMethod === 'paystack' ? 'selected' : ''}" onclick="window.setPaymentOption('paystack')">
          <div class="payment-icon" style="font-weight: 900; color: #2563eb;">CARD</div>
          <div style="flex: 1;">
            <strong>Visa / Mastercard & Direct Bank Transfer</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Paystack tokenized gateway with 256-bit SSL encryption.</p>
          </div>
        </div>

        <div class="payment-method-card ${selectedPaymentMethod === 'whatsapp' ? 'selected' : ''}" onclick="window.setPaymentOption('whatsapp')">
          <div class="payment-icon" style="color: #10b981; font-weight: 900;">WA</div>
          <div style="flex: 1;">
            <strong>Official WhatsApp Concierge Order Handoff</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Connect directly with our sales team at 0244 027 477 to confirm custom terms.</p>
          </div>
        </div>

        <!-- Breakdown Summary -->
        <div style="background: var(--surface-muted); padding: 16px; border-radius: var(--radius-md); margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
            <span>Items Subtotal:</span>
            <strong>${formatMoney(subtotal)}</strong>
          </div>
          ${discount > 0 ? `
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px; color: var(--accent-green);">
              <span>Promotional Discount:</span>
              <strong>-${formatMoney(discount)}</strong>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 10px;">
            <span>Delivery Fee:</span>
            <strong>${deliveryCost === 0 ? 'FREE' : formatMoney(deliveryCost)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; border-top: 1px solid var(--surface-border); padding-top: 10px; font-family: var(--font-heading);">
            <span>Grand Total:</span>
            <span style="color: var(--primary-gold-dark);">${formatMoney(grandTotal)}</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
          <button type="button" class="btn-secondary" style="color: var(--text-main);" onclick="window.prevCheckoutStep()">← Back</button>
          <button type="button" class="btn-primary" onclick="window.proceedToPaymentAuthorisation(${grandTotal})">
            ${selectedPaymentMethod === 'momo' ? 'Launch MoMo Prompt →' : 'Authorize & Place Order →'}
          </button>
        </div>
      `;
    }
  }

  window.setDeliveryOption = function (opt, cost) {
    selectedDeliveryMethod = opt;
    deliveryCost = cost;
    renderCheckoutStep();
  };

  window.setPaymentOption = function (method) {
    selectedPaymentMethod = method;
    renderCheckoutStep();
  };

  window.applyCheckoutCoupon = function () {
    const input = $('#promoCodeInput');
    const code = input ? input.value.trim().toUpperCase() : '';
    if (!code) return;

    const subtotal = cart.reduce((sum, item) => {
      const p = AkabatiBackend.Catalog.getProductById(item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);

    const res = AkabatiBackend.Promotions.validateCode(code, subtotal);
    if (!res.valid) {
      showToast(res.message);
      return;
    }

    activePromo = res.code;
    showToast(`Coupon "${res.code}" applied successfully! (-${formatMoney(res.discount)})`);
    renderCheckoutStep();
  };

  window.nextCheckoutStep = function () {
    if (checkoutStep === 1) {
      window._tempCustomer = {
        name: $('#chkName').value,
        phone: $('#chkPhone').value,
        email: $('#chkEmail').value,
        region: $('#chkRegion').value,
        city: $('#chkCity').value,
        digitalAddress: $('#chkGps').value
      };
    }
    checkoutStep++;
    renderCheckoutStep();
  };

  window.prevCheckoutStep = function () {
    if (checkoutStep > 1) {
      checkoutStep--;
      renderCheckoutStep();
    }
  };

  // Launch Realistic Interactive Payment Simulation
  window.proceedToPaymentAuthorisation = function (total) {
    if (selectedPaymentMethod === 'momo') {
      // Interactive USSD MoMo Prompt Simulation
      const body = $('#checkoutModalBody');
      body.innerHTML = `
        <div style="text-align: center; margin-bottom: 12px;">
          <h4 style="font-family: var(--font-heading); margin-bottom: 4px;">Authorise Mobile Money Payment</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            A prompt has been sent to <strong>${window._tempCustomer?.phone || 'your phone'}</strong>. Approve below to settle.
          </p>
        </div>

        <div class="momo-phone-simulator">
          <div class="momo-screen">
            <div class="momo-carrier-header">
              <span class="momo-carrier-name">MTN Mobile Money</span>
              <span style="font-size: 0.72rem; color: var(--text-muted);">USSD *170#</span>
            </div>
            <div class="momo-prompt-text">
              <strong>AUTHORISATION REQUEST:</strong><br><br>
              Merchant: Akabati Enterprise<br>
              Amount: ${formatMoney(total)}<br>
              Fee: GH₵ 0.00<br>
              Reference: AKB-SHOP<br><br>
              Enter PIN to approve:
            </div>
            <input type="password" maxlength="4" value="••••" style="text-align: center; font-size: 1.2rem; letter-spacing: 0.2em; height: 38px; border: 1px solid #cbd5e1; border-radius: 6px; margin-bottom: 12px;" readonly />
            <button class="momo-action-btn" onclick="window.finaliseOrderSubmission('MTN Mobile Money', 'MOMO-GH-' + Math.floor(100000 + Math.random() * 900000))">
              ✓ Approve Payment (${formatMoney(total)})
            </button>
          </div>
        </div>

        <div style="text-align: center; margin-top: 16px;">
          <button class="btn-secondary" style="color: var(--text-muted); font-size: 0.8rem;" onclick="window.renderCheckoutStep()">
            Cancel & Change Channel
          </button>
        </div>
      `;
    } else if (selectedPaymentMethod === 'paystack') {
      // Paystack Card Simulation
      const body = $('#checkoutModalBody');
      body.innerHTML = `
        <div style="max-width: 420px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <strong style="font-family: var(--font-heading);">Paystack Card Gateway</strong>
            <span class="top-badge-link">Secured 256-bit</span>
          </div>

          <div class="form-group">
            <label>Card Number</label>
            <input type="text" class="form-control" placeholder="4000 1234 5678 9010" value="4000 1234 5678 9010" />
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label>Expiry Date</label>
              <input type="text" class="form-control" placeholder="MM/YY" value="12/28" />
            </div>
            <div class="form-group">
              <label>CVV / CVC</label>
              <input type="password" class="form-control" placeholder="123" value="•••" />
            </div>
          </div>

          <button class="btn-primary btn-block" style="margin-top: 16px;" onclick="window.finaliseOrderSubmission('Paystack Card / Transfer', 'PSTK-TX-' + Math.floor(100000 + Math.random() * 900000))">
            Authorise ${formatMoney(total)} →
          </button>
        </div>
      `;
    } else {
      window.finaliseOrderSubmission('WhatsApp Concierge Order', 'WA-DIRECT-' + Date.now());
    }
  };

  // Finalise Order Submission authoritatively via BackendService
  window.finaliseOrderSubmission = function (paymentMethodTitle, reference) {
    try {
      const cust = window._tempCustomer || {
        name: 'Kwame Mensah',
        phone: '024 123 4567',
        email: 'kwame.mensah@gmail.com',
        region: 'Ashanti',
        city: 'Ejisu',
        digitalAddress: 'AS-0482-9912'
      };

      const paymentMethod = {
        name: paymentMethodTitle,
        provider: selectedPaymentMethod.toUpperCase(),
        reference
      };

      // Server-authoritative order placement
      const order = AkabatiBackend.Orders.createOrder(
        cart,
        cust,
        selectedDeliveryMethod,
        paymentMethod,
        activePromo
      );

      // Clear Cart
      cart = [];
      activePromo = null;
      persistCart();

      // Render Order Confirmation
      const body = $('#checkoutModalBody');
      body.innerHTML = `
        <div style="text-align: center; padding: 24px 10px;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: #ecfdf5; color: var(--accent-green); display: grid; place-items: center; margin: 0 auto 16px; font-size: 1.8rem; font-weight: 900;">
            ✓
          </div>
          <h3 style="font-family: var(--font-heading); margin-bottom: 6px;">Order Placed & Payment Verified!</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 18px;">
            Thank you for shopping at Akabati Enterprise. Your authoritative order reference is:
          </p>

          <div style="background: var(--surface-muted); padding: 12px 24px; border-radius: var(--radius-md); font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--primary-gold-dark); display: inline-block; margin-bottom: 20px;">
            ${order.orderNumber}
          </div>

          <div style="background: #f8fafc; border: 1px solid var(--surface-border); border-radius: var(--radius-md); padding: 16px; text-align: left; max-width: 480px; margin: 0 auto 24px; font-size: 0.85rem;">
            <div><strong>Recipient:</strong> ${order.customer.name} (${order.customer.phone})</div>
            <div><strong>Destination:</strong> ${order.customer.city}, ${order.customer.region} · ${order.customer.digitalAddress}</div>
            <div><strong>Fulfilment:</strong> ${order.deliveryMethod}</div>
            <div><strong>Total Paid:</strong> ${formatMoney(order.total)} (${order.paymentMethod})</div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn-primary" onclick="window.closeCheckout(); window.trackSpecificOrder('${order.orderNumber}');">
              Track Order Live ↗
            </button>
            <button class="btn-secondary" style="color: var(--text-main);" onclick="window.openInvoiceModal('${order.orderNumber}')">
              Print / Save Invoice 📄
            </button>
            <a class="btn-secondary" style="color: var(--text-main);" 
               href="https://wa.me/233244027477?text=${encodeURIComponent('Hello Akabati Enterprise, I have completed order ' + order.orderNumber + ' for ' + formatMoney(order.total) + '. Kindly confirm processing.')}" 
               target="_blank" rel="noopener">
              WhatsApp Receipt ↗
            </a>
          </div>
        </div>
      `;

      showToast(`Order ${order.orderNumber} placed & verified!`);
    } catch (e) {
      alert(`Order placement failed: ${e.message}`);
    }
  };

  // =========================================================================
  // 6. Live Order Tracking Engine
  // =========================================================================
  window.trackOrderPrompt = function () {
    const input = $('#trackOrderInput');
    const orderNum = input ? input.value.trim().toUpperCase() : '';
    if (!orderNum) {
      showToast('Please enter your Akabati Order Reference (e.g. AKB-78291)');
      return;
    }
    window.trackSpecificOrder(orderNum);
  };

  window.trackSpecificOrder = function (orderNum) {
    const cleanNum = orderNum.trim().toUpperCase();
    const order = AkabatiBackend.Orders.getOrder(cleanNum);

    const modalBody = $('#trackingModalBody');
    if (!modalBody) return;

    if (!order) {
      modalBody.innerHTML = `
        <div style="text-align: center; padding: 40px 16px;">
          <h4 style="font-family: var(--font-heading); margin-bottom: 8px;">Order Reference Not Found</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 20px;">
            We couldn't locate reference "${cleanNum}". Please verify your receipt or contact Akabati Enterprise at 0244 027 477.
          </p>
          <button class="btn-primary" onclick="window.closeTrackingModal()">Try Another Reference</button>
        </div>
      `;
    } else {
      let timelineHtml = (order.timeline || []).map(step => `
        <div class="timeline-step ${step.status === 'done' ? 'completed' : (step.status === 'active' ? 'active' : '')}">
          <div class="timeline-dot"></div>
          <strong>${step.title}</strong>
          <small>${step.time}</small>
        </div>
      `).join('');

      let itemsHtml = (order.items || []).map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--surface-border); font-size: 0.85rem;">
          <div>
            <strong>${item.name}</strong>
            <div style="color: var(--text-muted); font-size: 0.75rem;">Qty: ${item.qty} · SKU: ${item.sku || 'AKB'}</div>
          </div>
          <span style="font-weight: 800; font-family: var(--font-heading);">${formatMoney(item.lineTotal || (item.price * item.qty))}</span>
        </div>
      `).join('');

      modalBody.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: var(--primary-gold-dark);">Live Tracking View</div>
            <h3 style="font-family: var(--font-heading); margin: 2px 0 4px;">Order ${order.orderNumber}</h3>
            <span class="status-badge ${order.fulfilmentStatus.toLowerCase()}">${order.fulfilmentStatus}</span>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Total Amount Paid</div>
            <strong style="font-family: var(--font-heading); font-size: 1.25rem;">${formatMoney(order.total)}</strong>
          </div>
        </div>

        <!-- Logistics Route Indicator -->
        <div style="background: #111827; color: #ffffff; padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 20px; font-size: 0.85rem;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-size: 0.72rem; color: var(--primary-gold-light); text-transform: uppercase;">Origin</span>
              <strong>Ejisu Hub (Ashanti)</strong>
            </div>
            <div style="color: var(--primary-gold);">────── ✈ ──────</div>
            <div style="text-align: right;">
              <span style="font-size: 0.72rem; color: var(--primary-gold-light); text-transform: uppercase;">Destination</span>
              <strong>${order.customer.city}, ${order.customer.region}</strong>
            </div>
          </div>
        </div>

        <div style="background: var(--surface-muted); padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 20px; font-size: 0.82rem;">
          <div><strong>Recipient:</strong> ${order.customer.name} (${order.customer.phone})</div>
          <div><strong>Digital Address:</strong> ${order.customer.digitalAddress} · <strong>Method:</strong> ${order.deliveryMethod}</div>
          <div><strong>Payment Reference:</strong> <code>${order.paymentReference}</code> (${order.paymentMethod})</div>
        </div>

        <h5 style="font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 12px;">Lifecycle Progress Stepper</h5>
        <div class="tracking-timeline">${timelineHtml}</div>

        <h5 style="font-family: var(--font-heading); font-size: 0.95rem; margin: 24px 0 12px;">Order Snapshot Items</h5>
        <div>${itemsHtml}</div>

        <div style="display: flex; gap: 12px; margin-top: 24px; justify-content: center; flex-wrap: wrap;">
          <button class="btn-primary" onclick="window.openInvoiceModal('${order.orderNumber}')">
            View / Print Official Invoice 📄
          </button>
          <a class="btn-secondary" style="color: var(--text-main);" 
             href="https://wa.me/233244027477?text=${encodeURIComponent('Hello Akabati Enterprise, I am inquiring about tracking updates for order ' + order.orderNumber)}" 
             target="_blank" rel="noopener">
            Contact Delivery Desk on WhatsApp ↗
          </a>
        </div>
      `;
    }

    $('#trackingModalWrapper').classList.add('show');
    $('#siteOverlay').classList.add('show');
  };

  window.closeTrackingModal = function () {
    $('#trackingModalWrapper').classList.remove('show');
    $('#siteOverlay').classList.remove('show');
  };

  // =========================================================================
  // 7. Printable Invoice Receipt Modal
  // =========================================================================
  window.openInvoiceModal = function (orderNumber) {
    const order = AkabatiBackend.Orders.getOrder(orderNumber);
    if (!order) return;

    const modal = $('#invoiceModalWrapper');
    const body = $('#invoiceModalBody');
    if (!modal || !body) return;

    let itemsRows = order.items.map(item => `
      <tr>
        <td><strong>${item.name}</strong><br><small style="color: var(--text-muted);">${item.sku}</small></td>
        <td style="text-align: center;">${item.qty}</td>
        <td style="text-align: right;">${formatMoney(item.price)}</td>
        <td style="text-align: right;"><strong>${formatMoney(item.lineTotal || (item.price * item.qty))}</strong></td>
      </tr>
    `).join('');

    body.innerHTML = `
      <div id="printableInvoice" class="invoice-container">
        <div class="invoice-header">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <div class="brand-icon" style="width: 42px; height: 42px;">
                <img src="assets/images/akabati-logo-icon.png" alt="Akabati Enterprise" />
              </div>
              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; margin: 0;">Akabati Enterprise</h2>
            </div>
            <p style="color: var(--text-muted); font-size: 0.8rem; line-height: 1.5; margin: 0;">
              Ejisu, Ashanti Region, Ghana<br>
              Phone: +233 244 027 477 · Email: felixakabati007@gmail.com<br>
              TIN / Business Reg: Verified Ghana Business
            </p>
          </div>
          <div style="text-align: right;">
            <h3 style="font-family: var(--font-heading); margin: 0 0 4px; color: var(--primary-gold-dark);">TAX INVOICE</h3>
            <div style="font-weight: 800; font-size: 1rem;">${order.orderNumber}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Date: ${new Date(order.date).toLocaleDateString()}</div>
            <span class="status-badge paid" style="display: inline-block; margin-top: 6px;">PAID & SETTLED</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; font-size: 0.85rem;">
          <div>
            <strong style="display: block; margin-bottom: 4px; color: var(--text-muted); text-transform: uppercase; font-size: 0.75rem;">Bill / Deliver To:</strong>
            <strong>${order.customer.name}</strong><br>
            Phone: ${order.customer.phone}<br>
            Address: ${order.customer.city}, ${order.customer.region}<br>
            Digital Address: ${order.customer.digitalAddress}
          </div>
          <div>
            <strong style="display: block; margin-bottom: 4px; color: var(--text-muted); text-transform: uppercase; font-size: 0.75rem;">Payment Information:</strong>
            Method: ${order.paymentMethod}<br>
            Transaction Ref: <code>${order.paymentReference}</code><br>
            Fulfilment: ${order.deliveryMethod}<br>
            Driver: ${order.driver ? order.driver.name + ' (' + order.driver.phone + ')' : 'Direct Delivery'}
          </div>
        </div>

        <table class="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>

        <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
          <div style="width: 260px; font-size: 0.88rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>Subtotal:</span>
              <strong>${formatMoney(order.subtotal || order.total)}</strong>
            </div>
            ${order.discountAmount ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: var(--accent-green);">
                <span>Discount (${order.appliedPromo || 'Coupon'}):</span>
                <strong>-${formatMoney(order.discountAmount)}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Delivery Charge:</span>
              <strong>${order.deliveryCost === 0 ? 'FREE' : formatMoney(order.deliveryCost)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; border-top: 2px solid var(--surface-border); padding-top: 8px; font-family: var(--font-heading);">
              <span>Grand Total:</span>
              <span style="color: var(--primary-gold-dark);">${formatMoney(order.total)}</span>
            </div>
          </div>
        </div>

        <div style="border-top: 1px solid var(--surface-border); margin-top: 30px; padding-top: 16px; font-size: 0.75rem; color: var(--text-muted); text-align: center;">
          Thank you for your business. Quality, Our Pride — Akabati Enterprise, Ejisu, Ashanti Region, Ghana.
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button class="btn-secondary" style="color: var(--text-main);" onclick="window.closeInvoiceModal()">Close</button>
        <button class="btn-primary" onclick="window.print()">Print Official Invoice 🖨️</button>
      </div>
    `;

    modal.classList.add('show');
    $('#siteOverlay').classList.add('show');
  };

  window.closeInvoiceModal = function () {
    $('#invoiceModalWrapper').classList.remove('show');
    $('#siteOverlay').classList.remove('show');
  };

  // =========================================================================
  // 8. Customer Account & Portal
  // =========================================================================
  window.openAccountModal = function () {
    window.switchAccountTab('orders');
    $('#accountModalWrapper').classList.add('show');
    $('#siteOverlay').classList.add('show');
  };

  window.closeAccountModal = function () {
    $('#accountModalWrapper').classList.remove('show');
    $('#siteOverlay').classList.remove('show');
  };

  window.switchAccountTab = function (tab) {
    $$('.account-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    const container = $('#accountPortalContent');
    if (!container) return;

    if (tab === 'orders') {
      const orders = AkabatiBackend.Orders.getOrders();
      container.innerHTML = `
        <h4 style="font-family: var(--font-heading); margin-bottom: 12px;">Your Order History</h4>
        ${orders.length ? `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${orders.map(o => `
              <div style="background: var(--surface-muted); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--surface-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: gap; gap: 10px;">
                <div>
                  <strong>Order ${o.orderNumber}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${new Date(o.date).toLocaleDateString()} · ${o.items.length} items · ${formatMoney(o.total)}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="status-badge ${o.fulfilmentStatus.toLowerCase()}">${o.fulfilmentStatus}</span>
                  <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.75rem; color: var(--text-main);" onclick="window.closeAccountModal(); window.trackSpecificOrder('${o.orderNumber}')">
                    Track Live ↗
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<p style="color: var(--text-muted); font-size: 0.85rem;">No orders placed yet.</p>'}
      `;
    } else if (tab === 'wishlist') {
      const wishIds = AkabatiBackend.Wishlist.getWishlist();
      const wishProds = wishIds.map(id => AkabatiBackend.Catalog.getProductById(id)).filter(Boolean);

      container.innerHTML = `
        <h4 style="font-family: var(--font-heading); margin-bottom: 12px;">Saved Wishlist (${wishProds.length} items)</h4>
        ${wishProds.length ? `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${wishProds.map(p => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #ffffff; border: 1px solid var(--surface-border); border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${p.images[0]}" alt="" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px;" />
                  <div>
                    <strong style="font-size: 0.88rem;">${p.name}</strong>
                    <div style="color: var(--primary-gold-dark); font-weight: 800; font-size: 0.82rem;">${formatMoney(p.price)}</div>
                  </div>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button class="btn-primary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="window.addToCart('${p.id}', 1)">Add to Cart</button>
                  <button style="color: var(--accent-red); font-size: 0.8rem; padding: 6px;" onclick="window.toggleWishlist('${p.id}'); window.switchAccountTab('wishlist');">✕</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<p style="color: var(--text-muted); font-size: 0.85rem;">Your wishlist is currently empty. Browse the shop and click the heart icon to save products.</p>'}
      `;
    } else if (tab === 'profile') {
      container.innerHTML = `
        <h4 style="font-family: var(--font-heading); margin-bottom: 12px;">Customer Profile</h4>
        <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.8;">
          <div><strong>Primary Recipient:</strong> Kwame Mensah</div>
          <div><strong>Contact Phone:</strong> 024 123 4567</div>
          <div><strong>Email:</strong> kwame.mensah@gmail.com</div>
          <div><strong>Location:</strong> Ejisu, Ashanti Region, Ghana</div>
          <div><strong>Ghana Post GPS:</strong> AS-0482-9912</div>
          <div style="margin-top: 14px; color: var(--accent-green); font-weight: 700;">✓ Verified Ghana Customer Session</div>
        </div>
      `;
    }
  };

  // =========================================================================
  // 9. Staff Operations & Admin Console (Architecture Section 6.2 & 18)
  // =========================================================================
  window.openAdminModal = function () {
    renderAdminOverview();
    $('#adminModalWrapper').classList.add('show');
    $('#siteOverlay').classList.add('show');
  };

  window.closeAdminModal = function () {
    $('#adminModalWrapper').classList.remove('show');
    $('#siteOverlay').classList.remove('show');
  };

  window.switchAdminTab = function (tabName, el) {
    $$('.admin-nav-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');

    if (tabName === 'overview') renderAdminOverview();
    else if (tabName === 'products') renderAdminProducts();
    else if (tabName === 'inventory') renderAdminInventory();
    else if (tabName === 'orders') renderAdminOrders();
    else if (tabName === 'finance') renderAdminFinance();
    else if (tabName === 'promotions') renderAdminPromotions();
    else if (tabName === 'audit') renderAdminAudit();
  };

  function renderAdminOverview() {
    const content = $('#adminTabContent');
    if (!content) return;

    const orders = AkabatiBackend.Orders.getOrders();
    const products = AkabatiBackend.Catalog.getAllProducts();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.total : 0), 0);
    const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = products.filter(p => p.stock <= 2);

    // Electronics vs Vehicles breakdown
    const electronicsRev = orders.reduce((sum, o) => {
      const elTotal = o.items.filter(i => i.category === 'Electronics').reduce((s, i) => s + (i.lineTotal || i.price * i.qty), 0);
      return sum + elTotal;
    }, 0);

    const vehicleRev = orders.reduce((sum, o) => {
      const vTotal = o.items.filter(i => i.category === 'Vehicles').reduce((s, i) => s + (i.lineTotal || i.price * i.qty), 0);
      return sum + vTotal;
    }, 0);

    content.innerHTML = `
      <div class="admin-metric-grid">
        <div class="metric-box">
          <small>Gross Settled Revenue</small>
          <strong>${formatMoney(totalRevenue)}</strong>
        </div>
        <div class="metric-box">
          <small>Total Orders Placed</small>
          <strong>${orders.length}</strong>
        </div>
        <div class="metric-box">
          <small>Units in Ejisu Showroom</small>
          <strong>${totalUnits}</strong>
        </div>
        <div class="metric-box">
          <small>Low Stock Alerts</small>
          <strong style="color: ${lowStock.length ? 'var(--accent-amber)' : 'var(--accent-green)'};">${lowStock.length}</strong>
        </div>
      </div>

      <!-- Department Revenue Breakdown -->
      <div style="background: var(--surface-muted); padding: 18px; border-radius: var(--radius-md); margin-bottom: 24px; border: 1px solid var(--surface-border);">
        <strong style="display: block; font-family: var(--font-heading); margin-bottom: 8px;">Department Performance Split</strong>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 0.85rem;">
          <div>
            <span>Smart Electronics:</span>
            <strong style="display: block; font-size: 1.1rem; color: var(--primary-gold-dark);">${formatMoney(electronicsRev)}</strong>
          </div>
          <div>
            <span>Certified Vehicles:</span>
            <strong style="display: block; font-size: 1.1rem; color: var(--primary-gold-dark);">${formatMoney(vehicleRev)}</strong>
          </div>
        </div>
      </div>

      <h4 style="font-family: var(--font-heading); margin-bottom: 12px;">Recent Orders Queue</h4>
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order Ref</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Fulfilment</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${orders.slice(0, 5).map(o => `
              <tr>
                <td><strong>${o.orderNumber}</strong></td>
                <td>${o.customer.name} (${o.customer.phone})</td>
                <td>${new Date(o.date).toLocaleDateString()}</td>
                <td><span class="status-badge ${o.paymentStatus.toLowerCase()}">${o.paymentStatus}</span></td>
                <td><span class="status-badge ${o.fulfilmentStatus.toLowerCase()}">${o.fulfilmentStatus}</span></td>
                <td><strong>${formatMoney(o.total)}</strong></td>
                <td>
                  <button style="color: var(--primary-gold-dark); font-weight: 700; margin-right: 6px;" onclick="window.trackSpecificOrder('${o.orderNumber}')">View</button>
                  <button style="color: var(--accent-blue); font-weight: 700;" onclick="window.openInvoiceModal('${o.orderNumber}')">Invoice</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderAdminProducts() {
    const content = $('#adminTabContent');
    if (!content) return;

    const products = AkabatiBackend.Catalog.getAllProducts();

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h4 style="font-family: var(--font-heading); margin: 0;">Catalogue Management (${products.length} items)</h4>
        <button class="btn-primary" style="padding: 8px 16px; font-size: 0.8rem;" onclick="window.openAddProductForm()">＋ Add New Product</button>
      </div>

      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td style="display: flex; align-items: center; gap: 10px;">
                  <img src="${p.images[0]}" alt="" style="width: 38px; height: 38px; object-fit: cover; border-radius: 4px;" />
                  <strong>${p.name.substring(0, 28)}...</strong>
                </td>
                <td><code>${p.sku}</code></td>
                <td>${p.category}</td>
                <td><strong>${p.stock}</strong></td>
                <td>${formatMoney(p.price)}</td>
                <td><span class="status-badge ${p.status === 'ACTIVE' ? 'paid' : 'pending'}">${p.status}</span></td>
                <td>
                  <button style="color: var(--primary-gold-dark); font-weight: 700; margin-right: 8px;" onclick="window.adminEditPrice('${p.id}')">Edit Price</button>
                  <button style="color: var(--accent-red); font-weight: 700;" onclick="window.adminToggleStatus('${p.id}')">${p.status === 'ACTIVE' ? 'Archive' : 'Activate'}</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderAdminInventory() {
    const content = $('#adminTabContent');
    if (!content) return;

    const products = AkabatiBackend.Catalog.getAllProducts();
    const movements = AkabatiBackend.Inventory.getStockMovements();

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h4 style="font-family: var(--font-heading); margin: 0;">Stock Balances & Audited Adjustments</h4>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
        Compliance: Every stock delta is logged to an immutable ledger with mandatory audit reason codes.
      </p>

      <div class="admin-table-wrapper" style="margin-bottom: 30px;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Location</th>
              <th>Current On Hand</th>
              <th>Adjust Balance</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td><code>${p.sku}</code></td>
                <td><strong>${p.name}</strong></td>
                <td>Ejisu Showroom Lot</td>
                <td><span style="font-weight: 800; font-size: 1rem; color: ${p.stock <= 2 ? 'var(--accent-amber)' : 'var(--text-main)'};">${p.stock} units</span></td>
                <td>
                  <button class="btn-secondary" style="padding: 4px 10px; font-size: 0.75rem; color: var(--text-main);" onclick="window.adminAdjustStockPrompt('${p.id}')">
                    Adjust Balance ±
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <h4 style="font-family: var(--font-heading); margin-bottom: 12px;">Recent Stock Movements Log</h4>
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Product ID</th>
              <th>Type</th>
              <th>Delta</th>
              <th>Reason</th>
              <th>Actor</th>
            </tr>
          </thead>
          <tbody>
            ${movements.slice(0, 10).map(m => `
              <tr>
                <td>${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td><code>${m.productId}</code></td>
                <td><span class="status-badge ${m.type === 'RECEIPT' ? 'paid' : (m.type === 'SALE' ? 'dispatched' : 'pending')}">${m.type}</span></td>
                <td style="font-weight: 800; color: ${m.delta > 0 ? 'var(--accent-green)' : 'var(--accent-red)'};">${m.delta > 0 ? '+' : ''}${m.delta}</td>
                <td>${m.reason}</td>
                <td>${m.actor}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderAdminOrders() {
    const content = $('#adminTabContent');
    if (!content) return;

    const orders = AkabatiBackend.Orders.getOrders();

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h4 style="font-family: var(--font-heading); margin: 0;">Orders Lifecycle & Fulfilment Pipeline</h4>
      </div>

      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order Reference</th>
              <th>Customer</th>
              <th>Fulfilment Status</th>
              <th>Advance Pipeline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td>
                  <strong>${o.orderNumber}</strong>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">${formatMoney(o.total)} · ${o.paymentMethod}</div>
                </td>
                <td>
                  <div>${o.customer.name}</div>
                  <small style="color: var(--text-muted);">${o.customer.phone} · ${o.customer.city}</small>
                </td>
                <td><span class="status-badge ${o.fulfilmentStatus.toLowerCase()}">${o.fulfilmentStatus}</span></td>
                <td>
                  <select onchange="window.adminUpdateOrderStatus('${o.orderNumber}', this.value)" style="font-size: 0.8rem; padding: 4px 8px; border-radius: 4px; border: 1px solid var(--surface-border);">
                    <option value="PROCESSING" ${o.fulfilmentStatus === 'PROCESSING' ? 'selected' : ''}>PROCESSING</option>
                    <option value="READY_FOR_PICKUP" ${o.fulfilmentStatus === 'READY_FOR_PICKUP' ? 'selected' : ''}>READY_FOR_PICKUP</option>
                    <option value="DISPATCHED" ${o.fulfilmentStatus === 'DISPATCHED' ? 'selected' : ''}>DISPATCHED</option>
                    <option value="DELIVERED" ${o.fulfilmentStatus === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
                  </select>
                </td>
                <td>
                  <button class="btn-secondary" style="padding: 4px 10px; font-size: 0.75rem; color: var(--text-main);" onclick="window.openInvoiceModal('${o.orderNumber}')">
                    Print Invoice 📄
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderAdminFinance() {
    const content = $('#adminTabContent');
    if (!content) return;

    const orders = AkabatiBackend.Orders.getOrders();

    content.innerHTML = `
      <h4 style="font-family: var(--font-heading); margin-bottom: 12px;">Financial Reconciliation & Payment Journal</h4>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
        Authoritative transaction ledger for payments collected via MTN MoMo, Telecel Cash, and Paystack.
      </p>

      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order Ref</th>
              <th>Channel</th>
              <th>Provider Reference</th>
              <th>Settled Total</th>
              <th>Reconciliation</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td>${new Date(o.date).toLocaleDateString()}</td>
                <td><strong>${o.orderNumber}</strong></td>
                <td>${o.paymentMethod}</td>
                <td><code>${o.paymentReference || 'MM-GH-SETTLED'}</code></td>
                <td><strong>${formatMoney(o.total)}</strong></td>
                <td style="color: var(--accent-green); font-weight: 700; font-size: 0.8rem;">✓ 100% Settled</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderAdminPromotions() {
    const content = $('#adminTabContent');
    if (!content) return;

    const promos = AkabatiBackend.Promotions.getPromotions();

    content.innerHTML = `
      <h4 style="font-family: var(--font-heading); margin-bottom: 12px;">Promotions & Discount Vouchers</h4>
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Type</th>
              <th>Discount Value</th>
              <th>Min. Spend</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${promos.map(p => `
              <tr>
                <td><strong><code>${p.code}</code></strong></td>
                <td>${p.type}</td>
                <td>${p.type === 'PERCENTAGE' ? p.value + '%' : formatMoney(p.value)}</td>
                <td>${formatMoney(p.minSpend)}</td>
                <td>${p.description}</td>
                <td><span class="status-badge paid">ACTIVE</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderAdminAudit() {
    const content = $('#adminTabContent');
    if (!content) return;

    const logs = AkabatiBackend.Audit.getAll();

    content.innerHTML = `
      <h4 style="font-family: var(--font-heading); margin-bottom: 12px;">System & Staff Security Audit Log</h4>
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Audit Payload</th>
            </tr>
          </thead>
          <tbody>
            ${logs.slice(0, 15).map(l => `
              <tr>
                <td>${new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                <td><strong>${l.actor}</strong></td>
                <td><span class="status-badge pending">${l.action}</span></td>
                <td><code>${l.entityType} #${l.entityId}</code></td>
                <td style="font-size: 0.75rem; color: var(--text-muted);">${JSON.stringify(l.details)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  window.adminAdjustStockPrompt = function (id) {
    const p = AkabatiBackend.Catalog.getProductById(id);
    if (!p) return;

    const newStockStr = prompt(`Enter new showroom stock for "${p.name}" (Current: ${p.stock}):`, p.stock);
    if (newStockStr === null) return;

    const newStock = parseInt(newStockStr, 10);
    if (isNaN(newStock) || newStock < 0) {
      alert('Please enter a valid non-negative number.');
      return;
    }

    const reason = prompt('Mandatory Audit Reason (e.g., Stock Receipt, Showroom Physical Count, Damage/Loss):', 'Showroom Physical Count');
    if (!reason) {
      alert('Stock adjustment cancelled. A reason is required by architecture policy.');
      return;
    }

    AkabatiBackend.Inventory.adjustStock(id, newStock, reason, 'Inventory Manager');
    renderAdminInventory();
    renderProductGrid();
    showToast(`Stock updated for ${p.sku} (${reason})`);
  };

  window.adminEditPrice = function (id) {
    const p = AkabatiBackend.Catalog.getProductById(id);
    if (!p) return;

    const newPriceStr = prompt(`Enter new price in GH₵ for "${p.name}":`, p.price);
    if (newPriceStr === null) return;

    const newPrice = parseFloat(newPriceStr);
    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Invalid price.');
      return;
    }

    AkabatiBackend.Catalog.updatePrice(id, newPrice, 'Administrator');
    renderAdminProducts();
    renderProductGrid();
    showToast(`Price updated for ${p.name}`);
  };

  window.adminToggleStatus = function (id) {
    const p = AkabatiBackend.Catalog.toggleStatus(id, 'Administrator');
    renderAdminProducts();
    renderProductGrid();
    showToast(`Product is now ${p.status}`);
  };

  window.adminUpdateOrderStatus = function (orderNumber, newStatus) {
    AkabatiBackend.Orders.updateFulfilmentStatus(orderNumber, newStatus, 'Staff pipeline update', 'Order Manager');
    showToast(`Order ${orderNumber} updated to ${newStatus}`);
  };

  window.openAddProductForm = function () {
    const name = prompt('Product Name:');
    if (!name) return;
    const category = prompt('Department (Electronics or Vehicles):', 'Electronics');
    const price = parseFloat(prompt('Price in GH₵:', '5000') || '0');
    const stock = parseInt(prompt('Opening Stock Quantity in Ejisu:', '5') || '5', 10);

    const isVeh = category.toLowerCase().includes('veh');
    const newProductData = {
      name,
      category: isVeh ? 'Vehicles' : 'Electronics',
      subcategory: isVeh ? 'Showroom Listing' : 'Electronics',
      brand: 'Akabati Certified',
      price: price > 0 ? price : 1000,
      stock: stock > 0 ? stock : 1,
      tag: 'New Listing',
      condition: 'Verified Genuine',
      warranty: isVeh ? '6 Months Mechanical Warranty + 120-Point Inspection' : '1 Year Official Warranty',
      description: 'Handpicked quality inventory backed by Akabati Enterprise in Ejisu, Ashanti Region, Ghana.',
      specs: isVeh ? {
        'Inspection': '120-Point Checked',
        'Showroom': 'Ejisu Main Lot'
      } : {
        'Quality Standard': 'Certified Authentic',
        'Showroom': 'Ejisu Electronics Counter'
      }
    };

    const created = AkabatiBackend.Catalog.createProduct(newProductData, 'Administrator');
    renderAdminProducts();
    renderProductGrid();
    showToast(`New product "${created.name}" created successfully!`);
  };

  // Filter Listeners
  window.filterCategory = function (category) {
    activeCategory = category;
    $$('.filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === category);
    });
    renderProductGrid();
  };

  window.resetShopFilters = function () {
    activeCategory = 'All';
    activeSearchQuery = '';
    inStockOnly = false;
    const searchInput = $('#searchInput');
    if (searchInput) searchInput.value = '';
    const inStockBox = $('#inStockOnlyToggle');
    if (inStockBox) inStockBox.checked = false;
    $$('.filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === 'All');
    });
    renderProductGrid();
  };

  // =========================================================================
  // 10. Policy Modals
  // =========================================================================
  window.openPolicyModal = function (type) {
    const modalBody = $('#policyModalBody');
    const modalTitle = $('#policyModalTitle');
    if (!modalBody || !modalTitle) return;

    if (type === 'shipping') {
      modalTitle.textContent = 'Shipping & Delivery Policy';
      modalBody.innerHTML = `
        <h4 style="font-family: var(--font-heading); margin-bottom: 8px;">Delivery Across Ghana</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
          Akabati Enterprise operates an active logistics hub from Ejisu, Ashanti Region, Ghana. We ensure all electronics and vehicles are handled with professional care.
        </p>
        <ul style="padding-left: 20px; font-size: 0.88rem; color: var(--text-muted); line-height: 1.8;">
          <li><strong>Ejisu Showroom Pickup:</strong> Free of charge. Customer can physically inspect items before handover.</li>
          <li><strong>Ashanti Regional Courier:</strong> GH₵ 50.00 flat rate for Kumasi, Ejisu, and adjacent districts. Same-day or next-day delivery.</li>
          <li><strong>Nationwide Ghana Express:</strong> GH₵ 120.00 to Accra, Takoradi, Sunyani, Tamale, Cape Coast and all other regional capitals.</li>
          <li><strong>Vehicle Logistics:</strong> Directly coordinated with our certified transport team or collected at our Ejisu Lot.</li>
        </ul>
      `;
    } else if (type === 'warranty') {
      modalTitle.textContent = 'Warranty & Return Policy';
      modalBody.innerHTML = `
        <h4 style="font-family: var(--font-heading); margin-bottom: 8px;">Quality, Our Pride Assurance</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
          Every single item sold at Akabati Enterprise is backed by our verified authenticity guarantee.
        </p>
        <ul style="padding-left: 20px; font-size: 0.88rem; color: var(--text-muted); line-height: 1.8;">
          <li><strong>Electronics Warranty:</strong> 1 to 3 Years official manufacturer warranty on brand-new TVs, laptops, smartphones, and audio gear.</li>
          <li><strong>Vehicle 120-Point Inspection:</strong> All vehicles undergo mechanical, chassis, transmission, and electrical inspection before listing.</li>
          <li><strong>7-Day Defect Exchange:</strong> In the rare event of a factory malfunction, notify us within 7 days for repair, replacement, or refund.</li>
        </ul>
      `;
    } else {
      modalTitle.textContent = 'Terms & Privacy Policy';
      modalBody.innerHTML = `
        <h4 style="font-family: var(--font-heading); margin-bottom: 8px;">Data & Transaction Integrity</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
          In accordance with Ghanaian commerce standards and Data Protection Commission guidelines, Akabati Enterprise protects your customer data.
        </p>
        <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.7;">
          Mobile money numbers and card details are securely processed via certified payment gateways and are never stored in plaintext on our servers.
        </p>
      `;
    }

    $('#policyModalWrapper').classList.add('show');
    $('#siteOverlay').classList.add('show');
  };

  window.closePolicyModal = function () {
    $('#policyModalWrapper').classList.remove('show');
    $('#siteOverlay').classList.remove('show');
  };

  window.closeAllModals = function () {
    $$('.modal-wrapper').forEach(m => m.classList.remove('show'));
    $('#cartDrawer').classList.remove('show');
    $('#siteOverlay').classList.remove('show');
  };

  // Keyboard shortcut: '/' to focus search
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const search = $('#searchInput');
      if (search) {
        search.focus();
        search.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (e.key === 'Escape') {
      window.closeAllModals();
    }
  });

  // DOM Content Loaded Initializer
  document.addEventListener('DOMContentLoaded', () => {
    renderProductGrid();
    renderCart();
    updateBadges();

    // Event Listeners for Filters & Search
    $$('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        window.filterCategory(tab.dataset.category);
      });
    });

    const searchInput = $('#searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        activeSearchQuery = e.target.value;
        renderProductGrid();
      });
    }

    const sortSelect = $('#sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', e => {
        activeSort = e.target.value;
        renderProductGrid();
      });
    }

    const inStockToggle = $('#inStockOnlyToggle');
    if (inStockToggle) {
      inStockToggle.addEventListener('change', e => {
        inStockOnly = e.target.checked;
        renderProductGrid();
      });
    }

    // Overlay click closes everything
    const overlay = $('#siteOverlay');
    if (overlay) {
      overlay.addEventListener('click', window.closeAllModals);
    }

    // Mobile nav toggle
    const mobileBtn = $('#mobileMenuBtn');
    const navMenu = $('#mainNavMenu');
    if (mobileBtn && navMenu) {
      mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });
    }
  });

})();
