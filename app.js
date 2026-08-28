/* ==========================================
   STITCHLUXE APPLICATION ENGINE (MOBILE FIXED)
   ========================================== */

// SUPABASE CONFIGURATION
const SUPABASE_URL = "https://chtptlxjtywzmdxbajwd.supabase.co ";
// Double check that this key is your exact anon key from Supabase Project Settings -> API
const SUPABASE_ANON_KEY = " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodHB0bHhqdHl3em1keGJhandkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNzM0MDIsImV4cCI6MjEwMjc0OTQwMn0.AiKT4nadvpaz7GOCHDc4lGGbpJ74dmWm2W7L_fX23nc"; 

let supabaseClient = null;

// Initialize Supabase Safely
try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.error("Supabase SDK not loaded");
  }
} catch (e) {
  console.error("Supabase init error:", e);
}

let currentUser = null;
let currentProfile = null;
let isSignUp = false;

// --- AUTHENTICATION GUARD ---
async function initAuthGuard() {
  const authScreen = document.getElementById("auth-screen");
  const appWorkspace = document.getElementById("app-workspace");

  if (!supabaseClient) {
    alert("Connection Error: Supabase SDK failed to load inside the app wrapper.");
    return;
  }

  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error) throw error;

    if (session) {
      currentUser = session.user;
      
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      currentProfile = profile;

      if (authScreen) authScreen.style.setProperty("display", "none", "important");
      if (appWorkspace) {
        appWorkspace.style.setProperty("display", "block", "important");
        renderWorkspaceOffers();
      }
    } else {
      currentUser = null;
      currentProfile = null;
      if (appWorkspace) appWorkspace.style.setProperty("display", "none", "important");
      if (authScreen) authScreen.style.setProperty("display", "flex", "important");
    }
  } catch (err) {
    console.error("Auth Guard Error:", err.message);
    // Default back to login screen on error
    if (appWorkspace) appWorkspace.style.setProperty("display", "none", "important");
    if (authScreen) authScreen.style.setProperty("display", "flex", "important");
  }
}

function toggleAuthMode() {
  isSignUp = !isSignUp;
  const fullnameGroup = document.getElementById("fullname-group");
  const submitBtn = document.getElementById("auth-submit-btn");
  const toggleText = document.getElementById("toggle-text");
  const toggleBtn = document.getElementById("toggle-btn");

  if (isSignUp) {
    fullnameGroup.classList.remove("hidden");
    submitBtn.innerText = "Create Account";
    toggleText.innerText = "Already have an account?";
    toggleBtn.innerText = "Sign In";
  } else {
    fullnameGroup.classList.add("hidden");
    submitBtn.innerText = "Sign In";
    toggleText.innerText = "Need an account?";
    toggleBtn.innerText = "Create Account";
  }
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById("auth-submit-btn");
  const email = document.getElementById("auth-contact").value.trim();
  const password = document.getElementById("auth-password").value;
  const fullnameInput = document.getElementById("auth-fullname");

  if (!supabaseClient) {
    return alert("Database connection client missing. Check Internet Connection.");
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Processing...";

  try {
    if (isSignUp) {
      const fullname = fullnameInput.value.trim();
      const { error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullname, role: 'client' }
        }
      });
      if (signUpError) throw signUpError;
      alert("Account created successfully! Logging you in...");
    }

    const { error: signInError } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;

    await initAuthGuard();

  } catch (err) {
    alert("Authentication Error: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = isSignUp ? "Create Account" : "Sign In";
  }
}

async function logoutUser() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  initAuthGuard();
}

// --- WORKSPACE RENDERING ---
async function renderWorkspaceOffers() {
  const container = document.getElementById("main-content");
  if (!container) return;

  let itemsHTML = "";

  try {
    const { data: catalogItems } = await supabaseClient
      .from("catalog_items")
      .select("*, profiles(business_name)");

    if (catalogItems && catalogItems.length > 0) {
      catalogItems.forEach(item => {
        itemsHTML += `
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <img src="${item.image_url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500'}" class="w-full h-40 object-cover rounded-lg mb-3"/>
            <span class="font-bold text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">${item.category}</span>
            <h4 class="font-bold text-sm text-slate-800 mt-1">${item.title}</h4>
            <p class="text-xs text-slate-500">By: ${item.profiles?.business_name || 'Verified Designer'}</p>
            <div class="flex justify-between items-center mt-3">
              <span class="font-black text-slate-900 text-sm">₦${Number(item.price).toLocaleString()}</span>
              <button onclick="payWithPaystack('${item.id}', '${item.vendor_id}', ${item.price})" class="bg-slate-900 text-amber-400 font-bold text-xs px-3 py-1.5 rounded-lg">
                Order Bespoke
              </button>
            </div>
          </div>
        `;
      });
    } else {
      itemsHTML = `<p class="text-xs text-slate-500 col-span-2">No active items in catalog yet. Database is connected!</p>`;
    }
  } catch (e) {
    itemsHTML = `<p class="text-xs text-red-500 col-span-2">Error loading catalog: ${e.message}</p>`;
  }

  container.innerHTML = `
    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl mb-6 flex justify-between items-center">
      <div>
        <h2 class="font-bold text-slate-900">Welcome, ${currentProfile?.full_name || 'User'}!</h2>
        <p class="text-xs text-slate-600">Your fashion offers and bespoke catalog are live.</p>
      </div>
      <a href="https://www.pinterest.com/search/pins/?q=african%20native%20sewing%20designs" target="_blank" class="bg-rose-600 text-white text-xs px-3 py-2 rounded-xl font-bold">
        <i class="fa-brands fa-pinterest mr-1"></i> Pinterest
      </a>
    </div>
    <h3 class="font-bold text-slate-900 mb-3">Live Catalog Items</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">${itemsHTML}</div>
  `;
}

// INITIALIZE ON LOAD
document.addEventListener("DOMContentLoaded", () => {
  initAuthGuard();
});
/* ==========================================
   FEATURE ROUTER & MODULE RENDERERS
   ========================================== */

async function loadTabContent(tabName) {
  const viewport = document.getElementById("module-viewport");
  if (!viewport) return;

  // Highlight active tab UI
  ['catalog', 'orders', 'resale', 'apprentice'].forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    if (btn) {
      if (t === tabName) {
        btn.className = "px-4 py-2 rounded-xl bg-slate-900 text-amber-400 whitespace-nowrap";
      } else {
        btn.className = "px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 whitespace-nowrap";
      }
    }
  });

  // Render module views
  if (tabName === 'catalog') {
    viewport.innerHTML = `
      <h3 class="font-bold text-slate-900 text-sm mb-3">Featured Bespoke Catalog</h3>
      <div id="catalog-grid-view" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">Loading items...</div>
      <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
        <h4 class="font-bold text-slate-900 text-xs mb-1">Custom Style Reference</h4>
        <p class="text-[11px] text-slate-600 mb-3">Looking for custom inspiration? Explore styles on Pinterest and share links directly with your designer.</p>
        <a href="https://www.pinterest.com/search/pins/?q=african%20fashion%20design" target="_blank" class="inline-flex items-center gap-2 bg-rose-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold">
          <i class="fa-brands fa-pinterest"></i> Explore Pinterest Ideas
        </a>
      </div>
    `;
    fetchCatalogItems();
  } 
  else if (tabName === 'orders') renderOrdersTracker();
  else if (tabName === 'resale') renderResaleStorefront();
  else if (tabName === 'apprentice') renderApprenticePortal();
}

// Garment Tracker Function
async function renderOrdersTracker() {
  const viewport = document.getElementById("module-viewport");
  if (!viewport || !supabaseClient || !currentUser) return;

  try {
    const { data: orders, error } = await supabaseClient
      .from("bespoke_orders")
      .select("*")
      .or(`client_id.eq.${currentUser.id},designer_id.eq.${currentUser.id}`);

    if (error) throw error;

    if (!orders || orders.length === 0) {
      viewport.innerHTML = `
        <div class="bg-white p-5 rounded-xl border border-slate-200">
          <h3 class="font-bold text-slate-900 text-sm mb-2">Visual Garment Progress Tracker</h3>
          <p class="text-xs text-slate-500 mb-4">Track measurements, fabric cutting, fitting stages, and delivery status.</p>
          <div class="p-6 bg-slate-50 rounded-lg text-center text-xs text-slate-500 border border-dashed border-slate-300">
            No active bespoke garment orders found.
          </div>
        </div>`;
      return;
    }

    const stages = ['Consultation', 'Cutting Stage', 'Sewing Stage', 'Fitting Stage', 'Delivered'];
    viewport.innerHTML = `
      <div class="space-y-4">
        <h3 class="font-bold text-slate-900 text-sm">Active Bespoke Orders</h3>
        ${orders.map(order => {
          const currentStageIdx = stages.indexOf(order.status) !== -1 ? stages.indexOf(order.status) : 1;
          const progressPercent = Math.round(((currentStageIdx + 1) / stages.length) * 100);
          return `
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div class="flex justify-between items-center mb-3">
                <h4 class="font-bold text-xs text-slate-900">${order.garment_title}</h4>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">${order.status}</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 mb-3">
                <div class="bg-amber-500 h-2 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  } catch (err) {
    viewport.innerHTML = `<p class="text-xs text-red-500">Error: ${err.message}</p>`;
  }
}

// Resale Storefront Function
async function renderResaleStorefront() {
  const viewport = document.getElementById("module-viewport");
  if (!viewport) return;
  viewport.innerHTML = `
    <div class="bg-white p-5 rounded-xl border border-slate-200">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="font-bold text-slate-900 text-sm">Wardrobe Resale Storefront</h3>
          <p class="text-xs text-slate-500">Buy and sell pre-loved authentic luxury couture.</p>
        </div>
        <button onclick="toggleResaleForm()" class="bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg">
          + List Item
        </button>
      </div>
      <div id="resale-form-container" class="hidden mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <h4 class="font-bold text-slate-900 mb-3">Post Pre-Loved Item</h4>
        <input type="text" id="resale-title" placeholder="Item Title (e.g., Silk Velvet Agbada)" class="w-full p-2 mb-2 border rounded-lg"/>
        <input type="number" id="resale-price" placeholder="Price (NGN)" class="w-full p-2 mb-2 border rounded-lg"/>
        <input type="url" id="resale-image" placeholder="Image URL" class="w-full p-2 mb-3 border rounded-lg"/>
        <button onclick="submitResaleItem()" class="bg-slate-900 text-amber-400 font-bold px-4 py-2 rounded-lg">Publish Listing</button>
      </div>
      <div id="resale-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <p class="text-slate-400 col-span-2">No resale items posted yet.</p>
      </div>
    </div>`;
}

function toggleResaleForm() {
  const form = document.getElementById("resale-form-container");
  if (form) form.classList.toggle("hidden");
}

async function submitResaleItem() {
  const title = document.getElementById("resale-title")?.value;
  const price = document.getElementById("resale-price")?.value;
  const image_url = document.getElementById("resale-image")?.value;
  if (!title || !price) return alert("Please fill in title and price.");

  const { error } = await supabaseClient.from("catalog_items").insert([
    { title, price, image_url, category: "Wardrobe Resale" }
  ]);
  if (error) alert("Error: " + error.message);
  else {
    alert("Listing published!");
    loadTabContent('catalog');
  }
}

// Apprentice Portal Function
async function renderApprenticePortal() {
  const viewport = document.getElementById("module-viewport");
  if (!viewport) return;
  viewport.innerHTML = `
    <div class="bg-white p-5 rounded-xl border border-slate-200">
      <h3 class="font-bold text-slate-900 text-sm mb-1">Fashion Talent & Apprentice Portal</h3>
      <p class="text-xs text-slate-500 mb-4">Apply for direct mentorship under top registered designers on StitchLuxe.</p>
      <form onsubmit="handleApprenticeSubmit(event)" class="space-y-3 text-xs max-w-lg">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Portfolio or Design Deck URL</label>
          <input type="url" id="apprentice-portfolio" required placeholder="https://behance.net/your-portfolio" class="w-full p-2.5 border rounded-lg"/>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Area of Expertise / Interest</label>
          <select id="apprentice-specialty" class="w-full p-2.5 border rounded-lg">
            <option value="pattern_making">Pattern Making & Cutting</option>
            <option value="embroidery">Bespoke Embroidery & Beading</option>
            <option value="tailoring">Men's Native & Corporate Tailoring</option>
          </select>
        </div>
        <button type="submit" class="bg-slate-900 text-amber-400 font-bold px-4 py-2.5 rounded-lg">
          Submit Application
        </button>
      </form>
    </div>`;
}

async function handleApprenticeSubmit(e) {
  e.preventDefault();
  const portfolio_url = document.getElementById("apprentice-portfolio")?.value;
  if (!currentUser) return alert("You must be logged in to apply.");

  const { error } = await supabaseClient.from("apprentice_applications").insert([
    { applicant_id: currentUser.id, portfolio_url, status: "Pending" }
  ]);
  if (error) alert("Submission failed: " + error.message);
  else alert("Apprentice application submitted successfully!");
}
