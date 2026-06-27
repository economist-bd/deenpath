/* ===========================================================
   দ্বীনপথ — কমন স্ক্রিপ্ট (সব পেজে শেয়ার করা)
   =========================================================== */

const SITE = {
  name: "দ্বীনপথ",
  tagline: "ইসলামিক জ্ঞান, দৈনন্দিন আমল ও জীবনযাপনের পরিপূর্ণ সঙ্গী",
};

const NAV_LINKS = [
  { href: "index.html", label: "হোম" },
  { href: "quran.html", label: "কুরআন" },
  { href: "hadith.html", label: "হাদীস" },
  { href: "prayer-times.html", label: "নামাজের সময়" },
  { href: "masail.html", label: "মাসায়েল" },
  { href: "dua.html", label: "দু'আ" },
  { href: "articles.html", label: "প্রবন্ধ" },
  { href: "blog.html", label: "ব্লগ" },
  { href: "zakat.html", label: "যাকাত ক্যালকুলেটর" },
  { href: "donation.html", label: "কেনাকাটা" },
];

function currentPage() {
  const path = window.location.pathname.split("/").pop();
  return path === "" ? "index.html" : path;
}

function renderHeader() {
  const cur = currentPage();
  const navHtml = NAV_LINKS.map(
    (l) =>
      `<a href="${l.href}" class="${l.href === cur ? "active" : ""}">${l.label}</a>`
  ).join("");

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="header-inner container">
      <a href="index.html" class="brand">
        <span class="brand-mark">☪</span>
        <span>${SITE.name}</span>
      </a>
      <nav class="main-nav" id="mainNav">${navHtml}</nav>
      <div class="header-actions">
        <a href="donation.html" class="btn btn-primary btn-sm donation-cta">দান করুন</a>
        <div class="auth-slot-wrap">
          <div id="authSlot"></div>
        </div>
        <button class="nav-toggle" id="navToggle" aria-label="মেনু খুলুন">☰</button>
      </div>
    </div>
  `;
  document.body.prepend(header);

  document.getElementById("navToggle").addEventListener("click", () => {
    document.getElementById("mainNav").classList.toggle("open");
  });
}

function renderFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand"><span class="brand-mark">☪</span> ${SITE.name}</div>
          <p style="font-size:0.9rem; line-height:1.7; max-width:320px; color: rgba(255,255,255,0.65);">
            ${SITE.tagline}। কুরআন, হাদীস, নামাজের সময়, মাসায়েল, দু'আ ও জীবনমুখী প্রবন্ধ — সব এক জায়গায়, বাংলা ভাষায়।
          </p>
        </div>
        <div class="footer-col">
          <h4>গুরুত্বপূর্ণ লিংক</h4>
          <ul>
            <li><a href="quran.html">কুরআন তিলাওয়াত</a></li>
            <li><a href="hadith.html">হাদীস সংকলন</a></li>
            <li><a href="prayer-times.html">নামাজের সময়সূচি</a></li>
            <li><a href="masail.html">মাসায়েল ও জিজ্ঞাসা</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>অন্যান্য ফিচার</h4>
          <ul>
            <li><a href="dua.html">দৈনন্দিন দু'আ</a></li>
            <li><a href="articles.html">প্রবন্ধ ও নিবন্ধ</a></li>
            <li><a href="blog.html">ব্লগ</a></li>
            <li><a href="zakat.html">যাকাত ক্যালকুলেটর</a></li>
            <li><a href="donation.html">ডোনেশন করুন</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>যোগাযোগ</h4>
          <ul>
            <li>ঢাকা, বাংলাদেশ</li>
            <li><a href="mailto:[email protected]">[email protected]</a></li>
          </ul>
          <div class="social-row" style="margin-top:14px;">
            <a href="#" aria-label="ফেসবুক">f</a>
            <a href="#" aria-label="ইউটিউব">▶</a>
            <a href="#" aria-label="হোয়াটসঅ্যাপ">w</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ২০২৬ ${SITE.name}। সর্বস্বত্ব সংরক্ষিত।</span>
        <span style="color:rgba(255,255,255,0.45)">তথ্যসূত্র যাচাইয়ের জন্য স্থানীয় আলেমদের সাথে পরামর্শ করুন</span>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}

function renderBackFab() {
  const btn = document.createElement("button");
  btn.className = "back-fab";
  btn.id = "backFab";
  btn.innerHTML = "↑";
  btn.setAttribute("aria-label", "উপরে যান");
  document.body.appendChild(btn);
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 500);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function renderToastHost() {
  const t = document.createElement("div");
  t.className = "toast";
  t.id = "toastHost";
  document.body.appendChild(t);
}

function showToast(msg, duration = 2400) {
  const host = document.getElementById("toastHost");
  if (!host) return;
  host.textContent = msg;
  host.classList.add("show");
  clearTimeout(host._timer);
  host._timer = setTimeout(() => host.classList.remove("show"), duration);
}

function initLayout() {
  renderHeader();
  renderFooter();
  renderBackFab();
  renderToastHost();
}

/* ---------- বাংলা সংখ্যা ও তারিখ হেল্পার ---------- */
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
function toBnNumber(input) {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[d]);
}

const BN_MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
function formatBnDate(date = new Date()) {
  return `${toBnNumber(date.getDate())} ${BN_MONTHS[date.getMonth()]}, ${toBnNumber(date.getFullYear())}`;
}

/* ---------- লোকাল ক্যাশ হেল্পার (API কল কমাতে) ---------- */
function cacheGet(key, maxAgeMs) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.t > maxAgeMs) return null;
    return parsed.v;
  } catch (e) {
    return null;
  }
}
function cacheSet(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value }));
  } catch (e) {}
}

/* ---------- ফেচ হেল্পার উইথ টাইমআউট ---------- */
async function fetchJson(url, timeoutMs = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

document.addEventListener("DOMContentLoaded", initLayout);
