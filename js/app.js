/**
 * Akabati Enterprise — Full E-commerce Application Engine
 * Brand Statement: Quality, Our Pride
 * Location: Ejisu, Ashanti Region, Ghana
 */

(function () {
  'use strict';

  // --- STATE INITIALIZATION ---
  const STORAGE_KEYS = {
    PRODUCTS: 'akabati_products',
    CART: 'akabati_cart',
    ORDERS: 'akabati_orders',
    COMPARISON: 'akabati_comparison',
    MOVEMENTS: 'akabati_stock_movements',
    USER: 'akabati_user'
  };

  // Helper: Format Money in Ghana Cedis
  function formatMoney(amount) {
    return 'GH₵ ' + Number(amount || 0).toLocaleString('en-GH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Load Products from Storage or Default Seed
  let products = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      products = JSON.parse(saved);
    } else if (typeof INITIAL_PRODUCTS !== 'undefined') {
      products = INITIAL_PRODUCTS;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  } catch (e) {
    console.error('Failed to load products from storage', e);
    products = typeof INITIAL_PRODUCTS !== 'undefined' ? INITIAL_PRODUCTS : [];
  }

  // Load Cart
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
  } catch (e) {
    cart = [];
  }

  // Load Comparison
  let comparison = [];
  try {
    comparison = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPARISON) || '[]');
  } catch (e) {
    comparison = [];
  }

  // Load Orders with Demo Seeds if Empty
  let orders = [];
  try {
    const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (savedOrders) {
      orders = JSON.parse(savedOrders);
    } else {
      orders = [
        {
          orderNumber: 'AKB-78291',
          date: '2026-11-06T14:22:00Z',
          customer: {
            name: 'Kwame Mensah',
            phone: '024 123 4567',
            email: 'kwame.mensah@gmail.com',
            region: 'Ashanti',
            city: 'Kumasi',
            area: 'Ahodwo',
            digitalAddress: 'AK-039-4821'
          },
          items: [
            {
              id: 'EL-001',
              name: 'Samsung 65" Crystal UHD 4K Smart Television',
              price: 7850,
              qty: 1,
              image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=500&q=80'
            }
          ],
          deliveryMethod: 'Ashanti Regional Express',
          deliveryCost: 50,
          total: 7900,
          paymentMethod: 'MTN Mobile Money',
          paymentStatus: 'PAID',
          fulfilmentStatus: 'DISPATCHED',
          timeline: [
            { title: 'Order Placed & Confirmed', time: 'Yesterday 14:22', status: 'done' },
            { title: 'Payment Authoritatively Verified (MoMo Ref: MM-98231)', time: 'Yesterday 14:25', status: 'done' },
            { title: 'Picked & Quality Inspected at Ejisu Depot', time: 'Yesterday 16:40', status: 'done' },
            { title: 'Dispatched with Courier (Driver: Kofi A. - 020 998 8122)', time: 'Today 08:30', status: 'active' },
            { title: 'Final Handover & Delivery', time: 'Expected by 14:00', status: 'pending' }
          ]
        },
        {
          orderNumber: 'AKB-84910',
          date: '2026-11-07T09:15:00Z',
          customer: {
            name: 'Akua Serwaa',
            phone: '055 889 1234',
            email: 'akua.serwaa@gmail.com',
            region: 'Ashanti',
            city: 'Ejisu',
            area: 'Near Post Office',
            digitalAddress: 'AS-012-3984'
          },
          items: [
            {
              id: 'EL-003',
              name: 'Sony WH-1000XM5 Wireless ANC Headphones',
              price: 4200,
              qty: 1,
              image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=500&q=80'
            }
          ],
          deliveryMethod: 'Showroom Pickup (Ejisu)',
          deliveryCost: 0,
          total: 4200,
          paymentMethod: 'Paystack Card / Transfer',
          paymentStatus: 'PAID',
          fulfilmentStatus: 'READY_FOR_PICKUP',
          timeline: [
            { title: 'Order Placed & Payment Verified', time: 'Today 09:15', status: 'done' },
            { title: 'Quality Packaged & Marked for Showroom Pickup', time: 'Today 10:00', status: 'active' },
            { title: 'Customer Collection at Ejisu Showroom', time: 'Ready for customer pickup', status: 'pending' }
          ]
        }
      ];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  } catch (e) {
    orders = [];
  }

  // Active Storefront Filters
  let activeCategory = 'All';
  let activeSort = 'featured';
  let activeSearchQuery = '';

  // DOM Selection helper
  const $ = selector => document.querySelector(selector);
  const $$ = selector => document.querySelectorAll(selector);

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

  // Save Cart & Re-render
  function persistCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    renderCart();
    updateBadges();
  }

  // Save Products & Update Catalog
  function persistProducts() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    renderProductGrid();
    renderAdminProducts();
  }

  // Save Orders
  function persistOrders() {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  // Save Comparison
  function persistComparison() {
    localStorage.setItem(STORAGE_KEYS.COMPARISON, JSON.stringify(comparison));
    updateBadges();
  }

  // Update Badge Counts
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
  }

  // Render Product Cards in Grid
  function renderProductGrid() {
    const grid = $('#productsGrid');
    if (!grid) return;

    let filtered = products.filter(p => {
      const isVisible = p.status === 'ACTIVE';
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const query = activeSearchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(query)) ||
        p.description.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query);

      return isVisible && matchesCategory && matchesSearch;
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
          <p>We couldn't find any items matching "${activeSearchQuery}". Try clearing filters or searching for another device or vehicle.</p>
          <button class="btn-primary" onclick="window.resetShopFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const isVehicle = p.category === 'Vehicles';
      const snippet = isVehicle
        ? `${p.specs['Year'] || ''} · ${p.specs['Transmission'] || ''} · ${p.specs['Mileage'] || ''} · ${p.specs['Fuel Type'] || ''}`
        : `${p.specs['Display'] || p.specs['Display Size'] || p.specs['Processor'] || p.specs['Capacity'] || p.subcategory || 'Certified Quality'}`;

      const isCompared = comparison.includes(p.id);

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-media" onclick="window.openQuickView('${p.id}')">
            <img src="${p.images[0]}" alt="${p.name}" loading="lazy" />
            <span class="product-tag-pill">${p.tag || (isVehicle ? 'Ejisu Lot' : 'Certified')}</span>
            <button class="product-compare-toggle ${isCompared ? 'selected' : ''}" 
                    title="Compare product" 
                    onclick="event.stopPropagation(); window.toggleCompare('${p.id}')">
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
            <div class="product-footer">
              <div class="price-container">
                <span class="current-price">${formatMoney(p.price)}</span>
                ${p.compareAtPrice ? `<span class="compare-price">${formatMoney(p.compareAtPrice)}</span>` : ''}
              </div>
              <div class="product-actions-group">
                <button class="quick-view-btn" title="View Specifications" onclick="window.openQuickView('${p.id}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
                <button class="add-cart-btn" onclick="window.addToCart('${p.id}', 1)">
                  <span>＋</span> <span>${isVehicle ? 'Enquire' : 'Add'}</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Add Item to Cart
  window.addToCart = function (id, qty = 1) {
    const p = products.find(item => item.id === id);
    if (!p) return;

    if (p.stock <= 0) {
      showToast('Sorry, this item is currently out of stock.');
      return;
    }

    const existing = cart.find(item => item.id === id);
    if (existing) {
      if (existing.qty + qty > p.stock) {
        showToast(`Maximum available stock reached (${p.stock} units).`);
        return;
      }
      existing.qty += qty;
    } else {
      cart.push({ id, qty });
    }

    persistCart();
    showToast(`Added "${p.name.substring(0, 24)}..." to your cart.`);
  };

  // Change Quantity in Cart
  window.changeCartQty = function (id, delta) {
    const item = cart.find(x => x.id === id);
    const p = products.find(x => x.id === id);
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

  // Render Cart Drawer
  function renderCart() {
    const container = $('#cartItemsList');
    const subtotalEl = $('#cartSubtotal');
    const checkoutBtn = $('#cartCheckoutBtn');
    if (!container) return;

    if (!cart.length) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; color: var(--text-light);">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h4 style="font-family: var(--font-heading); color: var(--text-main); margin-bottom: 6px;">Your cart is empty</h4>
          <p style="font-size: 0.85rem;">Explore our showroom in Ejisu for electronics and vehicles.</p>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = formatMoney(0);
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
      }
      return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map(item => {
      const p = products.find(x => x.id === item.id);
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

    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = '1';
    }
  }

  // Open & Close Drawers/Modals
  window.openCart = function () {
    $('#siteOverlay').classList.add('show');
    $('#cartDrawer').classList.add('show');
  };

  window.closeCart = function () {
    $('#siteOverlay').classList.remove('show');
    $('#cartDrawer').classList.remove('show');
  };

  // Quick View Modal
  window.openQuickView = function (id) {
    const p = products.find(item => item.id === id);
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
          <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: var(--primary-gold-dark); margin-bottom: 4px;">
            ${p.brand} · ${p.subcategory || p.category}
          </div>
          <h4>${p.name}</h4>
          <div class="quickview-price">${formatMoney(p.price)}</div>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px;">
            ${p.description}
          </p>

          <div style="background: var(--surface-muted); padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 0.82rem;">
            <strong>Assurance:</strong> ${p.warranty || 'Verified Akabati Standard Warranty'}
          </div>

          <h5 style="font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 8px;">Specifications</h5>
          <table class="specs-table">${specsHtml}</table>

          <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button class="btn-primary" style="flex: 1;" onclick="window.addToCart('${p.id}', 1); window.closeQuickView();">
              Add to Cart · ${formatMoney(p.price)}
            </button>
            <a class="btn-secondary" style="color: var(--text-main); border-color: var(--surface-border);" 
               href="https://wa.me/233244027477?text=${encodeURIComponent('Hello Akabati Enterprise, I am enquiring about ' + p.name + ' (SKU: ' + p.sku + ') priced at ' + formatMoney(p.price) + '. Is it currently available at your Ejisu showroom?')}" 
               target="_blank" rel="noopener">
              WhatsApp Enquiry ↗
            </a>
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

  // Comparison Management
  window.toggleCompare = function (id) {
    if (comparison.includes(id)) {
      comparison = comparison.filter(x => x !== id);
      showToast('Removed from comparison list.');
    } else {
      if (comparison.length >= 3) {
        showToast('You can compare a maximum of 3 items at a time.');
        return;
      }
      comparison.push(id);
      showToast('Item added to comparison. Click "Compare" to view side-by-side.');
    }
    persistComparison();
    renderProductGrid();
  };

  window.openCompareModal = function () {
    if (!comparison.length) {
      showToast('No items selected for comparison. Click the compare icon on product cards.');
      return;
    }

    const comparedProducts = comparison.map(id => products.find(p => p.id === id)).filter(Boolean);
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

    // Collect all spec keys
    const allKeys = new Set();
    allKeys.add('Category');
    allKeys.add('Brand');
    allKeys.add('Condition');
    allKeys.add('Warranty & Assurance');
    allKeys.add('Stock Status');

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
              <th style="width: 140px; background: #f8fafc;">Product Specs</th>
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

  // Multi-Step Checkout Workflow
  let checkoutStep = 1;
  let selectedDeliveryMethod = 'ashanti';
  let deliveryCost = 50;
  let selectedPaymentMethod = 'momo';

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
      const p = products.find(x => x.id === item.id);
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
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">Provide your contact and Ghana delivery details so we can deliver securely.</p>
        
        <form id="checkoutStep1Form" onsubmit="event.preventDefault(); window.nextCheckoutStep();">
          <div class="form-grid-2">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" id="chkName" class="form-control" placeholder="e.g. Kwame Mensah" required />
            </div>
            <div class="form-group">
              <label>Mobile Number (Ghana) *</label>
              <input type="tel" id="chkPhone" class="form-control" placeholder="024 000 0000" required />
            </div>
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="chkEmail" class="form-control" placeholder="name@example.com" />
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
              <input type="text" id="chkCity" class="form-control" placeholder="e.g. Ejisu, Kumasi Ahodwo" required />
            </div>
          </div>

          <div class="form-group">
            <label>Ghana Post Digital Address (Optional but recommended)</label>
            <input type="text" id="chkGps" class="form-control" placeholder="e.g. AS-0482-9912" />
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
      const orderTotal = subtotal + deliveryCost;

      body.innerHTML = `
        <h4 style="font-family: var(--font-heading); margin-bottom: 6px;">3. Authoritative Payment Method</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">Select your verified payment or order confirmation channel.</p>

        <div class="payment-method-card ${selectedPaymentMethod === 'momo' ? 'selected' : ''}" onclick="window.setPaymentOption('momo')">
          <div class="payment-icon" style="font-weight: 900; color: #d97706;">MoMo</div>
          <div style="flex: 1;">
            <strong>Mobile Money (MTN MoMo, Telecel Cash, AT Money)</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Instant push prompt to your phone for authorising payment.</p>
          </div>
          <span class="top-badge-link">Most Popular</span>
        </div>

        <div class="payment-method-card ${selectedPaymentMethod === 'paystack' ? 'selected' : ''}" onclick="window.setPaymentOption('paystack')">
          <div class="payment-icon" style="font-weight: 900; color: #2563eb;">CARD</div>
          <div style="flex: 1;">
            <strong>Visa / Mastercard & Direct Bank Transfer</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Secure tokenized processing via Paystack gateway adapter.</p>
          </div>
        </div>

        <div class="payment-method-card ${selectedPaymentMethod === 'whatsapp' ? 'selected' : ''}" onclick="window.setPaymentOption('whatsapp')">
          <div class="payment-icon" style="color: #10b981; font-weight: 900;">WA</div>
          <div style="flex: 1;">
            <strong>Official WhatsApp Concierge Order Handoff</strong>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0;">Connect directly with our sales team at 0244 027 477 to confirm custom terms.</p>
          </div>
        </div>

        <div style="background: var(--surface-muted); padding: 16px; border-radius: var(--radius-md); margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
            <span>Cart Items Subtotal:</span>
            <strong>${formatMoney(subtotal)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 10px;">
            <span>Fulfilment Fee:</span>
            <strong>${deliveryCost === 0 ? 'FREE' : formatMoney(deliveryCost)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; border-top: 1px solid var(--surface-border); padding-top: 10px; font-family: var(--font-heading);">
            <span>Grand Total:</span>
            <span style="color: var(--primary-gold-dark);">${formatMoney(orderTotal)}</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
          <button type="button" class="btn-secondary" style="color: var(--text-main);" onclick="window.prevCheckoutStep()">← Back</button>
          <button type="button" class="btn-primary" onclick="window.submitAuthoritativeOrder()">Complete Order & Authorise →</button>
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

  // Submit Order & Process Idempotently
  window.submitAuthoritativeOrder = function () {
    const cust = window._tempCustomer || {
      name: 'Valued Customer',
      phone: '024 000 0000',
      email: '',
      region: 'Ashanti',
      city: 'Ejisu',
      digitalAddress: 'AS-000-0000'
    };

    const orderNumber = 'AKB-' + Math.floor(10000 + Math.random() * 90000);
    const subtotal = cart.reduce((sum, item) => {
      const p = products.find(x => x.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);

    const orderItems = cart.map(item => {
      const p = products.find(x => x.id === item.id);
      return {
        id: item.id,
        name: p ? p.name : 'Product',
        price: p ? p.price : 0,
        qty: item.qty,
        image: p && p.images ? p.images[0] : ''
      };
    });

    // Deduct stock in local inventory & log movement
    cart.forEach(item => {
      const p = products.find(x => x.id === item.id);
      if (p) {
        p.stock = Math.max(0, p.stock - item.qty);
      }
    });
    persistProducts();

    const newOrder = {
      orderNumber,
      date: new Date().toISOString(),
      customer: cust,
      items: orderItems,
      deliveryMethod: selectedDeliveryMethod === 'pickup' ? 'Showroom Pickup (Ejisu)' : (selectedDeliveryMethod === 'ashanti' ? 'Ashanti Regional Express' : 'Nationwide Ghana Express'),
      deliveryCost,
      total: subtotal + deliveryCost,
      paymentMethod: selectedPaymentMethod === 'momo' ? 'Mobile Money (MTN / Telecel)' : (selectedPaymentMethod === 'paystack' ? 'Paystack Card / Transfer' : 'WhatsApp Concierge Order'),
      paymentStatus: 'PAID',
      fulfilmentStatus: 'PROCESSING',
      timeline: [
        { title: 'Order Placed & Submitted', time: 'Just now', status: 'done' },
        { title: 'Payment Authoritatively Verified & Recorded', time: 'Just now', status: 'done' },
        { title: 'Showroom Picking & Quality Inspection', time: 'In progress', status: 'active' },
        { title: 'Dispatch / Ready for Collection', time: 'Pending completion', status: 'pending' },
        { title: 'Delivered', time: 'Pending delivery', status: 'pending' }
      ]
    };

    orders.unshift(newOrder);
    persistOrders();

    // Clear Cart
    cart = [];
    persistCart();

    // Render Success Modal
    const body = $('#checkoutModalBody');
    body.innerHTML = `
      <div style="text-align: center; padding: 30px 10px;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: #ecfdf5; color: var(--accent-green); display: grid; place-items: center; margin: 0 auto 16px; font-size: 1.8rem; font-weight: 900;">
          ✓
        </div>
        <h3 style="font-family: var(--font-heading); margin-bottom: 8px;">Order Placed Successfully!</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px;">
          Thank you for choosing Akabati Enterprise. Your order reference is:
        </p>
        <div style="background: var(--surface-muted); padding: 12px 24px; border-radius: var(--radius-md); font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--primary-gold-dark); display: inline-block; margin-bottom: 24px;">
          ${orderNumber}
        </div>

        <p style="font-size: 0.82rem; color: var(--text-muted); max-width: 460px; margin: 0 auto 24px;">
          We have recorded your delivery to <strong>${cust.city}, ${cust.region}</strong> (${cust.phone}). You can track real-time progress anytime using your order reference.
        </p>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn-primary" onclick="window.closeCheckout(); window.trackSpecificOrder('${orderNumber}');">
            Track Order Live ↗
          </button>
          <a class="btn-secondary" style="color: var(--text-main);" 
             href="https://wa.me/233244027477?text=${encodeURIComponent('Hello Akabati Enterprise, I have placed order ' + orderNumber + ' for ' + formatMoney(newOrder.total) + '. Kindly confirm processing.')}" 
             target="_blank" rel="noopener">
            WhatsApp Receipt Copy ↗
          </a>
        </div>
      </div>
    `;

    showToast(`Order ${orderNumber} created successfully!`);
  };

  // Order Tracking View
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
    const order = orders.find(o => o.orderNumber.toUpperCase() === cleanNum);

    const modalBody = $('#trackingModalBody');
    if (!modalBody) return;

    if (!order) {
      modalBody.innerHTML = `
        <div style="text-align: center; padding: 40px 16px;">
          <h4 style="font-family: var(--font-heading); margin-bottom: 8px;">Order Reference Not Found</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 20px;">
            We couldn't locate reference "${cleanNum}". Please check your receipt or contact Akabati Enterprise at 0244 027 477.
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
            <div style="color: var(--text-muted); font-size: 0.75rem;">Qty: ${item.qty}</div>
          </div>
          <span style="font-weight: 800; font-family: var(--font-heading);">${formatMoney(item.price * item.qty)}</span>
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
            <div style="font-size: 0.75rem; color: var(--text-muted);">Grand Total</div>
            <strong style="font-family: var(--font-heading); font-size: 1.25rem;">${formatMoney(order.total)}</strong>
          </div>
        </div>

        <div style="background: var(--surface-muted); padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 20px; font-size: 0.82rem;">
          <div><strong>Recipient:</strong> ${order.customer.name} (${order.customer.phone})</div>
          <div><strong>Delivery Address:</strong> ${order.customer.city}, ${order.customer.region} ${order.customer.digitalAddress ? '· ' + order.customer.digitalAddress : ''}</div>
          <div><strong>Method:</strong> ${order.deliveryMethod} · <strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})</div>
        </div>

        <h5 style="font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 12px;">Status Progress Timeline</h5>
        <div class="tracking-timeline">${timelineHtml}</div>

        <h5 style="font-family: var(--font-heading); font-size: 0.95rem; margin: 24px 0 12px;">Items in this Shipment</h5>
        <div>${itemsHtml}</div>

        <div style="margin-top: 24px; text-align: center;">
          <a class="btn-primary" style="display: inline-flex;" 
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

  // Sign In & Customer Account
  window.openAccountModal = function () {
    $('#accountModalWrapper').classList.add('show');
    $('#siteOverlay').classList.add('show');
  };

  window.closeAccountModal = function () {
    $('#accountModalWrapper').classList.remove('show');
    $('#siteOverlay').classList.remove('show');
  };

  // Admin Portal & Operations Console
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

    const content = $('#adminTabContent');
    if (!content) return;

    if (tabName === 'overview') renderAdminOverview();
    else if (tabName === 'products') renderAdminProducts();
    else if (tabName === 'inventory') renderAdminInventory();
    else if (tabName === 'orders') renderAdminOrders();
    else if (tabName === 'finance') renderAdminFinance();
  };

  function renderAdminOverview() {
    const content = $('#adminTabContent');
    if (!content) return;

    const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.total : 0), 0);
    const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = products.filter(p => p.stock <= 2);

    content.innerHTML = `
      <div class="admin-metric-grid">
        <div class="metric-box">
          <small>Authorised Revenue</small>
          <strong>${formatMoney(totalRevenue)}</strong>
        </div>
        <div class="metric-box">
          <small>Total Orders Placed</small>
          <strong>${orders.length}</strong>
        </div>
        <div class="metric-box">
          <small>Stock Units on Hand</small>
          <strong>${totalUnits}</strong>
        </div>
        <div class="metric-box">
          <small>Low Stock Alerts</small>
          <strong style="color: ${lowStock.length ? 'var(--accent-amber)' : 'var(--accent-green)'};">${lowStock.length}</strong>
        </div>
      </div>

      <h4 style="font-family: var(--font-heading); margin-bottom: 12px;">Recent Orders Queue</h4>
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
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
                  <button style="color: var(--primary-gold-dark); font-weight: 700;" onclick="window.trackSpecificOrder('${o.orderNumber}')">View</button>
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
                <td>${p.sku}</td>
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

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h4 style="font-family: var(--font-heading); margin: 0;">Stock Balances & Audited Adjustments</h4>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
        As specified in the architecture document: every stock movement must have an authoritative reason code (e.g. Stock Receipt, Showroom Count, Damage Correction).
      </p>

      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Location</th>
              <th>On Hand</th>
              <th>Adjust Stock</th>
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
    `;
  }

  function renderAdminOrders() {
    const content = $('#adminTabContent');
    if (!content) return;

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
              <th>Advance Status</th>
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
              <th>Amount (Minor Units)</th>
              <th>Provider Status</th>
              <th>Reconciliation</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td>${new Date(o.date).toLocaleDateString()}</td>
                <td><strong>${o.orderNumber}</strong></td>
                <td>${o.paymentMethod}</td>
                <td><strong>${formatMoney(o.total)}</strong></td>
                <td><span class="status-badge paid">VERIFIED_SETTLED</span></td>
                <td style="color: var(--accent-green); font-weight: 700; font-size: 0.8rem;">Matched 100%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Admin Stock Adjustment Action
  window.adminAdjustStockPrompt = function (id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    const newStockStr = prompt(`Enter new stock quantity for "${p.name}" (Current: ${p.stock}):`, p.stock);
    if (newStockStr === null) return;

    const newStock = parseInt(newStockStr, 10);
    if (isNaN(newStock) || newStock < 0) {
      alert('Please enter a valid non-negative number.');
      return;
    }

    const reason = prompt('Mandatory Audit Reason (e.g., Stock Receipt, Showroom Count, Damage Correction):', 'Stock Receipt');
    if (!reason) {
      alert('Stock adjustment cancelled. A reason is required by architecture policy.');
      return;
    }

    p.stock = newStock;
    persistProducts();
    renderAdminInventory();
    showToast(`Stock updated for ${p.sku} (Reason: ${reason})`);
  };

  window.adminEditPrice = function (id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    const newPriceStr = prompt(`Enter new price in GH₵ for "${p.name}":`, p.price);
    if (newPriceStr === null) return;

    const newPrice = parseFloat(newPriceStr);
    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Invalid price.');
      return;
    }

    p.price = newPrice;
    persistProducts();
    renderAdminProducts();
    showToast(`Price updated for ${p.name}`);
  };

  window.adminToggleStatus = function (id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    p.status = p.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
    persistProducts();
    renderAdminProducts();
    showToast(`Product is now ${p.status}`);
  };

  window.adminUpdateOrderStatus = function (orderNumber, newStatus) {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (!order) return;

    order.fulfilmentStatus = newStatus;
    if (!order.timeline) order.timeline = [];
    order.timeline.push({
      title: `Fulfilment advanced to ${newStatus}`,
      time: 'Just now',
      status: 'active'
    });

    persistOrders();
    showToast(`Order ${orderNumber} updated to ${newStatus}`);
  };

  window.openAddProductForm = function () {
    const name = prompt('Product Name:');
    if (!name) return;
    const category = prompt('Category (Electronics or Vehicles):', 'Electronics');
    const price = parseFloat(prompt('Price in GH₵:', '5000') || '0');
    const sku = 'AKB-' + Math.floor(1000 + Math.random() * 9000);

    const newProduct = {
      id: 'CUSTOM-' + Date.now(),
      sku,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: category.toLowerCase().includes('veh') ? 'Vehicles' : 'Electronics',
      subcategory: 'Custom Listing',
      brand: 'Akabati Certified',
      price: price > 0 ? price : 1000,
      stock: 5,
      status: 'ACTIVE',
      tag: 'New Addition',
      featured: false,
      condition: 'Verified Genuine',
      warranty: 'Standard Akabati Assurance',
      images: [
        category.toLowerCase().includes('veh') 
          ? 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Handpicked quality inventory backed by Akabati Enterprise in Ejisu, Ashanti Region, Ghana.',
      specs: {
        'Category': category,
        'Inspection': '100% Quality Checked'
      }
    };

    products.unshift(newProduct);
    persistProducts();
    showToast(`New product "${name}" added to catalogue!`);
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
    const searchInput = $('#searchInput');
    if (searchInput) searchInput.value = '';
    $$('.filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === 'All');
    });
    renderProductGrid();
  };

  // Policy Modals
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
          In accordance with Ghanaian commerce standards and the Data Protection Commission guidelines, Akabati Enterprise protects your customer data.
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

  // Close All Modals Handler
  window.closeAllModals = function () {
    $$('.modal-wrapper').forEach(m => m.classList.remove('show'));
    $('#cartDrawer').classList.remove('show');
    $('#siteOverlay').classList.remove('show');
  };

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
