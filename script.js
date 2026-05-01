/* ═══════════════════════════════════════════
   PULSE FEEDBACK — script.js
   ═══════════════════════════════════════════ */

// ── Supabase ───────────────────────────────
const supabaseUrl = "https://vtonrpwqinzexcoupvzo.supabase.co";
const supabaseKey = "sb_publishable_FRhu5B5Rh1QaRt9arGr0hQ_4YkKom6S";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ── State ──────────────────────────────────
let rating = 0;
const RATING_WORDS = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

// ── DOM refs ───────────────────────────────
const stars     = document.querySelectorAll(".star-btn");
const starHint  = document.getElementById("starHint");
const textarea  = document.getElementById("feedback");
const charCount = document.getElementById("charCount");
const toast     = document.getElementById("toast");
const submitBtn = document.getElementById("submitBtn");

// ── Char counter ───────────────────────────
textarea.addEventListener("input", () => {
  const len = textarea.value.length;
  charCount.textContent = `${len} / 500`;
  charCount.style.color = len > 480 ? "#ff6b35" : "";
  if (len > 500) textarea.value = textarea.value.slice(0, 500);
});

// ── Stars ──────────────────────────────────
stars.forEach((btn, idx) => {
  const val = idx + 1;

  btn.addEventListener("click", () => setRating(val));

  btn.addEventListener("mouseenter", () => {
    stars.forEach((s, i) => s.classList.toggle("lit", i <= idx));
    starHint.textContent = RATING_WORDS[val];
    starHint.style.color = "#ff6b35";
  });

  btn.addEventListener("mouseleave", () => {
    stars.forEach(s => s.classList.remove("lit"));
    starHint.textContent = rating > 0 ? RATING_WORDS[rating] : "Select a rating";
    starHint.style.color = rating > 0 ? "#ff6b35" : "";
  });
});

function setRating(r) {
  rating = r;
  stars.forEach((s, i) => {
    s.classList.toggle("active", i < r);
    s.classList.remove("lit");
  });
  starHint.textContent = RATING_WORDS[r];
  starHint.style.color = "#ff6b35";
}

// ── Toast ──────────────────────────────────
let toastTimer;
function showToast(msg, type = "success") {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.className   = `toast ${type}`;

  // Force reflow
  void toast.offsetHeight;
  toast.classList.add("visible");

  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 3500);
}

// ── Chart ──────────────────────────────────
const ctx = document.getElementById("chart");

const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["1★", "2★", "3★", "4★", "5★"],
    datasets: [{
      label: "Responses",
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        "rgba(255,107,53,0.15)",
        "rgba(255,107,53,0.25)",
        "rgba(255,200,69,0.25)",
        "rgba(0,212,170,0.25)",
        "rgba(0,212,170,0.45)",
      ],
      borderColor: [
        "rgba(255,107,53,0.6)",
        "rgba(255,107,53,0.7)",
        "rgba(255,200,69,0.7)",
        "rgba(0,212,170,0.7)",
        "rgba(0,212,170,1)",
      ],
      borderWidth: 1.5,
      borderRadius: 8,
      borderSkipped: false,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15,15,20,0.9)",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        titleColor: "#f0ede8",
        bodyColor: "#9b9699",
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: ctx => ` ${ctx.parsed.y} response${ctx.parsed.y !== 1 ? "s" : ""}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#5a5760",
          font: { family: "'Instrument Sans', sans-serif", size: 11 }
        }
      },
      y: {
        beginAtZero: true,
        border: { display: false, dash: [4, 4] },
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: {
          stepSize: 1,
          color: "#5a5760",
          font: { family: "'Instrument Sans', sans-serif", size: 10 }
        }
      }
    }
  }
});

// ── Submit ─────────────────────────────────
async function addFeedback() {
  const name = document.getElementById("name").value.trim();
  const text = textarea.value.trim();

  if (!rating)        return showToast("⭐ Please select a star rating", "error");
  if (!text)          return showToast("✏️ Please write some feedback", "error");
  if (text.length < 5) return showToast("✏️ Feedback is too short", "error");

  // Loading state
  submitBtn.disabled = true;
  submitBtn.querySelector("span").textContent = "Sending…";

  const { error } = await supabaseClient.from("feedbacks").insert([
    { name: name || "Anonymous", rating, text }
  ]);

  // Restore button
  submitBtn.disabled = false;
  submitBtn.querySelector("span").textContent = "Send Feedback";

  if (error) {
    console.error(error);
    return showToast("❌ Couldn't save. Please try again.", "error");
  }

  // Reset form
  textarea.value = "";
  document.getElementById("name").value = "";
  charCount.textContent = "0 / 500";
  setRating(0);
  stars.forEach(s => s.classList.remove("active", "lit"));
  starHint.textContent = "Select a rating";
  starHint.style.color = "";

  showToast("🎉 Thank you for your feedback!", "success");
  loadFeedback();
}

// ── Load ───────────────────────────────────
async function loadFeedback() {
  const listEl = document.getElementById("feedbackList");

  const { data, error } = await supabaseClient
    .from("feedbacks")
    .select("id, name, rating, text")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    listEl.innerHTML = `<div class="empty-state">⚠️ Failed to load reviews.</div>`;
    return;
  }

  const counts = [0, 0, 0, 0, 0];
  listEl.innerHTML = "";

  if (!data || data.length === 0) {
    listEl.innerHTML = `<div class="empty-state">No reviews yet — be the first! 🌱</div>`;
    updateStats([], counts);
    return;
  }

  data.forEach(f => {
    counts[f.rating - 1]++;

    const filledStars = "★".repeat(f.rating);
    const emptyStars  = "☆".repeat(5 - f.rating);

    // Initials avatar
    const initial = (f.name || "A")[0].toUpperCase();
    const hue = (f.name || "A").charCodeAt(0) * 37 % 360;

    const item = document.createElement("div");
    item.className = "fi";
    item.innerHTML = `
      <div class="fi-top">
        <div class="fi-avatar" style="--hue:${hue}">${initial}</div>
        <div class="fi-meta">
          <span class="fi-name">${esc(f.name)}</span>
          <span class="fi-stars">${filledStars}<span class="fi-stars-empty">${emptyStars}</span></span>
        </div>
      </div>
      <p class="fi-text">${esc(f.text)}</p>
      <div class="fi-rating-bar">
        <div class="fi-rating-fill" style="width:${(f.rating/5)*100}%"></div>
      </div>
    `;
    listEl.appendChild(item);
  });

  updateStats(data, counts);
}

// ── Stats + Chart update ───────────────────
function updateStats(data, counts) {
  // Count badge
  document.getElementById("countBadge").textContent = data.length;

  if (data.length === 0) {
    document.getElementById("avgStat").textContent   = "—";
    document.getElementById("totalStat").textContent = "0";
    document.getElementById("topStat").textContent   = "—";
  } else {
    const total = data.reduce((acc, f) => acc + f.rating, 0);
    const avg   = (total / data.length).toFixed(1);

    // Most common rating
    const maxCount = Math.max(...counts);
    const topRating = counts.indexOf(maxCount) + 1;

    document.getElementById("avgStat").textContent   = `${avg}★`;
    document.getElementById("totalStat").textContent = data.length;
    document.getElementById("topStat").textContent   = `${topRating}★`;
  }

  chart.data.datasets[0].data = counts;
  chart.update("active");
}

// ── Escape HTML ────────────────────────────
function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Init ───────────────────────────────────
loadFeedback();