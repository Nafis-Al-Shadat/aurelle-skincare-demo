// Product data — one source for the shop grid and the bundle builder
const products = [
  { id: 1, name: "Cloud Gel Cleanser", tag: "Cleanse", cat: "cleanse", price: 18, desc: "Low-foam gel that cleans without the tight feeling.", img: "img/p1-cleanser.jpg" },
  { id: 2, name: "Calm Tone Serum", tag: "Treat", cat: "treat", price: 32, desc: "10% niacinamide + centella for even, calm skin.", img: "img/p2-serum.jpg" },
  { id: 3, name: "Dew Drop Essence", tag: "Hydrate", cat: "hydrate", price: 26, desc: "Hyaluronic acid layers for instant bounce.", img: "img/p3-essence.jpg" },
  { id: 4, name: "Barrier Whip Cream", tag: "Hydrate", cat: "hydrate", price: 29, desc: "Ceramide cream with a weightless finish.", img: "img/p4-cream.jpg" },
  { id: 5, name: "Soft Polish Exfoliant", tag: "Treat", cat: "treat", price: 24, desc: "Gentle PHA exfoliant for twice-weekly glow.", img: "img/p5-exfoliant.jpg" },
  { id: 6, name: "Melt Cleansing Balm", tag: "Cleanse", cat: "cleanse", price: 22, desc: "Melts sunscreen and makeup in seconds.", img: "img/p6-balm.jpg" },
  { id: 7, name: "Daily Shield SPF 50", tag: "Treat", cat: "treat", price: 28, desc: "Sheer sunscreen with no white cast.", img: "img/p7-spf.jpg" },
  { id: 8, name: "Overnight Repair Mask", tag: "Hydrate", cat: "hydrate", price: 34, desc: "Sleep mask that wakes up dull, tired skin.", img: "img/p8-mask.jpg" },
];

// Lucide icons (ISC licence), inlined so the page needs no icon library
const icons = {
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  droplets: '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
};
document.querySelectorAll("[data-icon]").forEach((el) => {
  el.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[el.dataset.icon]}</svg>`;
});

const BUNDLE_MIN = 3;
const BUNDLE_DISCOUNT = 0.15;
const money = (n) => `$${n.toFixed(2)}`;

let cartCount = 0;
const cartCountEl = document.getElementById("cartCount");
const toastEl = document.getElementById("toast");
let toastTimer;

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
    <div class="product__img"><img src="${p.img}" alt="${p.name}" loading="lazy" width="1024" height="1024"></div>
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
    <img class="bundle__thumb" src="${p.img}" alt="" loading="lazy" width="40" height="40">
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
