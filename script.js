let currentTrailer = "";
let currentFilter = "all";
let heroInterval = null;
let heroIndex = 0;
let heroItems = [];
 
/* =========================
   SEARCH FUNCTION
========================= */
function searchMedia() {
    const input = document.getElementById("searchInput");
    if (!input) return;
    const keyword = input.value.toLowerCase();
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const title = (card.dataset.title || "").toLowerCase();
        const actor = (card.dataset.actor || "").toLowerCase();
        const country = (card.dataset.country || "").toLowerCase();
        const year = (card.dataset.year || "").toLowerCase();
        let target = "";
        if (currentFilter === "actor") target = actor;
        else if (currentFilter === "country") target = country;
        else if (currentFilter === "year") target = year;
        else target = `${title} ${actor} ${country} ${year}`;
        card.classList.toggle("hide", !target.includes(keyword));
    });
}
 
/* =========================
   FILTER MENU
========================= */
function toggleFilterMenu() {
    const menu = document.getElementById("filterMenu");
    menu.classList.toggle("show");
}
 
function setFilter(type) {
    currentFilter = type;
    const menu = document.getElementById("filterMenu");
    if (menu) menu.classList.remove("show");
    const input = document.getElementById("searchInput");
    if (input) input.focus();
    searchMedia();
}
 
/* =========================
   REVEAL ANIMATION
========================= */
function reveal() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const windowHeight = window.innerHeight;
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < windowHeight - 50) card.classList.add("show");
    });
}
 
window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);
 
/* =========================
   HERO BANNER
========================= */
function buildHero() {
    const banner = document.getElementById("heroBanner");
    if (!banner) return;
 
    heroItems = media.filter(m => m.featured === true).slice(0, 6);
    if (heroItems.length === 0) return;
 
    // buat slides
    let slidesHTML = heroItems.map((item, i) => `
        <div class="hero-slide ${i === 0 ? 'active' : ''}" onclick="openDetail(${item.id})">
            <img src="${item.poster}" alt="${item.title}">
            <div class="hero-overlay"></div>
            <div class="hero-info">
                <span class="hero-badge">${item.type === 'movie' ? '🎬 Movie' : '📺 Series'}</span>
                <h2 class="hero-title">${item.title}</h2>
                <div class="hero-meta">
                    <span class="hero-rating">⭐ ${item.rating}</span>
                    <span>${item.year}</span>
                    <span>${item.country}</span>
                    <span>${item.genre.split(',')[0].trim()}</span>
                </div>
                <p class="hero-desc">${item.description}</p>
                <button class="hero-btn" onclick="event.stopPropagation(); openDetail(${item.id})">▶ Lihat Detail</button>
            </div>
        </div>
    `).join('');
 
    // buat dots
    let dotsHTML = `<div class="hero-dots">` +
        heroItems.map((_, i) => `<button class="hero-dot ${i === 0 ? 'active' : ''}" onclick="event.stopPropagation(); goToSlide(${i})"></button>`).join('') +
        `</div>`;
 
    banner.innerHTML = slidesHTML + dotsHTML;
 
    // auto rotate setiap 5 detik
    heroInterval = setInterval(() => {
        heroIndex = (heroIndex + 1) % heroItems.length;
        goToSlide(heroIndex);
    }, 5000);
}
 
function goToSlide(index) {
    heroIndex = index;
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-dot");
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
}
 
/* =========================
   CARD RENDER
========================= */
function cardHTML(item, index) {
    return `
        <div class="card"
            data-title="${item.title}"
            data-actor="${item.actor}"
            data-country="${item.country}"
            data-year="${item.year}"
            onclick="openDetail(${item.id})">
            <div class="poster">
                <img src="${item.poster}" alt="${item.title}">
                <div class="rating">⭐ ${item.rating}</div>
                ${item.season ? `<div class="season-badge">${item.season}</div>` : ""}
                ${index !== undefined ? `<div class="badge">#${index + 1}</div>` : ""}
            </div>
            <div class="card-info">
                <p class="genre">${item.genre}</p>
                <h3 class="title">${item.title}</h3>
            </div>
        </div>
    `;
}
 
/* =========================
   RENDER FUNCTIONS
========================= */
function renderTopRated(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const sorted = media.filter(item => item.type === type).sort((a, b) => b.rating - a.rating);
    container.innerHTML = sorted.map((item, index) => cardHTML(item, index)).join("");
    reveal();
}
 
function renderByGenre(type, genre, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const filtered = media
        .filter(item => {
            if (!item.genre) return false;
            const primary = item.genre.split(",")[0].trim().toLowerCase();
            return item.type === type && primary === genre.toLowerCase();
        })
        .sort((a, b) => b.rating - a.rating);
    container.innerHTML = filtered.map(cardHTML).join("");
    reveal();
}
 
/* =========================
   TRAILER
========================= */
function convertToEmbed(url) {
    if (url.includes("youtu.be")) return url.replace("youtu.be/", "www.youtube.com/embed/").split("?")[0];
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/").split("&")[0];
    return url;
}
 
function playTrailer() {
    const video = document.getElementById("mVideo");
    const poster = document.getElementById("mPoster");
    video.src = currentTrailer;
    video.style.display = "block";
    poster.style.display = "none";
}
 
/* =========================
   MODAL
========================= */
function openDetail(id) {
    const item = media.find(m => m.id === id);
    if (!item) return;
    document.getElementById("mPoster").src = item.poster;
    document.getElementById("mPoster").style.display = "block";
    document.getElementById("mTitle").innerText = item.title;
    document.getElementById("mDesc").innerText = item.description;
    document.getElementById("mActor").innerText = "👤 " + item.actor;
    document.getElementById("mYear").innerText = item.year;
    document.getElementById("mGenre").innerText = item.genre;
    document.getElementById("mRating").innerText = "⭐ " + item.rating;
    document.getElementById("mCountry").innerText = item.country;
    currentTrailer = convertToEmbed(item.trailer);
    document.getElementById("modal").style.display = "flex";
}
 
function closeDetail() {
    document.getElementById("modal").style.display = "none";
    const video = document.getElementById("mVideo");
    video.src = "";
    video.style.display = "none";
    document.getElementById("mPoster").style.display = "block";
}
 
/* =========================
   INIT PAGE
========================= */
window.addEventListener("DOMContentLoaded", () => {
    // Hero banner (hanya di index)
    buildHero();
 
    // Movies
    if (document.getElementById("actionMovies")) renderByGenre("movie", "Action", "actionMovies");
    if (document.getElementById("romanceMovies")) renderByGenre("movie", "Romance", "romanceMovies");
    if (document.getElementById("animationMovies")) renderByGenre("movie", "Animation", "animationMovies");
    if (document.getElementById("horrorMovies")) renderByGenre("movie", "Horror", "horrorMovies");
    if (document.getElementById("comedyMovies")) renderByGenre("movie", "Comedy", "comedyMovies");
 
    // Series
    if (document.getElementById("actionSeries")) renderByGenre("series", "Action", "actionSeries");
    if (document.getElementById("romanceSeries")) renderByGenre("series", "Romance", "romanceSeries");
    if (document.getElementById("animationSeries")) renderByGenre("series", "Animation", "animationSeries");
    if (document.getElementById("horrorSeries")) renderByGenre("series", "Horror", "horrorSeries");
    if (document.getElementById("comedySeries")) renderByGenre("series", "Comedy", "comedySeries");
    if (document.getElementById("thrillerSeries")) renderByGenre("series", "Thriller", "thrillerSeries");
 
    // Top Rated
    if (document.getElementById("topRatedMovies")) renderTopRated("movie", "topRatedMovies");
    if (document.getElementById("topRatedSeries")) renderTopRated("series", "topRatedSeries");
 
    reveal();
})
