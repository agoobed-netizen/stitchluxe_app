/* ==========================================
   STITCHLUXE APPLICATION ENGINE (SUPABASE LIVE)
   ========================================== */

// Initialize Supabase Client
const SUPABASE_URL = "https://chtptlxjtywzmdxbajwd.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"; // Replace with your anon key from Supabase Settings -> API
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let currentProfile = null;

// --- 1. AUTHENTICATION ENGINE ---
async function initAuthGuard() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  const authScreen = document.getElementById("auth-screen");
  const appWorkspace = document.getElementById("app-workspace");

  if (session) {
    currentUser = session.user;
    
    // Fetch profile details
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

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
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("auth-contact").value;
  const password = document.getElementById("auth-password").value;
  const fullnameInput = document.getElementById("auth-fullname");
  const isSignUp = !fullnameInput.parentElement.classList.contains("hidden");

  if (isSignUp) {
    const fullname = fullnameInput.value;
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullname, role: 'client' }
      }
    });
    if (error) return alert("Sign Up Error: " + error.message);
    alert("Account created successfully! Logging you in...");
  }

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return alert("Login Error: " + error.message);

  initAuthGuard();
}

async function logoutUser() {
  await supabaseClient.auth.signOut();
  initAuthGuard();
}

// --- 2. DATA FETCHING & WORKSPACE RENDERING ---
async function renderWorkspaceOffers() {
  const container = document.getElementById("main-content");
  if (!container) return;

  // Fetch Catalog Items from Supabase Database
  const { data: catalogItems, error } = await supabaseClient
    .from("catalog_items")
    .select("*, profiles(business_name)");

  let itemsHTML = "";
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
    itemsHTML = `<p class="text-xs text-slate-500 col-span-2">No active items found in database catalog.</p>`;
  }

  container.innerHTML = `
    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl mb-6 flex justify-between items-center">
      <div>
        <h2 class="font-bold text-slate-900">Welcome, ${currentProfile?.full_name || 'User'}!</h2>
        <p class="text-xs text-slate-600">Your fashion offers and bespoke catalog are live.</p>
      </div>
      <button onclick="openMeasurementModal()" class="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl font-bold">
        <i class="fa-solid fa-ruler-combined mr-1"></i> Measurements
      </button>
    </div>
    <h3 class="font-bold text-slate-900 mb-3">Live Catalog Items</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">${itemsHTML}</div>
  `;
}

// --- 3. PAYSTACK INLINE INTEGRATION ---
function payWithPaystack(itemId, vendorId, amount) {
  const handler = PaystackPop.setup({
    key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your Public Paystack Key
    email: currentUser.email,
    amount: amount * 100, // Paystack operates in Kobo
    currency: 'NGN',
    callback: function(response) {
      // Payment authorized: Call Supabase Edge Function to verify
      verifyPaymentOnServer(response.reference, {
        client_id: currentUser.id,
        item_id: itemId,
        vendor_id: vendorId,
        amount: amount
      });
    },
    onClose: function() {
      alert('Transaction cancelled.');
    }
  });
  handler.openIframe();
}

async function verifyPaymentOnServer(reference, orderData) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-paystack-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ reference, order_data: orderData })
  });

  const result = await response.json();
  if (result.success) {
    alert("Payment verified and order placed successfully!");
    renderWorkspaceOffers();
  } else {
    alert("Payment verification failed: " + result.message);
  }
}

// --- 4. MEASUREMENTS MANAGEMENT ---
async function saveMeasurements(chest, waist, shoulder, armLength) {
  const { error } = await supabaseClient
    .from("measurements")
    .upsert({
      user_id: currentUser.id,
      chest,
      waist,
      shoulder,
      arm_length: armLength,
      updated_at: new Date()
    }, { onConflict: 'user_id' });

  if (error) return alert("Error saving measurements: " + error.message);
  alert("Measurements updated successfully!");
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  initAuthGuard();
});
