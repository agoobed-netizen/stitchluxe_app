/* ==========================================
   STITCHLUXE - APPRENTICE ACADEMY & MENTORSHIP PORTAL
   ========================================== */

async function renderApprenticePortal() {
  const viewport = document.getElementById("module-viewport");
  if (!viewport) return;

  viewport.innerHTML = `
    <div class="space-y-6">
      <!-- HERO BANNER -->
      <div class="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span class="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20 uppercase tracking-wide">Fashion Academy</span>
          <h3 class="font-bold text-lg text-white mt-1">StitchLuxe Mentorship & Apprentice Program</h3>
          <p class="text-xs text-slate-300 max-w-xl mt-1">Apply for direct hands-on apprenticeship under verified master tailors and bespoke fashion houses.</p>
        </div>
        <button onclick="toggleApprenticeForm()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl whitespace-nowrap">
          Apply for Mentorship
        </button>
      </div>

      <!-- APPRENTICE APPLICATION FORM (TOGGLEABLE) -->
      <div id="apprentice-form-card" class="hidden bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div class="border-b pb-3 flex justify-between items-center">
          <h4 class="font-bold text-slate-900 text-sm">Apprentice Application Form</h4>
          <button onclick="toggleApprenticeForm()" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
        </div>
        
        <form onsubmit="handleApprenticeSubmit(event)" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input type="text" id="app-fullname" required placeholder="John Doe" class="w-full p-2.5 border rounded-xl"/>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Email / Contact Phone</label>
            <input type="text" id="app-contact" required placeholder="email@example.com or +234..." class="w-full p-2.5 border rounded-xl"/>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Desired Specialty / Craft</label>
            <select id="app-specialty" class="w-full p-2.5 border rounded-xl bg-white">
              <option value="Bespoke Tailoring & Pattern Cutting">Bespoke Tailoring & Pattern Cutting</option>
              <option value="Traditional Native Embroidery & Beading">Traditional Native Embroidery & Beading</option>
              <option value="Luxury Womenswear & Corsetry">Luxury Womenswear & Corsetry</option>
              <option value="Fashion Brand Operations & Marketing">Fashion Brand Operations & Marketing</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Experience Level</label>
            <select id="app-experience" class="w-full p-2.5 border rounded-xl bg-white">
              <option value="Complete Beginner">Complete Beginner (Zero prior training)</option>
              <option value="Intermediate">Intermediate (1-2 years basic sewing)</option>
              <option value="Advanced Student">Advanced Student (Fashion school graduate)</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block font-semibold text-slate-700 mb-1">Portfolio Link / Behance / Instagram Handle</label>
            <input type="url" id="app-portfolio" placeholder="https://instagram.com/yourbrand or drive link" class="w-full p-2.5 border rounded-xl"/>
          </div>
          <div class="md:col-span-2">
            <label class="block font-semibold text-slate-700 mb-1">Why do you want to join this program?</label>
            <textarea id="app-statement" rows="3" required placeholder="Describe your passion and what skills you hope to master..." class="w-full p-2.5 border rounded-xl"></textarea>
          </div>
          <div class="md:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" onclick="toggleApprenticeForm()" class="px-4 py-2 border rounded-xl text-slate-600 font-bold">Cancel</button>
            <button type="submit" class="bg-slate-900 text-amber-400 font-bold px-6 py-2 rounded-xl">Submit Application</button>
          </div>
        </form>
      </div>

      <!-- MY APPLICATIONS / STATUS PIPELINE -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h4 class="font-bold text-slate-900 text-sm">Your Mentorship Applications</h4>
        <div id="apprentice-status-feed" class="text-xs text-slate-500">
          Loading application history...
        </div>
      </div>
    </div>
  `;

  fetchApprenticeApplications();
}

function toggleApprenticeForm() {
  const card = document.getElementById("apprentice-form-card");
  if (card) card.classList.toggle("hidden");
}

async function handleApprenticeSubmit(e) {
  e.preventDefault();
  if (!currentUser) return alert("Please log in to submit an application.");

  const portfolio_url = document.getElementById("apprentice-portfolio")?.value;
  const specialty = document.getElementById("app-specialty")?.value;

  const { error } = await supabaseClient.from("apprentice_applications").insert([
    {
      applicant_id: currentUser.id,
      portfolio_url: portfolio_url || specialty,
      status: "Pending Review"
    }
  ]);

  if (error) alert("Submission error: " + error.message);
  else {
    alert("Application submitted successfully!");
    toggleApprenticeForm();
    fetchApprenticeApplications();
  }
}

async function fetchApprenticeApplications() {
  const feed = document.getElementById("apprentice-status-feed");
  if (!feed || !supabaseClient || !currentUser) return;

  try {
    const { data: apps, error } = await supabaseClient
      .from("apprentice_applications")
      .select("*")
      .eq("applicant_id", currentUser.id);

    if (error) throw error;

    if (!apps || apps.length === 0) {
      feed.innerHTML = `<p class="text-slate-400 italic">No mentorship applications submitted yet. Click above to apply!</p>`;
      return;
    }

    feed.innerHTML = apps.map(app => `
      <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center mb-2">
        <div>
          <span class="font-bold text-slate-900 block">Application #${app.id.slice(0, 8)}</span>
          <span class="text-[11px] text-slate-500">${app.portfolio_url || 'Bespoke Tailoring'}</span>
        </div>
        <span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">${app.status}</span>
      </div>
    `).join("");

  } catch (err) {
    feed.innerHTML = `<p class="text-red-500">Error loading status: ${err.message}</p>`;
  }
}
