const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

$("#y").textContent = String(new Date().getFullYear());

(() => {
  const links = $$(".nav__link").filter((a) =>
    a.getAttribute("href")?.startsWith("#"),
  );
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((a) =>
      a.toggleAttribute("data-active", a.getAttribute("href") === `#${id}`),
    );
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id || "start");
    },
    { threshold: [0.2, 0.35, 0.5, 0.65] },
  );

  sections.forEach((s) => io.observe(s));
})();

// ===== Reviews gallery: 1.jpg..N.jpg =====
const REVIEW_COUNT = 11; // поменяй под себя
const reviewImages = Array.from(
  { length: REVIEW_COUNT },
  (_, i) => `assets/reviews/${i + 1}.jpg`,
);

const sliderContainer = document.getElementById("review-slider");
const overlay = document.getElementById("review-overlay");
const overlayImage = document.getElementById("overlay-image");
const overlayClose = document.getElementById("overlay-close");
const overlayPrev = document.getElementById("overlay-prev");
const overlayNext = document.getElementById("overlay-next");
const sliderPrev = document.getElementById("slider-prev");
const sliderNext = document.getElementById("slider-next");

let currentReviewIndex = 0;

function getGapPx(el) {
  const gap = parseFloat(getComputedStyle(el).gap);
  return Number.isFinite(gap) ? gap : 0;
}

function updateSliderArrows() {
  if (!sliderContainer) return;
  const left = sliderContainer.scrollLeft;
  const max = sliderContainer.scrollWidth - sliderContainer.clientWidth;

  if (left <= 4) sliderPrev.classList.add("hidden");
  else sliderPrev.classList.remove("hidden");

  if (left >= max - 4) sliderNext.classList.add("hidden");
  else sliderNext.classList.remove("hidden");
}

function scrollByOneCard(direction) {
  const firstCard = sliderContainer.firstElementChild;
  if (!firstCard) return;

  const gap = getGapPx(sliderContainer);
  const step = firstCard.offsetWidth + gap;

  sliderContainer.scrollBy({ left: direction * step, behavior: "smooth" });
}

function openOverlay(index) {
  currentReviewIndex = index;
  overlayImage.src = reviewImages[currentReviewIndex];
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeOverlay() {
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function navigateOverlay(dir) {
  currentReviewIndex =
    (currentReviewIndex + dir + reviewImages.length) % reviewImages.length;
  overlayImage.src = reviewImages[currentReviewIndex];
}

function buildCard(src, index) {
  const card = document.createElement("div");
  card.className = "review-card";
  card.innerHTML = `
    <img src="${src}" alt="Opinie ${index + 1}" loading="lazy" decoding="async">
    <div class="review-hover-overlay" aria-hidden="true">
      <div class="review-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M15 3H21M21 3V9M21 3L14 10M9 21H3M3 21V15M3 21L10 14"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  `;
  card.addEventListener("click", () => openOverlay(index));
  return card;
}

function loadReviews() {
  if (!sliderContainer) return;

  sliderContainer.innerHTML = "";
  reviewImages.forEach((src, index) =>
    sliderContainer.appendChild(buildCard(src, index)),
  );

  requestAnimationFrame(updateSliderArrows);
  setTimeout(updateSliderArrows, 60);
}

sliderContainer?.addEventListener("scroll", updateSliderArrows, {
  passive: true,
});
window.addEventListener("resize", updateSliderArrows);

sliderPrev?.addEventListener("click", () => scrollByOneCard(-1));
sliderNext?.addEventListener("click", () => scrollByOneCard(1));

overlayClose?.addEventListener("click", closeOverlay);
overlayPrev?.addEventListener("click", () => navigateOverlay(-1));
overlayNext?.addEventListener("click", () => navigateOverlay(1));

overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) closeOverlay();
});

window.addEventListener("keydown", (e) => {
  if (!overlay?.classList.contains("active")) return;
  if (e.key === "Escape") closeOverlay();
  if (e.key === "ArrowLeft") navigateOverlay(-1);
  if (e.key === "ArrowRight") navigateOverlay(1);
});

loadReviews();
// ===== Personal photos block (assets/images/44..53) =====
const photoImages = [
  "assets/images/49.jpg",
  "assets/images/50.jpg",
  "assets/images/48.jpg",
  "assets/images/51.jpg",
  "assets/images/52.jpg",
  "assets/images/53.jpg",
  "assets/images/44.jpg",
  "assets/images/45.jpg",
  "assets/images/46.jpg",
  "assets/images/47.jpg",
];

const photosGrid = document.getElementById("photos-grid");

const photoOverlay = document.getElementById("photo-overlay");
const photoImageEl = document.getElementById("photo-image");
const photoClose = document.getElementById("photo-close");
const photoPrev = document.getElementById("photo-prev");
const photoNext = document.getElementById("photo-next");

let currentPhotoIndex = 0;

function openPhoto(index) {
  currentPhotoIndex = index;
  photoImageEl.src = photoImages[currentPhotoIndex];
  photoOverlay.classList.add("active");
  photoOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePhoto() {
  photoOverlay.classList.remove("active");
  photoOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function navPhoto(dir) {
  currentPhotoIndex =
    (currentPhotoIndex + dir + photoImages.length) % photoImages.length;
  photoImageEl.src = photoImages[currentPhotoIndex];
}

function buildPhotoTile(src, index) {
  const tile = document.createElement("div");

  // “премиальная” раскладка: первые два — большие, остальные — мелкие
  const cls =
    index === 0
      ? "photo-tile is-wide"
      : index === 1
        ? "photo-tile is-tall"
        : "photo-tile is-small";

  tile.className = cls;
  tile.innerHTML = `
    <img src="${src}" alt="Zdjęcie ${index + 1}" loading="lazy" decoding="async">
    <div class="photo-badge" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M15 3H21M21 3V9M21 3L14 10M9 21H3M3 21V15M3 21L10 14"
          stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;
  tile.addEventListener("click", () => openPhoto(index));
  return tile;
}

function mountPhotos() {
  if (!photosGrid) return;
  photosGrid.innerHTML = "";
  photoImages.forEach((src, i) =>
    photosGrid.appendChild(buildPhotoTile(src, i)),
  );
}

photoClose?.addEventListener("click", closePhoto);
photoPrev?.addEventListener("click", () => navPhoto(-1));
photoNext?.addEventListener("click", () => navPhoto(1));

photoOverlay?.addEventListener("click", (e) => {
  if (e.target === photoOverlay) closePhoto();
});

window.addEventListener("keydown", (e) => {
  if (!photoOverlay?.classList.contains("active")) return;
  if (e.key === "Escape") closePhoto();
  if (e.key === "ArrowLeft") navPhoto(-1);
  if (e.key === "ArrowRight") navPhoto(1);
});

mountPhotos();
