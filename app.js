/* ==========================================
   STITCHLUXE - MAIN SYSTEM ENGINE & DIRECT AUTH
   ========================================== */

// 1. SUPABASE CREDENTIALS (PASTE YOURS IF AVAILABLE, OR LEAVE AS IS)
var SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
var SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

var supabaseClient = (window.supabase && !SUPABASE_URL.includes("YOUR_PROJECT_ID")) 
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

var currentUser = null;
window.authMode = 'login';

// 2. GUARANTEED AUTH SUBMIT (INSTANT ACCESS)
function handleAuthSubmit(e) {
  if (e) e.preventDefault();
  
  const emailInput = document.getElementById("auth-email");
  const email = (emailInput && emailInput.value) ? emailInput.value : "designer@stitchluxe.com";

  // Instantly set session locally so you are NEVER blocked
  currentUser = { id: "user-" + Date.now(), email: email };
  
  // Launch the platform immediately
  showAppInterface();
}

// 3. SIGN OUT
function handleSignOut() {
  currentUser = null;
  const authScreen = document.getElementById("auth-screen");
  const mainApp = document.getElementById("main-app");
  if (authScreen) authScreen.classList.remove("hidden");
  if (mainApp) mainApp.classList.add("hidden");
}

// 4. SHOW MAIN APP VIEWPORT
function showAppInterface() {
  const authScreen = document.getElementById("auth-screen");
  const mainApp = document.getElementById("main-app");
  
  if (authScreen) authScreen.classList.add("hidden");
  if (mainApp) mainApp.classList.remove("hidden");

  const emailDisplay = document.getElementById("user-display-email");
  if (emailDisplay && currentUser) {
    emailDisplay.textContent = currentUser.email;
  }

  // Load default tab
  loadTabContent('catalog');
}

// 5. ROUTER FUNCTION (SWITCH BETWEEN 4 MODULES)
async function loadTabContent(tabName) {
  const viewport = document.getElementById("module-viewport");
  if (!viewport) return;

  // Highlight active tab
  ['catalog', 'orders', 'resale', 'apprentice'].forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    if (btn) {
      if (t === tabName) {
        btn.className = "px-4 py-2 rounded-xl bg-slate-900 text-amber-400 font-bold text-xs whitespace-nowrap shadow-sm";
      } else {
        btn.className = "px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs whitespace-nowrap";
      }
    }
  });

  // Render view
  if (tabName === 'catalog') {
    viewport.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-bold text-slate-900 text-sm">Featured Bespoke Catalog</h3>
        </div>
        <div id="catalog-grid-view" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500" class="w-full h-40 object-cover rounded-lg mb-3"/>
              <h4 class="font-bold text-slate-900 text-xs">Royal Velvet Agbada Set</h4>
            </div>
            <div class="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
              <span class="font-bold text-slate-900 text-xs">₦150,000</span>
              <button onclick="loadTabContent('orders')" class="bg-slate-900 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">Order Bespoke</button>
            </div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <img src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500" class="w-full h-40 object-cover rounded-lg mb-3"/>
              <h4 class="font-bold text-slate-900 text-xs">Silk Evening Gown</h4>
            </div>
            <div class="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
              <span class="font-bold text-slate-900 text-xs">₦120,000</span>
              <button onclick="loadTabContent('orders')" class="bg-slate-900 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">Order Bespoke</button>
            </div>
          </div>
        </div>
        <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
          <h4 class="font-bold text-slate-900 text-xs mb-1">Custom Style Reference</h4>
          <p class="text-[11px] text-slate-600 mb-3">Looking for custom inspiration? Explore styles on Pinterest and share links directly with your designer.</p>
          <a href="https://www.pinterest.com/search/pins/?q=african%20fashion%20design" target="_blank" class="inline-flex items-center gap-2 bg-rose-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold">
            <i class="fa-brands fa-pinterest"></i> Explore Pinterest Ideas
          </a>
        </div>
      </div>
    `;
    if (supabaseClient) fetchCatalogItems();
  } 
  else if (tabName === 'orders') {
    if (typeof renderOrdersTracker === 'function') renderOrdersTracker();
  }
  else if (tabName === 'resale') {
    if (typeof renderResaleStorefront === 'function') renderResaleStorefront();
  }
  else if (tabName === 'apprentice') {
    if (typeof renderApprenticePortal === 'function') renderApprenticePortal();
  }
}

// 6. OPTIONAL SUPABASE FETCH (SAFE FAILOVER)
async function fetchCatalogItems() {
  const grid = document.getElementById("catalog-grid-view");
  if (!grid || !supabaseClient) return;

  try {
    const { data: items, error } = await supabaseClient
      .from("catalog_items")
      .select("*")
      .eq("category", "Bespoke Catalog");

    if (error || !items || items.length === 0) return; // Keep fallback hardcoded items

    grid.innerHTML = items.map(item => `
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <img src="${item.image_url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500'}" class="w-full h-40 object-cover rounded-lg mb-3"/>
          <h4 class="font-bold text-slate-900 text-xs">${item.title}</h4>
        </div>
        <div class="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
          <span class="font-bold text-slate-900 text-xs">₦${Number(item.price).toLocaleString()}</span>
          <button onclick="loadTabContent('orders')" class="bg-slate-900 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">Order Bespoke</button>
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.log("Using fallback catalog view...");
  }
}

// 7. AUTO INIT
document.addEventListener("DOMContentLoaded", () => {
  // Always present clean login first
  const authScreen = document.getElementById("auth-screen");
  const mainApp = document.getElementById("main-app");
  if (authScreen) authScreen.classList.remove("hidden");
  if (mainApp) mainApp.classList.add("hidden");
});
