// Product data — one source for the shop grid and the bundle builder
const products = [
  { id: 1, name: "Cloud Gel Cleanser", tag: "Cleanse", cat: "cleanse", price: 18, desc: "Low-foam gel that cleans without the tight feeling.", color: "#E9D5C3", bg: "#F3EBE1" },
  { id: 2, name: "Calm Tone Serum", tag: "Treat", cat: "treat", price: 32, desc: "10% niacinamide + centella for even, calm skin.", color: "#C8775A", bg: "#F5E3D9" },
  { id: 3, name: "Dew Drop Essence", tag: "Hydrate", cat: "hydrate", price: 26, desc: "Hyaluronic acid layers for instant bounce.", color: "#A8BFB1", bg: "#E4EDE7" },
  { id: 4, name: "Barrier Whip Cream", tag: "Hydrate", cat: "hydrate", price: 29, desc: "Ceramide cream with a weightless finish.", color: "#2C5148", bg: "#DDE6E1" },
  { id: 5, name: "Soft Polish Exfoliant", tag: "Treat", cat: "treat", price: 24, desc: "Gentle PHA exfoliant for twice-weekly glow.", color: "#D9A88F", bg: "#F6E8DF" },
  { id: 6, name: "Melt Cleansing Balm", tag: "Cleanse", cat: "cleanse", price: 22, desc: "Melts sunscreen and makeup in seconds.", color: "#EBC6B3", bg: "#F7ECE5" },
  { id: 7, name: "Daily Shield SPF 50", tag: "Treat", cat: "treat", price: 28, desc: "Sheer sunscreen with no white cast.", color: "#F0D9A8", bg: "#F8F0DD" },
  { id: 8, name: "Overnight Repair Mask", tag: "Hydrate", cat: "hydrate", price: 34, desc: "Sleep mask that wakes up dull, tired skin.", color: "#7E9A8B", bg: "#E1EAE4" },
];

const BUNDLE_MIN = 3;
const BUNDLE_DISCOUNT = 0.15;
const money = (n) => `$${n.toFixed(2)}`;

let cartCount = 0;
const cartCountEl = document.getElementById("cartCount");
const toastEl = document.getElementById("toast");
let toastTimer;

function bottleSvg(color) {
  return `<svg viewBox="0 0 100 200"><rect x="38" y="0" width="24" height="26" rx="5" fill="#1F3B34"/><rect x="32" y="24" width="36" height="12" rx="4" fill="#2C5148"/><rect x="12" y="36" width="76" height="160" rx="26" fill="${color}"/><rect x="22" y="96" width="56" height="50" rx="8" fill="#F6F1EA"/><text x="50" y="126" text-anchor="middle" font-family="Fraunces" font-size="11" fill="#1F3B34">aurelle</text></svg>`;
}

function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 2200);
}

function addToCart(qty, label) {
  cartCount += qty;
  cartCountEl.textContent = cartCount;
  cartCountEl.classList.remove("bump");
  void cartCountEl.offsetWidth; // restart the animation
  cartCountEl.classList.add("bump");
  showToast(`${label} added to cart`);
}

// Shop grid
const grid = document.getElementById("products");
grid.innerHTML = products.map((p) => `
  <article class="product reveal" data-cat="${p.cat}">
    <div class="product__img" style="background:${p.bg}">${bottleSvg(p.color)}</div>
    <span class="product__tag">${p.tag}</span>
    <h3>${p.name}</h3>
    <p>${p.desc}</p>
    <div class="product__foot">
      <span class="product__price">${money(p.price)}</span>
      <button class="add-btn" data-id="${p.id}">Add to cart</button>
    </div>
  </article>`).join("");

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;
  const product = products.find((p) => p.id === Number(btn.dataset.id));
  addToCart(1, product.name);
});

// Category filters
document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const filter = btn.dataset.filter;
    grid.querySelectorAll(".product").forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.cat !== filter);
    });
  });
});

// Bundle builder
const bundleList = document.getElementById("bundleList");
const bundleLabel = document.getElementById("bundleLabel");
const bundleOld = document.getElementById("bundleOld");
const bundleNew = document.getElementById("bundleNew");
const bundleAdd = document.getElementById("bundleAdd");

bundleList.innerHTML = products.slice(0, 6).map((p) => `
  <label class="bundle__item">
    <input type="checkbox" value="${p.id}">
    <span>${p.name}</span>
    <span>${money(p.price)}</span>
  </label>`).join("");

function updateBundle() {
  const picked = [...bundleList.querySelectorAll("input:checked")]
    .map((input) => products.find((p) => p.id === Number(input.value)));
  const subtotal = picked.reduce((sum, p) => sum + p.price, 0);
  const qualifies = picked.length >= BUNDLE_MIN;
  const total = qualifies ? subtotal * (1 - BUNDLE_DISCOUNT) : subtotal;

  bundleOld.textContent = qualifies ? money(subtotal) : "";
  bundleNew.textContent = money(total);
  bundleAdd.disabled = !qualifies;
  bundleLabel.textContent = qualifies
    ? `${picked.length} products · you save ${money(subtotal - total)}`
    : `Select ${BUNDLE_MIN - picked.length} more to unlock 15% off`;
}

bundleList.addEventListener("change", updateBundle);
bundleAdd.addEventListener("click", () => {
  const count = bundleList.querySelectorAll("input:checked").length;
  addToCart(count, `Bundle of ${count}`);
  bundleList.querySelectorAll("input").forEach((input) => (input.checked = false));
  updateBundle();
});
updateBundle();

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

// Header border once the page scrolls
const header = document.querySelector(".header");
window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 10), { passive: true });

// Newsletter (demo only — nothing is sent)
document.getElementById("newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.hidden = true;
  document.getElementById("newsMsg").hidden = false;
});

// Reveal sections as they scroll into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Cart button is a placeholder in this demo
document.getElementById("cartBtn").addEventListener("click", () => {
  showToast(cartCount ? `${cartCount} item${cartCount > 1 ? "s" : ""} in your cart (demo)` : "Your cart is empty");
});
