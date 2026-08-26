/* ==========================================
   STITCHLUXE - APPRENTICE APPLICATION PORTAL
   ========================================== */

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
