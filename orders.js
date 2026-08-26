/* ==========================================
   STITCHLUXE - BESPOKE PROGRESS TRACKER
   ========================================== */

async function renderOrdersTracker() {
  const viewport = document.getElementById("module-viewport");
  if (!viewport || !supabaseClient || !currentUser) return;

  viewport.innerHTML = `<p class="text-xs text-slate-400">Loading bespoke orders...</p>`;

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
              ${order.pinterest_ref_url ? `
                <a href="${order.pinterest_ref_url}" target="_blank" class="text-[11px] text-rose-600 font-bold inline-flex items-center gap-1">
                  <i class="fa-brands fa-pinterest"></i> View Reference Design
                </a>
              ` : ''}
            </div>`;
        }).join('')}
      </div>`;
  } catch (err) {
    viewport.innerHTML = `<p class="text-xs text-red-500">Error fetching orders: ${err.message}</p>`;
  }
}
