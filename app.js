// --- DATA STORES ---
const VENDORS = [
  {
    id: "v1",
    businessName: "Tiana Stitches",
    bio: "Master of African Luxury Bespoke, Agbada & Elegant Corset Asoebi.",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    instagram: "tiana_stitches",
    whatsapp: "2348150338188",
    tiktok: "tianastitches_official",
    bankName: "Guaranty Trust Bank (GTB)",
    accountNumber: "0123456789",
    accountName: "Tiana Stitches Enterprise",
    instructions: "50% commitment fee required before fabric cutting begins."
  }
];

const CATALOG = [
  {
    id: "d1",
    title: "Royal Crimson Agbada Set",
    category: "Bespoke",
    gender: "Male",
    price: 180000,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    desc: "Heavy hand-embroidered 3-piece Agbada set made with raw silk."
  },
  {
    id: "d2",
    title: "Emerald Corset Asoebi Gown",
    category: "Bespoke",
    gender: "Female",
    price: 150000,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
    desc: "Structured boned corset gown with beaded lace overlay."
  }
];

let trackingStage = 2; // Default to 'Sewing in Assembly'

// --- TAB SWITCHER ---
function switchTab(tabName) {
  const container = document.getElementById("main-content");
  
  // Update Nav highlighting
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("border-amber-500", "text-amber-400");
    btn.classList.add("border-transparent", "text-slate-300");
  });
  
  const activeBtn = document.getElementById(`nav-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.add("border-amber-500", "text-amber-400");
    activeBtn.classList.remove("border-transparent", "text-slate-300");
  }

  // Render Views
  if (tabName === "catalog") renderCatalog(container);
  if (tabName === "tracker") renderTracker(container);
  if (tabName === "measurements") renderMeasurements(container);
  if (tabName === "apprentice") renderApprentice(container);
  if (tabName === "vendor") renderVendorProfile(container);
}

// --- VIEW RENDERERS ---
function renderCatalog(container) {
  container.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Explore Nigerian Styles & Wardrobe</h1>
      <p class="text-slate-500 text-sm">Browse bespoke designs, ready-to-wear, and pre-owned closets.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      ${CATALOG.map(item => `
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm card-hover">
          <img src="${item.image}" class="w-full h-64 object-cover" />
          <div class="p-4">
            <span class="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 rounded-full">${item.category}</span>
            <h3 class="font-bold text-slate-900 mt-2 text-base">${item.title}</h3>
            <p class="text-xs text-slate-500 mt-1">${item.desc}</p>
            <div class="mt-3 pt-3 border-t flex justify-between items-center">
              <span class="font-bold text-slate-900">₦${item.price.toLocaleString()}</span>
            </div>
            <button onclick="payWithPaystack(${item.price})" class="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold text-xs">
              Pay Securely (Paystack)
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTracker(container) {
  const stages = [
    "Fabric Received & Inspected",
    "Cutting & Pattern Design",
    "Sewing & Assembly",
    "Quality Check & Fitting",
    "Ready for Pickup / Out for Delivery"
  ];

  container.innerHTML = `
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200">
      <h2 class="text-xl font-bold text-slate-900 mb-4">Fabric Development Progress</h2>
      <div class="space-y-4">
        ${stages.map((stage, idx) => `
          <div class="flex items-center gap-4">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx <= trackingStage ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}">
              ${idx <= trackingStage ? '✓' : idx + 1}
            </div>
            <span class="text-sm font-semibold ${idx === trackingStage ? 'text-amber-800 font-bold' : 'text-slate-700'}">${stage}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderMeasurements(container) {
  container.innerHTML = `
    <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200">
      <h2 class="text-xl font-bold mb-4">Saved Body Measurements</h2>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-xs font-bold">Chest (Inches)</label><input type="text" value="42" class="w-full border p-2 rounded mt-1 text-sm"/></div>
        <div><label class="text-xs font-bold">Waist (Inches)</label><input type="text" value="34" class="w-full border p-2 rounded mt-1 text-sm"/></div>
        <div><label class="text-xs font-bold">Shoulder (Inches)</label><input type="text" value="18.5" class="w-full border p-2 rounded mt-1 text-sm"/></div>
        <div><label class="text-xs font-bold">Length (Inches)</label><input type="text" value="58" class="w-full border p-2 rounded mt-1 text-sm"/></div>
      </div>
      <button onclick="alert('Measurements Saved!')" class="mt-6 w-full bg-slate-900 text-white py-2 rounded font-bold text-sm">Save Profile</button>
    </div>
  `;
}

function renderApprentice(container) {
  container.innerHTML = `
    <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200">
      <h2 class="text-xl font-bold mb-2">Apprentice Registration</h2>
      <p class="text-xs text-slate-500 mb-4">Learn fashion designing directly from master tailors.</p>
      <form onsubmit="event.preventDefault(); alert('Registration Submitted!');" class="space-y-3">
        <input type="text" placeholder="Full Name" required class="w-full border p-2 rounded text-sm"/>
        <input type="email" placeholder="Email Address" required class="w-full border p-2 rounded text-sm"/>
        <input type="tel" placeholder="Phone Number" required class="w-full border p-2 rounded text-sm"/>
        <button type="submit" class="w-full bg-amber-600 text-white py-2 rounded font-bold text-sm">Submit Application</button>
      </form>
    </div>
  `;
}

function renderVendorProfile(container) {
  const v = VENDORS[0];
  container.innerHTML = `
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200">
      <h1 class="text-2xl font-bold">${v.businessName}</h1>
      <p class="text-sm text-slate-600 mt-1">${v.bio}</p>
      
      <div class="flex gap-2 mt-4">
        <a href="https://instagram.com/${v.instagram}" target="_blank" class="px-3 py-1.5 bg-pink-600 text-white rounded text-xs font-bold">Instagram</a>
        <a href="https://wa.me/${v.whatsapp}" target="_blank" class="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold">WhatsApp Chat</a>
      </div>

      <div class="mt-6 bg-amber-50 p-4 rounded-xl border border-amber-200">
        <h4 class="font-bold text-sm text-amber-900">Bank Payment Details:</h4>
        <p class="text-xs text-amber-800 mt-1">${v.bankName} | ${v.accountNumber} (${v.accountName})</p>
      </div>
    </div>
  `;
}

// --- PAYSTACK CHECKOUT ---
function payWithPaystack(amount) {
  const handler = PaystackPop.setup({
    key: 'pk_test_sample_key_stitchluxe',
    email: 'client@stitchluxe.com',
    amount: amount * 100,
    currency: 'NGN',
    callback: function(response) {
      alert('Payment successful! Ref: ' + response.reference);
    }
  });
  handler.openIframe();
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
  switchTab("catalog");
});