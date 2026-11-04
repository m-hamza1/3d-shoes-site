/* =========================================================
   AERO-X® // OFFICIAL FOOTWEAR LOGIC & INTERACTIONS
   ========================================================= */

const TOTAL_FRAMES = 240;
const loadedImages = {};
let isLoaded = false;
let currentFrameIndex = 1;
let lastRenderedIndex = -1;

// =========================================================
// CATALOG DATA (8 Realistic Footwear Products)
// =========================================================
const CATALOG_PRODUCTS = [
  {
    id: 'prod-01',
    name: 'AERO-X Matrix Pro 01',
    category: 'racing',
    categoryLabel: 'Kinetic Carbon Racing',
    price: 249.00,
    rating: '5.0',
    reviewsCount: 340,
    badge: 'BEST SELLER',
    badgeClass: 'accent',
    imgFrame: 1,
    filter: 'none',
    desc: 'The flagship continuous-carbon shank footwear featured in the 3D exploded view. Hand-stitched AeroKnit upper.'
  },
  {
    id: 'prod-02',
    name: 'AERO-X Volt Kinetic',
    category: 'racing',
    categoryLabel: 'High-Visibility Speed',
    price: 259.00,
    rating: '4.8',
    reviewsCount: 210,
    badge: 'NEW DROP',
    badgeClass: '',
    imgFrame: 60,
    filter: 'hue-rotate(60deg) saturate(1.2)',
    desc: 'High-visibility neon matrix upper engineered for evening tempo workouts and track sprints.'
  },
  {
    id: 'prod-03',
    name: 'AERO-X Solar Crimson',
    category: 'racing',
    categoryLabel: 'Thermal Weave Edition',
    price: 269.00,
    rating: '5.0',
    reviewsCount: 195,
    badge: 'LIMITED 500 PAIRS',
    badgeClass: 'red',
    imgFrame: 130,
    filter: 'hue-rotate(180deg) saturate(1.4)',
    desc: 'Radiant thermal crimson knit with custom dual-density carbon rocker plates.'
  },
  {
    id: 'prod-04',
    name: 'AERO-X Titanium Pure',
    category: 'streetwear',
    categoryLabel: 'Luxury Architectural',
    price: 279.00,
    rating: '4.9',
    reviewsCount: 140,
    badge: 'TRENDING',
    badgeClass: 'accent',
    imgFrame: 190,
    filter: 'grayscale(1) brightness(1.2)',
    desc: 'Monochrome pure titanium aesthetic with ice-clear translucent outsole lugs.'
  },
  {
    id: 'prod-05',
    name: 'AERO-Stride Cyber Shadow',
    category: 'training',
    categoryLabel: 'Marathon High-Mileage',
    price: 229.00,
    rating: '4.8',
    reviewsCount: 420,
    badge: 'ULTRA CUSHION',
    badgeClass: '',
    imgFrame: 20,
    filter: 'none',
    desc: 'Maximalist supercritical EVA-X cushioning designed for 40+ km weekly recovery runs.'
  },
  {
    id: 'prod-06',
    name: 'AERO-Carbon Velocity R',
    category: 'racing',
    categoryLabel: 'Sub-2hr Marathon Plate',
    price: 289.00,
    rating: '5.0',
    reviewsCount: 98,
    badge: 'PRO ATHLETICS',
    badgeClass: 'red',
    imgFrame: 80,
    filter: 'contrast(1.15)',
    desc: 'Pure competition weapon featuring the stiffest 3K pre-preg carbon plate certified by World Athletics.'
  },
  {
    id: 'prod-07',
    name: 'AERO-Terrain Shield GTX',
    category: 'weatherproof',
    categoryLabel: 'All-Weather Urban Trail',
    price: 255.00,
    rating: '4.7',
    reviewsCount: 180,
    badge: 'WATERPROOF',
    badgeClass: 'accent',
    imgFrame: 150,
    filter: 'hue-rotate(30deg) brightness(0.95)',
    desc: 'Hydrophobic nano-membrane shielding with motorsport vortex wet-compound grip lugs.'
  },
  {
    id: 'prod-08',
    name: 'AERO-Drift Minimalist Sock',
    category: 'streetwear',
    categoryLabel: 'Ultra-Light Slip-On',
    price: 199.00,
    rating: '4.9',
    reviewsCount: 310,
    badge: 'ULTRALIGHT 180G',
    badgeClass: '',
    imgFrame: 220,
    filter: 'grayscale(0.5)',
    desc: 'Featherlight 180g sock-fit silhouette with anatomic arch lockdown.'
  }
];

let currentCatalogCategory = 'all';
let currentCatalogSort = 'featured';
let currentSearchQuery = '';

// Studio Colorway Metadata
const COLORWAYS = {
  obsidian: {
    name: 'AERO-X / Cyber Obsidian',
    label: 'Cyber Obsidian / Cyan Core',
    price: '249.00',
    rawPrice: 249,
    filter: 'none'
  },
  neon: {
    name: 'AERO-X / Volt Kinetic',
    label: 'Volt Kinetic / Neon Matrix',
    price: '259.00',
    rawPrice: 259,
    filter: 'hue-rotate(60deg) saturate(1.2)'
  },
  sunset: {
    name: 'AERO-X / Solar Crimson',
    label: 'Solar Crimson / Radiant Weave',
    price: '269.00',
    rawPrice: 269,
    filter: 'hue-rotate(180deg) saturate(1.4)'
  },
  pure: {
    name: 'AERO-X / Titanium Pure',
    label: 'Titanium Pure / Ice Sole',
    price: '279.00',
    rawPrice: 279,
    filter: 'grayscale(1) brightness(1.2)'
  }
};

let activeColorKey = 'obsidian';
let activeSize = 'US 9.0';
let cartItems = [];
let appliedDiscount = 0; // %

// DOM Elements
const canvas = document.getElementById('shoeCanvas');
const ctx = canvas.getContext('2d');
const scrollyContainer = document.getElementById('scroll-section');
const siteHeader = document.getElementById('siteHeader');
const announcementBar = document.getElementById('announcementBar');
const loaderScreen = document.getElementById('loaderScreen');
const loaderBar = document.getElementById('loaderBar');
const loaderPercent = document.getElementById('loaderPercent');
const productCatalogGrid = document.getElementById('productCatalogGrid');

// Format frame path
function getFramePath(index) {
  const padded = String(index).padStart(5, '0');
  return `images/${padded}.png`;
}

// Preload 240 frames
function preloadFrames() {
  let loadedCount = 0;

  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFramePath(i);

    img.onload = () => {
      loadedImages[i] = img;
      loadedCount++;
      const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      if (loaderBar) loaderBar.style.width = `${pct}%`;
      if (loaderPercent) loaderPercent.textContent = `${pct}%`;

      if (loadedCount === 1) {
        setupCanvasSize();
        renderFrame(1);
      }

      if (loadedCount === TOTAL_FRAMES) {
        isLoaded = true;
        setTimeout(() => {
          if (loaderScreen) loaderScreen.classList.add('hidden');
        }, 250);
      }
    };

    img.onerror = () => {
      loadedCount++;
      if (loadedCount === TOTAL_FRAMES) {
        isLoaded = true;
        if (loaderScreen) loaderScreen.classList.add('hidden');
      }
    };
  }
}

// Canvas Resolution Setup
function setupCanvasSize() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;

  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);

  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  if (lastRenderedIndex > 0) {
    renderFrame(lastRenderedIndex);
  }
}

// Render Frame Cover Fit
function renderFrame(index) {
  const img = loadedImages[index];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  ctx.clearRect(0, 0, w, h);

  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const renderW = img.naturalWidth * scale;
  const renderH = img.naturalHeight * scale;
  
  const offsetX = (w - renderW) / 2;
  const offsetY = (h - renderH) / 2;

  ctx.save();
  if (COLORWAYS[activeColorKey].filter !== 'none') {
    ctx.filter = COLORWAYS[activeColorKey].filter;
  }
  ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  ctx.restore();

  lastRenderedIndex = index;
  currentFrameIndex = index;
}

// Scroll Handling
let isScrollTicking = false;

function onScroll() {
  if (!isScrollTicking) {
    requestAnimationFrame(() => {
      handleScrollUpdate();
      isScrollTicking = false;
    });
    isScrollTicking = true;
  }
}

function handleScrollUpdate() {
  const scrollY = window.scrollY || window.pageYOffset || 0;

  // Header Auto-Hide Logic: Only visible when at the very top (scrollY <= 25)
  if (scrollY <= 25) {
    if (siteHeader) siteHeader.classList.remove('header-hidden');
    if (announcementBar) announcementBar.classList.remove('announcement-hidden');
  } else {
    if (siteHeader) siteHeader.classList.add('header-hidden');
    if (announcementBar) announcementBar.classList.add('announcement-hidden');
  }

  // 3D Canvas Scroll Mapping
  const rect = scrollyContainer.getBoundingClientRect();
  const totalScrollable = scrollyContainer.offsetHeight - window.innerHeight;
  const currentScrolled = -rect.top;

  let progress = currentScrolled / totalScrollable;
  progress = Math.max(0, Math.min(1, progress));

  const targetFrame = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(1 + progress * (TOTAL_FRAMES - 1))));

  if (targetFrame !== lastRenderedIndex) {
    renderFrame(targetFrame);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
  setupCanvasSize();
  if (currentFrameIndex > 0) renderFrame(currentFrameIndex);
});

// Interactive Drag Scrubbing on Hero Canvas
let isDragging = false;
let startX = 0;

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const diff = e.clientX - startX;
  const sensitivity = 6;

  if (Math.abs(diff) >= sensitivity) {
    const shift = Math.floor(diff / sensitivity);
    let next = currentFrameIndex - shift;
    if (next < 1) next = TOTAL_FRAMES;
    if (next > TOTAL_FRAMES) next = 1;
    renderFrame(next);
    startX = e.clientX;
  }
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    isDragging = true;
    startX = e.touches[0].clientX;
  }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  const diff = e.touches[0].clientX - startX;
  const sensitivity = 6;

  if (Math.abs(diff) >= sensitivity) {
    const shift = Math.floor(diff / sensitivity);
    let next = currentFrameIndex - shift;
    if (next < 1) next = TOTAL_FRAMES;
    if (next > TOTAL_FRAMES) next = 1;
    renderFrame(next);
    startX = e.touches[0].clientX;
  }
}, { passive: true });

window.addEventListener('touchend', () => {
  isDragging = false;
});

// =========================================================
// CATALOG RENDERING & FILTERING ENGINE
// =========================================================
function renderCatalog() {
  if (!productCatalogGrid) return;

  let list = [...CATALOG_PRODUCTS];

  // 1. Filter by category
  if (currentCatalogCategory !== 'all') {
    list = list.filter(p => p.category === currentCatalogCategory);
  }

  // 2. Filter by search query
  if (currentSearchQuery.trim()) {
    const q = currentSearchQuery.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.categoryLabel.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q)
    );
  }

  // 3. Sort list
  if (currentCatalogSort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (currentCatalogSort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (currentCatalogSort === 'rating') {
    list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  }

  if (list.length === 0) {
    productCatalogGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: #64748b;">
        <h3>No footwear found matching "${currentSearchQuery}"</h3>
        <p style="margin-top: 0.5rem;">Try adjusting your search terms or category filter.</p>
      </div>
    `;
    return;
  }

  productCatalogGrid.innerHTML = list.map(item => `
    <div class="catalog-card" id="card-${item.id}">
      <div class="card-img-wrap">
        <span class="card-badge-flag ${item.badgeClass}">${item.badge}</span>
        <img src="${getFramePath(item.imgFrame)}" alt="${item.name}" id="img-${item.id}" style="filter: ${item.filter}">
        <button class="quick-view-overlay-btn" onclick="openQuickView('${item.id}')">Quick View</button>
      </div>

      <div class="card-content">
        <div class="card-category-label">${item.categoryLabel}</div>
        <h3 class="card-title">${item.name}</h3>

        <div class="card-rating-row">
          <span class="stars">★★★★★</span>
          <span>${item.rating} (${item.reviewsCount})</span>
        </div>

        <div class="card-swatches-row">
          <span class="card-swatch-dot active" style="--dot-c: #11141a;" title="Obsidian" onclick="changeCardColor('${item.id}', 'none')"></span>
          <span class="card-swatch-dot" style="--dot-c: #39ff14;" title="Volt" onclick="changeCardColor('${item.id}', 'hue-rotate(60deg) saturate(1.2)')"></span>
          <span class="card-swatch-dot" style="--dot-c: #ff3366;" title="Solar" onclick="changeCardColor('${item.id}', 'hue-rotate(180deg) saturate(1.4)')"></span>
          <span class="card-swatch-dot" style="--dot-c: #f8fafc;" title="Titanium" onclick="changeCardColor('${item.id}', 'grayscale(1) brightness(1.2)')"></span>
        </div>

        <div class="card-footer-row">
          <span class="card-price">$${item.price.toFixed(2)}</span>
          <button class="btn-card-add-bag" onclick="addCatalogItemToBag('${item.id}')">+ Add to Bag</button>
        </div>
      </div>
    </div>
  `).join('');
}

window.filterCategory = function(cat) {
  currentCatalogCategory = cat;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === cat);
  });
  renderCatalog();
};

window.handleCatalogFilter = function() {
  const input = document.getElementById('catalogSearchInput');
  if (input) currentSearchQuery = input.value;
  renderCatalog();
};

window.handleCatalogSort = function() {
  const select = document.getElementById('catalogSortSelect');
  if (select) currentCatalogSort = select.value;
  renderCatalog();
};

window.changeCardColor = function(prodId, filterStyle) {
  const img = document.getElementById(`img-${prodId}`);
  if (img) img.style.filter = filterStyle;
};

window.addCatalogItemToBag = function(prodId) {
  const product = CATALOG_PRODUCTS.find(p => p.id === prodId);
  if (!product) return;

  cartItems.push({
    name: product.name,
    price: product.price.toFixed(2),
    rawPrice: product.price,
    size: activeSize,
    colorKey: 'obsidian'
  });

  updateCartUI();
  showToast(`Added ${product.name} (${activeSize}) to bag!`);
  openCart();
};

// =========================================================
// QUICK VIEW MODAL
// =========================================================
const quickViewModal = document.getElementById('quickViewModal');
const qvTitle = document.getElementById('qvTitle');
const qvContent = document.getElementById('qvContent');

window.openQuickView = function(prodId) {
  const product = CATALOG_PRODUCTS.find(p => p.id === prodId);
  if (!product || !quickViewModal || !qvContent) return;

  qvTitle.textContent = product.name;
  qvContent.innerHTML = `
    <div class="qv-img-box">
      <img src="${getFramePath(product.imgFrame)}" alt="${product.name}" style="filter: ${product.filter}">
    </div>
    <div class="qv-details">
      <h4>${product.name}</h4>
      <div class="qv-price">$${product.price.toFixed(2)} USD</div>
      <p class="qv-desc">${product.desc}</p>
      
      <div style="margin-bottom: 1.2rem;">
        <label style="font-size: 0.78rem; font-weight: 700; display: block; margin-bottom: 0.4rem;">Select Size:</label>
        <div class="size-grid" style="grid-template-columns: repeat(6, 1fr);">
          <button class="size-btn active">US 9.0</button>
          <button class="size-btn">US 9.5</button>
          <button class="size-btn">US 10.0</button>
          <button class="size-btn">US 10.5</button>
          <button class="size-btn">US 11.0</button>
          <button class="size-btn">US 12.0</button>
        </div>
      </div>

      <button class="btn-qv-add" onclick="addCatalogItemToBag('${product.id}'); closeQuickView();">Add to Shopping Bag — $${product.price.toFixed(2)}</button>
    </div>
  `;

  quickViewModal.classList.add('open');
};

window.closeQuickView = function() {
  if (quickViewModal) quickViewModal.classList.remove('open');
};

if (quickViewModal) {
  quickViewModal.addEventListener('click', (e) => {
    if (e.target === quickViewModal) closeQuickView();
  });
}

// =========================================================
// STUDIO STOREFRONT CONFIGURATOR
// =========================================================
window.setStudioAngle = function(frameIndex) {
  const studioMainImg = document.getElementById('studioMainImg');
  if (studioMainImg) {
    studioMainImg.src = getFramePath(frameIndex);
  }

  document.querySelectorAll('.angle-btn').forEach(btn => {
    const fnStr = btn.getAttribute('onclick') || '';
    btn.classList.toggle('active', fnStr.includes(`(${frameIndex})`));
  });
};

window.selectColor = function(colorKey) {
  if (!COLORWAYS[colorKey]) return;
  activeColorKey = colorKey;
  const data = COLORWAYS[colorKey];

  document.querySelectorAll('.color-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === colorKey);
  });

  const selectedColorName = document.getElementById('selectedColorName');
  const currentColorLabel = document.getElementById('currentColorLabel');
  const productPrice = document.getElementById('productPrice');
  const btnPriceVal = document.getElementById('btnPriceVal');

  if (selectedColorName) selectedColorName.textContent = data.name;
  if (currentColorLabel) currentColorLabel.textContent = data.label;
  if (productPrice) productPrice.textContent = `$${data.price}`;
  if (btnPriceVal) btnPriceVal.textContent = data.price;

  const studioMainImg = document.getElementById('studioMainImg');
  if (studioMainImg) {
    studioMainImg.style.filter = data.filter;
  }

  document.querySelectorAll('.lookbook-img-box img').forEach(img => {
    img.style.filter = data.filter;
  });

  renderFrame(currentFrameIndex);
};

document.querySelectorAll('.color-pill-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectColor(btn.dataset.color);
  });
});

document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSize = btn.textContent.trim();
  });
});

// =========================================================
// SHOPPING BAG & CHECKOUT ENGINE
// =========================================================
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartBackdrop = document.getElementById('cartBackdrop');
const addToBagBtn = document.getElementById('addToBagBtn');
const cartCount = document.getElementById('cartCount');
const cartDrawerCount = document.getElementById('cartDrawerCount');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

function openCart() {
  if (cartDrawer) cartDrawer.classList.add('open');
}

function closeCart() {
  if (cartDrawer) cartDrawer.classList.remove('open');
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

function showToast(msg) {
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function updateCartUI() {
  if (cartCount) cartCount.textContent = cartItems.length;
  if (cartDrawerCount) cartDrawerCount.textContent = cartItems.length;

  if (!cartItemsList) return;

  if (cartItems.length === 0) {
    cartItemsList.innerHTML = `<div class="empty-cart-msg">Your shopping bag is currently empty.</div>`;
    if (cartTotalPrice) cartTotalPrice.textContent = '$0.00';
    return;
  }

  let total = 0;
  cartItemsList.innerHTML = cartItems.map((item, index) => {
    total += item.rawPrice;
    return `
      <div class="cart-item-row">
        <img src="${getFramePath(1)}" alt="${item.name}" style="filter: ${COLORWAYS[item.colorKey]?.filter || 'none'}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>Size: ${item.size} • Color: ${item.colorKey.toUpperCase()}</p>
          <strong>$${item.price}</strong>
        </div>
        <button class="remove-item-btn" onclick="removeCartItem(${index})" aria-label="Remove">&times;</button>
      </div>
    `;
  }).join('');

  if (appliedDiscount > 0) {
    const discounted = Math.round(total * (1 - appliedDiscount / 100));
    if (cartTotalPrice) cartTotalPrice.innerHTML = `<span style="text-decoration: line-through; color: #94a3b8; font-size: 0.85rem; margin-right: 6px;">$${total}.00</span> $${discounted}.00`;
  } else {
    if (cartTotalPrice) cartTotalPrice.textContent = `$${total}.00`;
  }
}

window.removeCartItem = function(index) {
  cartItems.splice(index, 1);
  updateCartUI();
};

if (addToBagBtn) {
  addToBagBtn.addEventListener('click', () => {
    cartItems.push({
      name: COLORWAYS[activeColorKey].name,
      price: COLORWAYS[activeColorKey].price,
      rawPrice: COLORWAYS[activeColorKey].rawPrice,
      size: activeSize,
      colorKey: activeColorKey
    });

    updateCartUI();
    showToast(`Added ${COLORWAYS[activeColorKey].name} (${activeSize}) to bag!`);
    openCart();
  });
}

window.applyPromo = function() {
  const input = document.getElementById('promoCodeInput');
  if (!input) return;
  const val = input.value.trim().toUpperCase();
  if (val === 'LAMA10' || val === 'AERO10' || val === 'VIP2026') {
    appliedDiscount = 10;
    showToast('✓ 10% ARCHIVE PROMO APPLIED!');
    updateCartUI();
  } else if (val) {
    showToast('Invalid promo code. Try "AERO10"');
  }
};

window.handleCheckout = function() {
  if (cartItems.length === 0) {
    showToast('Your shopping bag is empty.');
    return;
  }
  showToast('✓ SECURE ENCRYPTED CHECKOUT INITIATING...');
};

window.handleExpressCheckout = function() {
  cartItems.push({
    name: COLORWAYS[activeColorKey].name,
    price: COLORWAYS[activeColorKey].price,
    rawPrice: COLORWAYS[activeColorKey].rawPrice,
    size: activeSize,
    colorKey: activeColorKey
  });
  updateCartUI();
  showToast('✓ APPLE PAY EXPRESS INITIATING...');
};

// =========================================================
// MODALS (SIZE CHART & REVIEWS)
// =========================================================
const sizeModal = document.getElementById('sizeModal');
const openSizeChartBtn = document.getElementById('openSizeChart');

window.openSizeModal = function() {
  if (sizeModal) sizeModal.classList.add('open');
};

window.closeSizeModal = function() {
  if (sizeModal) sizeModal.classList.remove('open');
};

if (openSizeChartBtn) openSizeChartBtn.addEventListener('click', openSizeModal);
if (sizeModal) {
  sizeModal.addEventListener('click', (e) => {
    if (e.target === sizeModal) closeSizeModal();
  });
}

window.openReviewToast = function() {
  showToast('Review system open for verified batch owners.');
};

window.handleVipSubscribe = function() {
  const email = document.getElementById('vipEmail').value;
  if (!email) return;
  document.getElementById('vipSuccess').style.display = 'block';
  document.querySelector('.vip-form-row').style.display = 'none';
  showToast('✓ VIP Access Key Dispatched!');
};

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  setupCanvasSize();
  preloadFrames();
  renderCatalog();
});
