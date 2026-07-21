// --- DECENTRALIZED VENDOR DATABASE ---
const VENDORS = [
  {
    id: "vendor_tiana",
    businessName: "Tiana Stitches",
    bio: "Luxury Nigerian Bespoke Couture, Agbada & Corset Asoebi.",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    whatsapp: "2348150338188",
    acceptingInterns: true,
    internshipProgram: "6-Month Advanced Corsetry & Male Agbada Craftsmanship",
    paymentDetails: {
      bankName: "Guaranty Trust Bank (GTB)",
      accountNumber: "0123456789",
      accountName: "Tiana Stitches Enterprise"
    }
  },
  {
    id: "vendor_kaftan",
    businessName: "Kaftan & Threads Co.",
    bio: "Premium Senegalese Kaftans & Senator Suits.",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    whatsapp: "2348012345678",
    acceptingInterns: true,
    internshipProgram: "3-Month Industrial Senator Suit Cutting & Precision Tailoring",
    paymentDetails: {
      bankName: "Zenith Bank",
      accountNumber: "9876543210",
      accountName: "Kaftan Threads Ltd"
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
  if (tabName === "internship") renderInternshipPortal(container);
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
                <span class="text-xs text-amber-600 font-bold">${vendor ? vendor.businessName : ''}</span>
              </div>
              <h3 class="font-bold text-slate-900 mt-2 text-base">${item.title}</h3>
              <p class="text-xs text-slate-500 mt-1">${item.desc}</p>
              <p class="font-bold text-lg text-slate-900 mt-2">₦${item.price.toLocaleString()}</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100">
              <a href="https://wa.me/${vendor ? vendor.whatsapp : ''}?text=Hello,%20I%20want%20to%20order%20the%20${encodeURIComponent(item.title)}." 
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
      <p class="text-slate-500 text-sm">Direct settlement channels and training hubs for every designer.</p>
    </div>
    <div class="space-y-4">
      ${VENDORS.map(v => `
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <img src="${v.logo}" class="w-14 h-14 rounded-full object-cover border-2 border-amber-500" />
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-slate-900 text-lg">${v.businessName}</h3>
                ${v.acceptingInterns ? `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Accepting Interns</span>` : ''}
              </div>
              <p class="text-xs text-slate-500">${v.bio}</p>
            </div>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <a href="https://wa.me/${v.whatsapp}" target="_blank" class="flex-1 sm:flex-none text-center px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg">
              WhatsApp Shop
            </a>
            <button onclick="switchTab('internship')" class="flex-1 sm:flex-none text-center px-4 py-2 bg-amber-600 text-white font-bold text-xs rounded-lg">
              Apply to Train
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderInternshipPortal(container) {
  container.innerHTML = `
    <div class="max-w-2xl mx-auto">
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <h1 class="text-2xl font-bold text-slate-900">Apprenticeship & Internship Admission Portal</h1>
        <p class="text-slate-500 text-sm mt-1">
          Apply directly to top independent fashion houses across Nigeria.
        </p>
      </div>
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Submit Your Admission Application</h2>
        <form onsubmit="handleInternshipSubmit(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Select Fashion House / Designer *</label>
            <select id="intern-vendor" required class="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white">
              <option value="">-- Choose a Fashion House --</option>
              ${VENDORS.filter(v => v.acceptingInterns).map(v => `
                <option value="${v.id}">${v.businessName} — (${v.internshipProgram})</option>
              `).join('')}
            </select>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input type="text" id="intern-name" required class="w-full border border-slate-300 rounded-lg p-2.5 text-sm"/>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number *</label>
              <input type="tel" id="intern-phone" required class="w-full border border-slate-300 rounded-lg p-2.5 text-sm"/>
            </div>
          </div>
          <button type="submit" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg text-sm transition">
            Submit Application via WhatsApp
          </button>
        </form>
      </div>
    </div>
  `;
}

function handleInternshipSubmit(event) {
  event.preventDefault();
  const vendorId = document.getElementById("intern-vendor").value;
  const name = document.getElementById("intern-name").value;
  const phone = document.getElementById("intern-phone").value;

  const vendor = VENDORS.find(v => v.id === vendorId);
  if (!vendor) return;

  const waMessage = `Hello ${vendor.businessName}! I am submitting an Apprenticeship application via StitchLuxe.\n\nName: ${name}\nPhone: ${phone}`;
  window.open(`https://wa.me/${vendor.whatsapp}?text=${encodeURIComponent(waMessage)}`, '_blank');
}

function renderTracker(container) {
  container.innerHTML = `<div class="max-w-xl mx-auto bg-white p-6 rounded-xl border"><h2 class="text-xl font-bold">Garment Tracker</h2><p class="text-xs text-slate-500 mt-2">Sewing Stage (3 of 5)</p></div>`;
}

function renderMeasurements(container) {
  container.innerHTML = `<div class="max-w-xl mx-auto bg-white p-6 rounded-xl border"><h2 class="text-xl font-bold mb-2">My Tailoring Sizes</h2><p class="text-xs text-slate-500">Chest: 42 | Waist: 34</p></div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  switchTab("catalog");
});
