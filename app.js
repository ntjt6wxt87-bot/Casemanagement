// Simple in-memory store (also synced with localStorage)
let matters = [];

// Load from localStorage if available
const saved = localStorage.getItem("matters");
if (saved) {
  matters = JSON.parse(saved);
}

// Utility: save matters to localStorage
function saveMatters() {
  localStorage.setItem("matters", JSON.stringify(matters));
}

// NAVIGATION
const navButtons = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const targetViewId = btn.dataset.view;

    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    views.forEach(v => {
      v.classList.toggle("visible", v.id === targetViewId);
    });
  });
});

// FORM HANDLING
const matterForm = document.getElementById("matterForm");
const mattersTableBody = document.getElementById("mattersTableBody");
const searchInput = document.getElementById("searchInput");
const filterMatterType = document.getElementById("filterMatterType");

// Stats
const statOpenMatters = document.getElementById("statOpenMatters");
const statClosedMatters = document.getElementById("statClosedMatters");

matterForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const matter = {
    id: Date.now(),
    internalRef: document.getElementById("internalRef").value.trim(),
    courtRef: document.getElementById("courtRef").value.trim(),
    ministryRef: document.getElementById("ministryRef").value.trim(),
    title: document.getElementById("matterTitle").value.trim(),
    type: document.getElementById("matterType").value,
    country: document.getElementById("country").value.trim(),
    offences: document.getElementById("offences").value.trim(),
    legislation: document.getElementById("legislation").value.trim(),
    status: document.getElementById("status").value,
    parties: document.getElementById("parties").value.trim(),
    createdAt: new Date().toISOString()
  };

  matters.push(matter);
  saveMatters();
  renderMatters();
  matterForm.reset();
});

// FILTERING
searchInput.addEventListener("input", () => {
  renderMatters();
});

filterMatterType.addEventListener("change", () => {
  renderMatters();
});

// RENDER FUNCTION
function renderMatters() {
  const searchText = searchInput.value.toLowerCase();
  const typeFilter = filterMatterType.value;

  const filtered = matters.filter(m => {
    if (typeFilter && m.type !== typeFilter) return false;

    const combined = [
      m.internalRef,
      m.courtRef,
      m.ministryRef,
      m.title,
      m.country,
      m.offences,
      m.legislation,
      m.parties
    ].join(" ").toLowerCase();

    if (!combined.includes(searchText)) return false;

    return true;
  });

  mattersTableBody.innerHTML = "";

  filtered.forEach(m => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${m.internalRef || ""}</td>
      <td>${m.courtRef || ""}</td>
      <td>${m.ministryRef || ""}</td>
      <td>${m.title || ""}</td>
      <td>${formatMatterType(m.type)}</td>
      <td>${m.offences || ""}</td>
      <td>${m.legislation || ""}</td>
      <td>${m.country || ""}</td>
      <td>${m.parties || ""}</td>
      <td>${m.status || ""}</td>
    `;

    mattersTableBody.appendChild(tr);
  });

  updateStats();
}

function formatMatterType(type) {
  switch (type) {
    case "mla": return "Request for Assistance";
    case "memo": return "Memorandum Review";
    case "hr": return "Human Rights Report";
    case "other": return "Other";
    default: return "";
  }
}

function updateStats() {
  const openCount = matters.filter(m => m.status === "Open").length;
  const closedCount = matters.filter(m => m.status === "Closed").length;

  statOpenMatters.textContent = openCount;
  statClosedMatters.textContent = closedCount;
}

// Initial render
renderMatters();
