/* ==========================================
   STITCHLUXE APPLICATION ENGINE (FULL SCRIPT)
   ========================================== */

// --- GLOBAL STATE ---
let activeTab = "catalog";
let currentRole = "client"; // 'client' or 'seller'
let loggedInUser = JSON.parse(localStorage.getItem("sl_active_user") || "null");
let authMode = "login"; // 'login' or 'signup'
let authSelectedRole = "client"; // 'client' or 'seller'

// Mock Data Store
let catalogItems = [
  { id: 101, title: "Royal Agbada Set", category: "Bespoke Native", price: 45000, vendor: "Royal Stitches", img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&auto=format&fit=crop&q=60" },
  { id: 102, title: "Luxury Silk Senator Suit", category: "Bespoke Native", price: 38000, vendor: "Luxe Thread Co.", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60" },
  { id: 103, title: "Hand-Tailored Evening Gown", category: "Women's Bespoke", price: 65000, vendor: "Madame Fashion", img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format&fit=crop&q=60" }
];

let resaleItems = [
  { id: 201, title: "Pre-Owned Designer Blazer", size: "L", price: 15000, seller: "Adebayo S.", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60" },
  { id: 202, title: "Vintage Ankara Corset Top", size: "M", price: 8000, seller: "Chioma K.", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60" }
];

let vendors = [
  { id: 301, name: "Royal Stitches", specialty: "Men's Native & Agbada", rating: "4.9 ★", location: "Lagos, NG" },
  { id: 302, name: "Luxe Thread Co.", specialty: "Corporate & Senator Suits", rating: "4.8 ★", location: "Abuja, NG" }
];

let measurements = JSON.parse(localStorage.getItem("sl_measurements") || "{}");

// --- 1. MANDATORY AUTHENTICATION ENGINE ---
function initAuthGuard() {
  const authScreen = document.getElementById("auth-screen");
  const appWorkspace = document.getElementById("app-workspace");
  const userName = document.getElementById("user-display-name");

  if (loggedInUser) {
    if (authScreen) authScreen.classList.add("hidden");
    if (appWorkspace) appWorkspace.classList.remove("hidden");
    if (userName) userName.innerText = loggedInUser.name.split(" ")[0] + ` (${loggedInUser.role})`;
    switchTab(activeTab);
  } else {
    if (authScreen) authScreen.classList.remove("hidden");
    if (appWorkspace) appWorkspace.classList.add("hidden");
  }
}

function setAuthMode(mode) {
  authMode = mode;
  const loginBtn = document.getElementById("mode-btn-login");
  const signupBtn = document.getElementById("mode-btn-signup");
  const fullnameGroup = document.getElementById("fullname-group");
  const submitBtn = document.getElementById("auth-submit-btn");

  if (mode === "signup") {
    signupBtn.className = "flex-1 py-2 rounded-lg bg-white text-slate-900 shadow-sm";
    loginBtn.className = "flex-1 py-2 rounded-lg text-slate-500";
    if (fullnameGroup) fullnameGroup.classList.remove("hidden");
    if (submitBtn) submitBtn.innerText = "Create Account & Access App";
  } else {
    loginBtn.className = "flex-1 py-2 rounded-lg bg-white text-slate-900 shadow-sm";
    signupBtn.className = "flex-1 py-2 rounded-lg text-slate-500";
    if (fullnameGroup) fullnameGroup.classList.add("hidden");
    if (submitBtn) submitBtn.innerText = "Sign In";
  }
}

function switchAuthRole(role) {
  authSelectedRole = role;
  const clientBtn = document.getElementById("auth-tab-client");
  const sellerBtn = document.getElementById("auth-tab-seller");
  const bizGroup = document.getElementById("seller-business-name-group");

  if (role === "client") {
    clientBtn.className = "flex-1 py-2 rounded-lg bg-slate-800 text-white shadow-sm";
    sellerBtn.className = "flex-1 py-2 rounded-lg text-slate-500";
    if (bizGroup) bizGroup.classList.add("hidden");
  } else {
    sellerBtn.className = "flex-1 py-2 rounded-lg bg-slate-800 text-white shadow-sm";
    clientBtn.className = "flex-1 py-2 rounded-lg text-slate-500";
    if (bizGroup) bizGroup.classList.remove("hidden");
  }
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const contact = document.getElementById("auth-contact").value;
  const fullnameInput = document.getElementById("auth-fullname");
  const name = (fullnameInput && fullnameInput.value) ? fullnameInput.value : contact.split("@")[0];
  const businessInput = document.getElementById("auth-business");
  const business = businessInput ? businessInput.value : "";

  loggedInUser = {
    id: "user_" + Date.now(),
    name: name,
    contact: contact,
    role: authSelectedRole,
    businessName: authSelectedRole === "seller" ? business : null
  };

  localStorage.setItem("sl_active_user", JSON.stringify(loggedInUser));
  initAuthGuard();
}

function handleGoogleAuth() {
  loggedInUser = {
    id: "user_google_" + Date.now(),
    name: "Google User",
    contact: "user@gmail.com",
    role: "client",
    businessName: null
  };
  localStorage.setItem("sl_active_user", JSON.stringify(loggedInUser));
  initAuthGuard();
}

function logoutUser() {
  localStorage.removeItem("sl_active_user");
  loggedInUser = null;
  initAuthGuard();
}

// --- 2. TAB ROUTING & NAVIGATION ---
function switchTab(tab) {
  activeTab = tab;
  
  // Highlight active nav button
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.className = "nav-btn py-1.5 px-3 rounded-lg font-medium text-slate-300 hover:text-white";
  });
  
  const currentNav = document.getElementById(`nav-${tab}`);
  if (currentNav) {
    currentNav.className = "nav-btn py-1.5 px-3 rounded-lg font-medium bg-amber-500 text-slate-900";
  }

  const container = document.getElementById("main-content");
  if (!container) return;

  if (tab === "catalog") renderCatalog(container);
  else if (tab === "resale") renderResale(container);
  else if (tab === "sellers") renderSellers(container);
  else if (tab === "internship") renderInternship(container);
  else if (tab === "tracker") renderTracker(container);
  else if (tab === "measurements") renderMeasurements(container);
}

// --- 3. VIEW RENDERERS ---

// Bespoke Catalog with Pinterest Banner
function renderCatalog(container) {
  let html = `
    <!-- PINTEREST INSPIRATION BANNER -->
    <div class="bg-gradient-to-r from-rose-600 to-red-700 text-white p-5 rounded-2xl mb-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-white text-rose-600 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 shadow">
          <i class="fa-brands fa-pinterest"></i>
        </div>
        <div>
          <h3 class="font-bold text-base">Looking for Tailoring & Outfit Inspiration?</h3>
          <p class="text-xs text-rose-100">Explore millions of trending clothing styles, native wear, and dress designs on Pinterest.</p>
        </div>
      </div>
      <a href="https://www.pinterest.com/search/pins/?q=african%20native%20sewing%20designs%20fashion%20styles" target="_blank" rel="noopener noreferrer" class="bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs px-4 py-2.5 rounded-xl whitespace-nowrap transition shadow flex items-center gap-2">
        <i class="fa-brands fa-pinterest"></i> Explore Design Trends <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
      </a>
    </div>

    <!-- CATALOG ITEMS GRID -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-slate-900">Bespoke Tailoring Catalog</h2>
      <span class="text-xs text-slate-500">${catalogItems.length} Designs Available</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  `;

  catalogItems.forEach(item => {
    html += `
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
        <img src="${item.img}" class="w-full h-48 object-cover" alt="${item.title}"/>
        <div class="p-4">
          <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase">${item.category}</span>
          <h3 class="font-bold text-slate-900 text-base mt-1">${item.title}</h3>
          <p class="text-xs text-slate-500">Tailored by: ${item.vendor}</p>
          <div class="flex justify-between items-center mt-4">
            <span class="font-black text-slate-900 text-lg">₦${item.price.toLocaleString()}</span>
            <button onclick="openPaymentModal('${item.title}', ${item.price})" class="bg-slate-900 text-amber-400 font-bold text-xs px-3 py-2 rounded-xl hover:bg-slate-800 transition">
              Order Bespoke
            </button>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

// Resale Marketplace
function renderResale(container) {
  let html = `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-slate-900">Wardrobe Resale Hub</h2>
      <button onclick="alert('Sell item feature: Upload your outfit photos in your Vendor Portal')" class="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg">+ List Pre-Owned Item</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  `;
  resaleItems.forEach(item => {
    html += `
      <div class="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4 shadow-sm">
        <img src="${item.img}" class="w-28 h-28 object-cover rounded-xl shrink-0" alt="${item.title}"/>
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <span class="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Size: ${item.size}</span>
            <h3 class="font-bold text-slate-900 text-sm mt-1">${item.title}</h3>
            <p class="text-xs text-slate-500">Seller: ${item.seller}</p>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-black text-slate-900">₦${item.price.toLocaleString()}</span>
            <button onclick="openPaymentModal('${item.title}', ${item.price})" class="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition">Buy Now</button>
          </div>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

// Designers & Sellers Directory
function renderSellers(container) {
  let html = `<h2 class="text-xl font-bold text-slate-900 mb-4">Verified Fashion Designers & Houses</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
  vendors.forEach(v => {
    html += `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-900">${v.name}</h3>
          <p class="text-xs text-slate-500">${v.specialty} • ${v.location}</p>
          <span class="text-xs text-amber-500 font-bold">${v.rating}</span>
        </div>
        <button onclick="switchTab('catalog')" class="text-xs bg-slate-100 font-bold px-3 py-2 rounded-xl hover:bg-slate-200">View Outfits</button>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

// Apprentice Academy
function renderInternship(container) {
  container.innerHTML = `
    <div class="bg-slate-900 text-white p-6 rounded-2xl mb-6">
      <h2 class="text-xl font-black text-amber-400">StitchLuxe Apprentice Academy</h2>
      <p class="text-xs text-slate-300 mt-1">Connect with master tailors in Lagos and Abuja for structured fashion apprenticeship programs.</p>
    </div>
    <div class="bg-white p-6 rounded-2xl border border-slate-200 text-center">
      <i class="fa-solid fa-graduation-cap text-4xl text-amber-500 mb-2"></i>
      <h3 class="font-bold text-slate-900">Applications Open for Q4 Cohort</h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto my-2">Learn bespoke pattern drafting, sewing techniques, and digital fashion management directly under top designers.</p>
      <button onclick="alert('Academy Application Form Sent to your email/phone!')" class="mt-2 bg-slate-900 text-amber-400 font-bold text-xs px-4 py-2 rounded-xl">Apply for Apprenticeship</button>
    </div>
  `;
}

// Order Tracker
function renderTracker(container) {
  container.innerHTML = `
    <h2 class="text-xl font-bold text-slate-900 mb-4">Live Bespoke Order Tracker</h2>
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div class="flex justify-between items-center border-b pb-3">
        <div>
          <span class="text-xs font-bold text-amber-600">ORDER #SL-8842</span>
          <h3 class="font-bold text-slate-900 text-sm">Royal Agbada Set</h3>
        </div>
        <span class="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">In Stitching</span>
      </div>
      <div class="space-y-2 text-xs">
        <div class="flex items-center gap-2 text-emerald-600 font-bold"><i class="fa-solid fa-circle-check"></i> Fabric Sourced & Cut</div>
        <div class="flex items-center gap-2 text-amber-600 font-bold"><i class="fa-solid fa-spinner animate-spin"></i> Tailor Stitching in Progress</div>
        <div class="flex items-center gap-2 text-slate-400"><i class="fa-solid fa-circle"></i> Quality Control & Pressing</div>
        <div class="flex items-center gap-2 text-slate-400"><i class="fa-solid fa-circle"></i> Dispatch / Delivery</div>
      </div>
    </div>
  `;
}

// Measurement Vault
function renderMeasurements(container) {
  container.innerHTML = `
    <h2 class="text-xl font-bold text-slate-900 mb-2">Personal Measurement Vault</h2>
    <p class="text-xs text-slate-500 mb-4">Save your exact measurements once; share them automatically with any designer on StitchLuxe.</p>
    <form onsubmit="saveMeasurements(event)" class="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label class="font-bold text-slate-700 block mb-1">Chest/Bust (Inches)</label>
          <input type="number" id="m-chest" value="${measurements.chest || ''}" placeholder="e.g. 40" class="w-full border rounded-xl p-2.5"/>
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Waist (Inches)</label>
          <input type="number" id="m-waist" value="${measurements.waist || ''}" placeholder="e.g. 34" class="w-full border rounded-xl p-2.5"/>
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Shoulder (Inches)</label>
          <input type="number" id="m-shoulder" value="${measurements.shoulder || ''}" placeholder="e.g. 18" class="w-full border rounded-xl p-2.5"/>
        </div>
      </div>
      <button type="submit" class="bg-slate-900 text-amber-400 font-bold text-xs px-4 py-2.5 rounded-xl">Save Measurements</button>
    </form>
  `;
}

function saveMeasurements(e) {
  e.preventDefault();
  measurements = {
    chest: document.getElementById("m-chest").value,
    waist: document.getElementById("m-waist").value,
    shoulder: document.getElementById("m-shoulder").value
  };
  localStorage.setItem("sl_measurements", JSON.stringify(measurements));
  alert("Measurements saved successfully!");
}

// --- 4. PAYMENT MODAL CONTROLS ---
function openPaymentModal(title, price) {
  const modal = document.getElementById("payment-modal");
  const body = document.getElementById("payment-modal-body");
  body.innerHTML = `
    <h3 class="font-bold text-slate-900 text-lg mb-1">Checkout</h3>
    <p class="text-xs text-slate-500 mb-4">${title}</p>
    <div class="bg-slate-50 p-3 rounded-xl mb-4 flex justify-between text-xs font-bold">
      <span>Total Amount:</span>
      <span class="text-amber-600">₦${price.toLocaleString()}</span>
    </div>
    <button onclick="alert('Payment processing mockup complete!'); closePaymentModal();" class="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs hover:bg-emerald-700 transition">
      Pay with Paystack / Card
    </button>
  `;
  modal.classList.remove("hidden");
}

function closePaymentModal() {
  document.getElementById("payment-modal").classList.add("hidden");
}

function toggleVendorDashboard() {
  alert("Vendor Dashboard toggled! You can now post new catalog items or view incoming customer orders.");
}

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  initAuthGuard();
});
