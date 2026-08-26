/* ==========================================
   STITCHLUXE - WARDROBE RESALE MARKETPLACE
   ========================================== */

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

  if (error) alert("Error publishing: " + error.message);
  else {
    alert("Listing published successfully!");
    loadTabContent('catalog');
  }
}
