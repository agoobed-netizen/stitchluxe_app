
// --- DECENTRALIZED VENDOR DATABASE ---
const VENDORS = [
  {
    id: "vendor_tiana",
    businessName: "Tiana Stitches",
    bio: "Luxury Nigerian Bespoke Couture, Agbada & Corset Asoebi.",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    whatsapp: "2348150338188",
    paymentDetails: {
      bankName: "Guaranty Trust Bank (GTB)",
      accountNumber: "0123456789",
      accountName: "Tiana Stitches Enterprise",
      note: "Send 50% deposit before measurement processing."
    }
  },
  {
    id: "vendor_kaftan",
    businessName: "Kaftan & Threads Co.",
    bio: "Premium Senegalese Kaftans & Senator Suits.",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    whatsapp: "2348012345678",
    paymentDetails: {
      bankName: "Zenith Bank",
      accountNumber: "9876543210",
      accountName: "Kaftan Threads Ltd",
      note: "100% upfront payment required for instant dispatch."
    }
  }
];

const CATALOG = [
  {
    id: "d1",
    vendorId: "vendor_tiana",
    title: "Royal Crimson Agbada Set",
    category: "Bespoke Couture",
    price: 180000,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    desc: "Heavy hand-embroidered 3-piece traditional Agbada set."
  },
  {
    id: "d2",
    vendorId: "vendor_kaftan",
    title: "Minimalist Senator Suit - Navy",
    category: "Ready-to-Wear",
    price: 65000,
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80",
    desc: "Tailored luxury wool blend Senator suit."
  }
];

// --- TAB SWITCHING LOGIC ---
function switchTab(tabName) {
  const container = document.getElementById("main-content");
  if (!container) return;

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("border-amber-500", "text-amber-400");
    btn.classList.add("border-transparent", "text-slate-300");
  });
  
  const activeBtn = document.getElementById(`nav-${tabName}`);
  if (activeBtn) activeBtn.classList.add("border-amber-500", "text-amber-400");

  if (tabName === "catalog") renderCatalog(container);
  if (tabName === "sellers") renderSellers(container);
  if (tabName === "tracker") renderTracker(container);
  if (tabName === "measurements") renderMeasurements(container);
}

function renderCatalog(container) {
  container.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Multi-Seller Fashion Showcase</h1>
      <p class="text-slate-500 text-sm">Browse styles directly from independent designers across Nigeria.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      ${CATALOG.map(item => {
        const vendor = VENDORS.find(v => v.id === item.vendorId);
        return `
          <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm p-4 flex flex-col justify-between">
            <div>
              <img src="${item.image}" class="w-full h-48 object-cover rounded-lg" />
              <div class="flex justify-between items-center mt-3">
                <span class="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 rounded-full">${item.category}</span>
                <span class="text-xs text-amber-600 font-bold">${vendor.businessName}</span>
              </div>
              <h3 class="font-bold text-slate-900 mt-2 text-base">${item.title}</h3>
              <p class="text-xs text-slate-500 mt-1">${item.desc}</p>
              <p class="font-bold text-lg text-slate-900 mt-2">₦${item.price.toLocaleString()}</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100">
              <div class="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-700 font-mono mb-3">
                <strong class="text-slate-900 block mb-1">Direct Seller Payment Details:</strong>
                <span>Bank: ${vendor.paymentDetails.bankName}</span><br/>
                <span>Acc No: ${vendor.paymentDetails.accountNumber}</span><br/>
                <span>Name: ${vendor.paymentDetails.accountName}</span>
              </div>
              <a href="https://wa.me/${vendor.whatsapp}?text=Hello%20${encodeURIComponent(vendor.businessName)},%20I%20am%20interested%20in%20ordering%20the%20${encodeURIComponent(item.title)}." 
                 target="_blank" 
                 class="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold text-xs transition">
                Order & Pay Seller Directly
              </a>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderSellers(container) {
  container.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Verified Independent Sellers</h1>
      <p class="text-slate-500 text-sm">Direct settlement channels for every designer on the platform.</p>
    </div>
    <div class="space-y-4">
      ${VENDORS.map(v => `
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <img src="${v.logo}" class="w-14 h-14 rounded-full object-cover border-2 border-amber-500" />
            <div>
              <h3 class="font-bold text-slate-900 text-lg">${v.businessName}</h3>
              <p class="text-xs text-slate-500">${v.bio}</p>
            </div>
          </div>
          <a href="https://wa.me/${v.whatsapp}" target="_blank" class="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg">
            Chat on WhatsApp
          </a>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTracker(container) {
  container.innerHTML = `
    <div class="max-w-xl mx-auto bg-white p-6 rounded-xl border border-slate-200">
      <h2 class="text-xl font-bold text-slate-900">Garment Progress Tracker</h2>
      <p class="text-xs text-slate-500 mb-4">Track the current execution stage of your order.</p>
      <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm">
        <strong>Current Stage:</strong> Sewing & Assembly Stage (Stage 3 of 5)
      </div>
    </div>
  `;
}

function renderMeasurements(container) {
  container.innerHTML = `
    <div class="max-w-xl mx-auto bg-white p-6 rounded-xl border border-slate-200">
      <h2 class="text-xl font-bold text-slate-900 mb-2">My Tailoring Sizes</h2>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-xs font-bold text-slate-600">Chest (ins)</label><input type="text" value="42" class="w-full border p-2 rounded mt-1 text-sm"/></div>
        <div><label class="text-xs font-bold text-slate-600">Waist (ins)</label><input type="text" value="34" class="w-full border p-2 rounded mt-1 text-sm"/></div>
      </div>
      <button onclick="alert('Measurements saved locally!')" class="mt-4 w-full bg-slate-900 text-white py-2 rounded font-bold text-sm">Save Measurements</button>
    </div>
  `;
}

window.onload = () => switchTab('catalog');
