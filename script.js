let currentTrailer = "";
let currentFilter = "all";


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

        if (currentFilter === "actor") {
            target = actor;
        } 
        else if (currentFilter === "country") {
            target = country;
        } 
        else if (currentFilter === "year") {
            target = year;
        } 
        else {
            // default = search semua (judul + actor + dll)
            target = `${title} ${actor} ${country} ${year}`;
        }

        const match = target.includes(keyword);
        card.classList.toggle("hide", !match);
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

        if (cardTop < windowHeight - 50) {
            card.classList.add("show");
        }
    });
}

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);

/* =========================
   FAVORITE BUTTON
========================= */
function toggleFav(btn) {
    if (!btn) return;

    btn.innerText = btn.innerText === "🤍" ? "❤️" : "🤍";
}

/* =========================
   CARD RENDER (DATA.JS)
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

                <img src="${item.poster}">

                <div class="rating">⭐ ${item.rating}</div>

                ${item.season ? `
                    <div class="season-badge">${item.season}</div>
                ` : ""}

                ${index !== undefined ? `
                    <div class="badge">#${index + 1}</div>
                ` : ""}

            </div>

            <p class="genre">${item.genre}</p>
            <h3 class="title">${item.title}</h3>

        </div>
    `;
}


/* =========================
   RENDER MOVIE / SERIES / HOME
========================= */
function render(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

	const filtered = media.filter(item =>
    item.type === type &&
    item.genre &&
    item.genre.toLowerCase().split(",").map(g => g.trim()).includes(genre.toLowerCase())
);


    container.innerHTML = filtered.map(cardHTML).join("");

    reveal();
}
function renderTopRated(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const sorted = media
        .filter(item => item.type === type)
        .sort((a, b) => b.rating - a.rating);

    container.innerHTML = sorted
        .map((item, index) => cardHTML(item, index))
        .join("");

    reveal();
}
function convertToEmbed(url) {
    if (url.includes("youtu.be")) {
        return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    if (url.includes("watch?v=")) {
        return url.replace("watch?v=", "embed/");
    }
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
   INIT PAGE
========================= */
window.addEventListener("DOMContentLoaded", () => {

    // CATEGORY MOVIES
    if (document.getElementById("actionMovies")) {
        renderByGenre("movie", "Action", "actionMovies");
    }

    if (document.getElementById("romanceMovies")) {
        renderByGenre("movie", "Romance", "romanceMovies");
    }

    if (document.getElementById("animationMovies")) {
        renderByGenre("movie", "Animation", "animationMovies");
    }
	if (document.getElementById("horrorMovies")) {
        renderByGenre("movie", "Horror", "horrorMovies");
    }
	if (document.getElementById("comedyMovies")) {
    renderByGenre("movie", "Comedy", "comedyMovies");
	}


	// CATEGORY SERIES
    if (document.getElementById("actionSeries")) {
    renderByGenre("series", "Action", "actionSeries");
	}

	if (document.getElementById("romanceSeries")) {
    renderByGenre("series", "Romance", "romanceSeries");
	}

	if (document.getElementById("animationSeries")) {
    renderByGenre("series", "Animation", "animationSeries");
	}
	if (document.getElementById("horrorSeries")) {
    renderByGenre("series", "Horror", "horrorSeries");
	}
	if (document.getElementById("comedySeries")) {
    renderByGenre("series", "Comedy", "comedySeries");
	}
	if (document.getElementById("thrillerSeries")) {
    renderByGenre("series", "Thriller", "thrillerSeries");
	}




    // TOP RATED MOVIES
    if (document.getElementById("topRatedMovies")) {
        renderTopRated("movie", "topRatedMovies");
    }

    // TOP RATED SERIES
    if (document.getElementById("topRatedSeries")) {
        renderTopRated("series", "topRatedSeries");
    }

    reveal();
});


function openDetail(id) {
    const item = media.find(m => m.id === id);

    document.getElementById("mPoster").src = item.poster;
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
function renderByGenre(type, genre, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = media
        .filter(item => {
            if (!item.genre) return false;

            // ambil genre pertama
            const primary = item.genre.split(",")[0].trim().toLowerCase();

            return item.type === type &&
                   primary === genre.toLowerCase();
        })
        .sort((a, b) => b.rating - a.rating);

    container.innerHTML = filtered.map(cardHTML).join("");
    reveal();
}








