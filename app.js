// --- STITCHLUXE MULTI-VENDOR DATABASE ---
let VENDORS = [
  {
    id: "vendor_tiana",
    businessName: "Tiana Stitches",
    owner: "Tiana Dele",
    bio: "Bespoke Nigerian Couture, Luxury Agbada & Corset Asoebi.",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    socials: {
      whatsapp: "2348150338188",
      instagram: "tianastitches_official",
      website: "https://tianastitches.com"
    },
    acceptingInterns: true,
    internshipProgram: "6-Month Masterclass in Corsetry & Male Agbada",
    internshipFee: 250000,
    paymentDetails: {
      bankName: "Guaranty Trust Bank (GTB)",
      accountNumber: "0123456789",
      accountName: "Tiana Stitches Enterprise",
      paystackEnabled: true
    }
  },
  {
    id: "vendor_kaftan",
    businessName: "Kaftan & Threads Co.",
    owner: "Ibrahim Musa",
    bio: "Premium Senegalese Kaftans, Senator Suits & Ready-To-Wear.",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    socials: {
      whatsapp: "2348012345678",
      instagram: "kaftan_threads_ng",
      tiktok: "kaftan_threads"
    },
    acceptingInterns: true,
    internshipProgram: "3-Month Industrial Senator Suit Cutting",
    internshipFee: 150000,
    paymentDetails: {
      bankName: "Zenith Bank",
      accountNumber: "9876543210",
      accountName: "Kaftan Threads Ltd",
      paystackEnabled: false
    }
  }
];

let CATALOG = [
  {
    id: "des_1",
    vendorId: "vendor_tiana",
    title: "Royal Crimson Hand-Embroidered Agbada",
    category: "Agbada",
    gender: "Men",
    type: "bespoke",
    price: 180000,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    desc: "Heavy hand-embroidered 3-piece traditional Agbada set made from premium Aso-Oke."
  },
  {
    id: "des_2",
    vendorId: "vendor_kaftan",
    title: "Minimalist Executive Senator Suit - Navy",
    category: "Senator",
    gender: "Men",
    type: "bespoke",
    price: 65000,
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80",
    desc: "Precision-cut wool blend Senator suit with hidden front zipper."
  },
  {
    id: "des_3",
    vendorId: "vendor_tiana",
    title: "Luxury Emerald Corset Asoebi Dress",
    category: "Corset Asoebi",
    gender: "Women",
    type: "bespoke",
    price: 220000,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
    desc: "Structured steel-boned corset with hand-beaded lace embellishments."
  },
  // WARDROBE RESALE / PRE-LOVED ITEMS
  {
    id: "resale_1",
    vendorId: "vendor_kaftan",
    title: "Pre-Loved Vintage Cashmere Kaftan (Size L)",
    category: "Pre-Loved",
    gender: "Men",
    type: "resale",
    price: 32000,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    desc: "Gently worn twice for photoshoot. Excellent 9/10 condition."
  },
  {
    id: "resale_2",
    vendorId: "vendor_tiana",
    title: "Boutique Sample Sale: Velvet Dinner Jacket",
    category: "Ready-To-Wear",
    gender: "Women",
    type: "resale",
    price: 45000,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    desc: "Original brand sample sale piece. Size 10 UK."
  }
];

// MOCK ORDERS FOR LIVE TRACKER
let ORDERS = [
  {
    orderId: "SL-8842",
    clientName: "David O.",
    vendorId: "vendor_tiana",
    itemTitle: "Royal Crimson Agbada Set",
    currentStage: 3, // 1 to 5
    stages: ["Fabric Inspection", "Pattern Drafting", "Sewing & Assembly", "Fitting & QC", "Ready for Pickup"]
  }
];

// LOCAL STORAGE STATE
let currentRole = "client"; // "client" or "vendor"
let userMeasurements = JSON.parse(localStorage.getItem("sl_measurements") || "{}");
let internshipApps = JSON.parse(localStorage.getItem("sl_internships") || "[]");

// --- NAVIGATION LOGIC ---
function switchTab(tabName) {
  const container = document.getElementById("main-content");
  if (!container) return;

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("bg-amber-500", "text-slate-900");
    btn.classList.add("text-slate-300");
  });
  
  const activeBtn = document.getElementById(`nav-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.remove("text-slate-300");
    activeBtn.classList.add("bg-amber-500", "text-slate-900");
  }

  if (tabName === "catalog") renderCatalog(container, "bespoke");
  if (tabName === "resale") renderCatalog(container, "resale");
  if (tabName === "sellers") renderSellers(container);
  if (tabName === "internship") renderInternshipPortal(container);
  if (tabName === "tracker") renderTracker(container);
  if (tabName === "measurements") renderMeasurements(container);
}

// --- 1. BESPOKE CATALOG & WARDROBE RESALE VIEWS ---
function renderCatalog(container, viewType) {
  const items = CATALOG.filter(item => viewType === "resale" ? item.type === "resale" : item.type !== "resale");
  
  container.innerHTML = `
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">${viewType === "resale" ? "Wardrobe Resale & Closet Clearance" : "Bespoke & RTW Showcase"}</h1>
        <p class="text-slate-500 text-sm">${viewType === "resale" ? "Buy pre-loved luxury pieces, vintage items & sample sales directly." : "Browse 250+ bespoke styles directly from independent Nigerian fashion houses."}</p>
      </div>

      <!-- SEARCH & FILTER BAR -->
      <div class="flex flex-wrap gap-2">
        <input type="text" id="catalog-search" oninput="filterCatalog('${viewType}')" placeholder="Search styles..." class="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500" />
        <select id="category-filter" onchange="filterCatalog('${viewType}')" class="border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white">
          <option value="ALL">All Categories</option>
          <option value="Agbada">Agbada</option>
          <option value="Senator">Senator</option>
          <option value="Corset Asoebi">Corset Asoebi</option>
          <option value="Ready-To-Wear">Ready-To-Wear</option>
          <option value="Pre-Loved">Pre-Loved</option>
        </select>
      </div>
    </div>

    <div id="catalog-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      ${renderCatalogItems(items)}
    </div>
  `;
}

function renderCatalogItems(items) {
  if (items.length === 0) {
    return `<div class="col-span-full text-center py-12 text-slate-400">No garments match your filter criteria.</div>`;
  }

  return items.map(item => {
    const vendor = VENDORS.find(v => v.id === item.vendorId);
    return `
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
        <div>
          <div class="relative">
            <img src="${item.image}" class="w-full h-56 object-cover" />
            <span class="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${item.type === 'resale' ? 'bg-purple-600 text-white' : 'bg-slate-900/80 backdrop-blur text-amber-400'}">
              ${item.category}
            </span>
          </div>
          <div class="p-4">
            <span class="text-xs text-amber-600 font-bold block">${vendor ? vendor.businessName : 'Verified Seller'}</span>
            <h3 class="font-bold text-slate-900 mt-1 text-base leading-snug">${item.title}</h3>
            <p class="text-xs text-slate-500 mt-1">${item.desc}</p>
            <p class="font-extrabold text-xl text-slate-900 mt-3">₦${item.price.toLocaleString()}</p>
          </div>
        </div>

        <div class="p-4 pt-0 border-t border-slate-100 mt-2 flex gap-2">
          <button onclick="openPaymentModal('${item.id}')" class="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded-xl text-xs transition">
            Buy / Order
          </button>
          <a href="https://wa.me/${vendor ? vendor.socials.whatsapp : ''}?text=Hello%20${encodeURIComponent(vendor.businessName)},%20I%20am%20interested%20in%20${encodeURIComponent(item.title)}." 
             target="_blank" class="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center">
            <i class="fa-brands fa-whatsapp text-sm"></i>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

function filterCatalog(viewType) {
  const search = document.getElementById("catalog-search").value.toLowerCase();
  const category = document.getElementById("category-filter").value;

  const filtered = CATALOG.filter(item => {
    const isCorrectType = viewType === "resale" ? item.type === "resale" : item.type !== "resale";
    const matchesSearch = item.title.toLowerCase().includes(search) || item.desc.toLowerCase().includes(search);
    const matchesCategory = category === "ALL" || item.category === category;
    return isCorrectType && matchesSearch && matchesCategory;
  });

  document.getElementById("catalog-grid").innerHTML = renderCatalogItems(filtered);
}

// --- 2. MULTI-VENDOR PROFILES & SOCIAL HUB ---
function renderSellers(container) {
  container.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Verified Designers & Wardrobe Sellers</h1>
      <p class="text-slate-500 text-sm">Direct settlement channels, social portfolios, and training hubs.</p>
    </div>

    <div class="space-y-4">
      ${VENDORS.map(v => `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div class="flex items-center gap-4">
            <img src="${v.logo}" class="w-16 h-16 rounded-full object-cover border-2 border-amber-500" />
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-slate-900 text-lg">${v.businessName}</h3>
                <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Verified Store</span>
              </div>
              <p class="text-xs text-slate-500 mt-1">${v.bio}</p>
              
              <!-- 3 MULTI-SOCIAL MEDIA LINKS -->
              <div class="flex gap-3 mt-3">
                ${v.socials.whatsapp ? `
                  <a href="https://wa.me/${v.socials.whatsapp}" target="_blank" class="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold flex items-center gap-1">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                  </a>` : ''}
                ${v.socials.instagram ? `
                  <a href="https://instagram.com/${v.socials.instagram}" target="_blank" class="text-xs bg-pink-50 text-pink-700 px-2.5 py-1 rounded-lg border border-pink-200 font-bold flex items-center gap-1">
                    <i class="fa-brands fa-instagram"></i> Instagram
                  </a>` : ''}
                ${v.socials.website ? `
                  <a href="${v.socials.website}" target="_blank" class="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-bold flex items-center gap-1">
                    <i class="fa-solid fa-globe"></i> Website
                  </a>` : ''}
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button onclick="switchTab('internship')" class="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl">
              Apply to Apprentice
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// --- 3. APPRENTICE & INTERNSHIP ACADEMY PORTAL ---
function renderInternshipPortal(container) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto">
      <div class="bg-slate-900 text-white p-6 rounded-2xl mb-6 shadow-md">
        <h1 class="text-2xl font-bold">StitchLuxe Apprentice Academy</h1>
        <p class="text-slate-300 text-sm mt-1">Enroll in structured mentorship programs directly under top Nigerian bespoke master tailors.</p>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Submit Training Application</h2>
        <form onsubmit="handleInternshipSubmit(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Select Fashion House / Mentor *</label>
            <select id="intern-vendor" required class="w-full border border-slate-300 rounded-xl p-3 text-xs bg-white">
              <option value="">-- Choose Fashion House --</option>
              ${VENDORS.filter(v => v.acceptingInterns).map(v => `
                <option value="${v.id}">${v.businessName} — (${v.internshipProgram} - ₦${v.internshipFee.toLocaleString()})</option>
              `).join('')}
            </select>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input type="text" id="intern-name" placeholder="Samuel Adebayo" required class="w-full border border-slate-300 rounded-xl p-3 text-xs"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">WhatsApp Contact *</label>
              <input type="tel" id="intern-phone" placeholder="08012345678" required class="w-full border border-slate-300 rounded-xl p-3 text-xs"/>
            </div>
          </div>

          <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-3 rounded-xl text-xs transition">
            Submit Application directly to Designer
          </button>
        </form>
      </div>
    </div>
  `;
}

function handleInternshipSubmit(e) {
  e.preventDefault();
  const vendorId = document.getElementById("intern-vendor").value;
  const name = document.getElementById("intern-name").value;
  const phone = document.getElementById("intern-phone").value;
  const vendor = VENDORS.find(v => v.id === vendorId);

  if (!vendor) return;

  const msg = `Hello ${vendor.businessName}! I am submitting an Apprentice Application via StitchLuxe.\n\nName: ${name}\nPhone: ${phone}\nProgram: ${vendor.internshipProgram}`;
  window.open(`https://wa.me/${vendor.socials.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
}

// --- 4. VISUAL 5-STAGE GARMENT TRACKER ---
function renderTracker(container) {
  container.innerHTML = `
    <div class="max-w-2xl mx-auto">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <h1 class="text-2xl font-bold text-slate-900">Garment Progress Tracker</h1>
        <p class="text-slate-500 text-sm mt-1">Track the milestone execution of your bespoke order in real-time.</p>
        
        <div class="mt-4 flex gap-2">
          <input type="text" id="order-search-input" placeholder="Enter Order ID (e.g. SL-8842)" class="flex-1 border border-slate-300 rounded-xl p-3 text-xs"/>
          <button onclick="searchOrder()" class="bg-slate-900 text-white font-bold px-5 rounded-xl text-xs">Lookup</button>
        </div>
      </div>

      <div id="tracker-display-area">
        ${renderOrderProgressCard(ORDERS[0])}
      </div>
    </div>
  `;
}

function renderOrderProgressCard(order) {
  if (!order) return `<div class="p-6 bg-white rounded-2xl border text-center text-slate-400">Order ID not found.</div>`;

  return `
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div class="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
        <div>
          <span class="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full">${order.orderId}</span>
          <h3 class="font-bold text-slate-900 text-base mt-2">${order.itemTitle}</h3>
          <p class="text-xs text-slate-500">Client: ${order.clientName}</p>
        </div>
      </div>

      <!-- 5 STAGE PROGRESS BAR -->
      <div class="space-y-4">
        ${order.stages.map((stageName, index) => {
          const stepNum = index + 1;
          const isDone = stepNum <= order.currentStage;
          const isCurrent = stepNum === order.currentStage;

          return `
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}">
                ${isDone ? '<i class="fa-solid fa-check"></i>' : stepNum}
              </div>
              <div class="flex-1">
                <p class="text-xs font-bold ${isCurrent ? 'text-amber-600' : isDone ? 'text-slate-900' : 'text-slate-400'}">${stageName}</p>
                ${isCurrent ? '<span class="text-[10px] text-amber-600 font-semibold">Active Milestone Stage</span>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function searchOrder() {
  const query = document.getElementById("order-search-input").value.trim().toUpperCase();
  const found = ORDERS.find(o => o.orderId === query);
  document.getElementById("tracker-display-area").innerHTML = renderOrderProgressCard(found);
}

// --- 5. MEASUREMENT VAULT ---
function renderMeasurements(container) {
  container.innerHTML = `
    <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h1 class="text-2xl font-bold text-slate-900 mb-1">Measurement Vault</h1>
      <p class="text-slate-500 text-xs mb-6">Save your tailoring sizes locally so designers can craft your bespoke fit accurately.</p>

      <form onsubmit="saveMeasurements(event)" class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Chest / Bust (ins)</label>
          <input type="number" id="m-chest" value="${userMeasurements.chest || ''}" placeholder="40" class="w-full border rounded-xl p-2.5 text-xs"/>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Waist (ins)</label>
          <input type="number" id="m-waist" value="${userMeasurements.waist || ''}" placeholder="34" class="w-full border rounded-xl p-2.5 text-xs"/>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Shoulder (ins)</label>
          <input type="number" id="m-shoulder" value="${userMeasurements.shoulder || ''}" placeholder="18" class="w-full border rounded-xl p-2.5 text-xs"/>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Sleeve Length (ins)</label>
          <input type="number" id="m-sleeve" value="${userMeasurements.sleeve || ''}" placeholder="25" class="w-full border rounded-xl p-2.5 text-xs"/>
        </div>
        <button type="submit" class="col-span-2 bg-slate-900 text-white font-bold py-3 rounded-xl text-xs mt-2">
          Save Sizes to My Device
        </button>
      </form>
    </div>
  `;
}

function saveMeasurements(e) {
  e.preventDefault();
  userMeasurements = {
    chest: document.getElementById("m-chest").value,
    waist: document.getElementById("m-waist").value,
    shoulder: document.getElementById("m-shoulder").value,
    sleeve: document.getElementById("m-sleeve").value,
  };
  localStorage.setItem("sl_measurements", JSON.stringify(userMeasurements));
  alert("Measurements saved to Vault!");
}

// --- 6. FLEXIBLE PAYMENT MODAL (PAYSTACK + DIRECT BANK) ---
function openPaymentModal(itemId) {
  const item = CATALOG.find(i => i.id === itemId);
  const vendor = VENDORS.find(v => v.id === item.vendorId);
  const modal = document.getElementById("payment-modal");
  const modalBody = document.getElementById("payment-modal-body");

  modalBody.innerHTML = `
    <h2 class="text-lg font-bold text-slate-900 mb-1">Order Checkout</h2>
    <p class="text-xs text-slate-500 mb-4">${item.title} — ₦${item.price.toLocaleString()}</p>

    <!-- PAYSTACK BUTTON -->
    ${vendor.paymentDetails.paystackEnabled ? `
      <button onclick="alert('Redirecting to Paystack Gateway...'); closePaymentModal();" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs mb-3 flex items-center justify-center gap-2">
        <i class="fa-solid fa-credit-card"></i> Pay via Paystack (Cards/Transfer)
      </button>
    ` : ''}

    <!-- DIRECT BANK DETAILS -->
    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-4">
      <strong class="text-slate-900 block mb-2">Direct Seller Bank Account:</strong>
      <p class="text-slate-700">Bank: <strong>${vendor.paymentDetails.bankName}</strong></p>
      <p class="text-slate-700">Account No: <strong>${vendor.paymentDetails.accountNumber}</strong></p>
      <p class="text-slate-700">Account Name: <strong>${vendor.paymentDetails.accountName}</strong></p>
    </div>

    <a href="https://wa.me/${vendor.socials.whatsapp}?text=Hello%20${encodeURIComponent(vendor.businessName)},%20I%20have%20made%20a%20transfer%20of%20₦${item.price.toLocaleString()}%20for%20${encodeURIComponent(item.title)}." 
       target="_blank" class="block text-center w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs">
      Send Payment Proof on WhatsApp
    </a>
  `;

  modal.classList.remove("hidden");
}

function closePaymentModal() {
  document.getElementById("payment-modal").classList.add("hidden");
}

// --- 7. VENDOR DASHBOARD MODE TOGGLE ---
function toggleVendorDashboard() {
  currentRole = currentRole === "client" ? "vendor" : "client";
  const btnText = document.getElementById("role-toggle-text");
  
  if (currentRole === "vendor") {
    btnText.innerText = "Exit Dashboard";
    renderVendorDashboard();
  } else {
    btnText.innerText = "Vendor Portal";
    switchTab("catalog");
  }
}

function renderVendorDashboard() {
  const container = document.getElementById("main-content");
  container.innerHTML = `
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h1 class="text-2xl font-bold text-slate-900 mb-1">Vendor Dashboard</h1>
      <p class="text-slate-500 text-xs mb-6">Upload new catalog pieces or update order progress stages.</p>

      <div class="border-b border-slate-200 pb-6 mb-6">
        <h2 class="font-bold text-slate-900 text-sm mb-3">Add New Garment Listing</h2>
        <form onsubmit="addNewGarment(event)" class="space-y-3">
          <input type="text" id="new-title" placeholder="Item Title" required class="w-full border p-2.5 text-xs rounded-xl"/>
          <div class="grid grid-cols-2 gap-3">
            <input type="number" id="new-price" placeholder="Price (NGN)" required class="w-full border p-2.5 text-xs rounded-xl"/>
            <select id="new-type" class="w-full border p-2.5 text-xs rounded-xl bg-white">
              <option value="bespoke">Bespoke Collection</option>
              <option value="resale">Wardrobe Resale / Closet</option>
            </select>
          </div>
          <input type="url" id="new-image" placeholder="Image URL (Unsplash or Cloudinary)" required class="w-full border p-2.5 text-xs rounded-xl"/>
          <button type="submit" class="w-full bg-amber-500 font-bold py-2.5 rounded-xl text-xs">Publish Item</button>
        </form>
      </div>
    </div>
  `;
}

function addNewGarment(e) {
  e.preventDefault();
  const newItem = {
    id: "custom_" + Date.now(),
    vendorId: "vendor_tiana",
    title: document.getElementById("new-title").value,
    category: "Bespoke Couture",
    gender: "Unisex",
    type: document.getElementById("new-type").value,
    price: parseInt(document.getElementById("new-price").value),
    image: document.getElementById("new-image").value,
    desc: "Custom uploaded design piece."
  };

  CATALOG.unshift(newItem);
  alert("New garment published to StitchLuxe!");
  toggleVendorDashboard();
}

// INITIAL DOM LAUNCH
document.addEventListener("DOMContentLoaded", () => switchTab("catalog"));
