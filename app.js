/* ==========================================
   STITCHLUXE APPLICATION ENGINE (MOBILE FIXED)
   ========================================== */

// SUPABASE CONFIGURATION
const SUPABASE_URL = "https://chtptlxjtywzmdxbajwd.supabase.co";
// Double check that this key is your exact anon key from Supabase Project Settings -> API
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodHB0bHhqdHl3em1keGJhandkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNzM0MDIsImV4cCI6MjEwMjc0OTQwMn0.AiKT4nadvpaz7GOCHDc4lGGbpJ74dmWm2W7L_fX23nc "; 

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
