/**
 * CONFIGURACIÓN Y ESTADO
 */
const API_KEY = "lGP8nF5mFwykQfPIL2cD24QuGxDPGTe6hfWNhq1D";
const BASE_URL = "https://api.nasa.gov/planetary/apod";
const gallery = document.getElementById("gallery");
const statusContainer = document.getElementById("statusContainer");
const heroSection = document.getElementById("heroSection");

// Restringir fecha máxima a hoy
const todayStr = new Date().toISOString().split("T")[0];
document.getElementById("start").max = todayStr;
document.getElementById("end").max = todayStr;

// Variables de estado para filtros y búsqueda
let currentItems = [];
let activeFilter = 'all';
let searchTerm = '';

/**
 * SERVICIOS (LÓGICA DE DATOS)
 */
async function apiCall(params = "") {
    showLoading(true);
    try {
        const response = await fetch(`${BASE_URL}?api_key=${API_KEY}${params}`);
        if (!response.ok) throw new Error("Error en la respuesta de la NASA");
        const data = await response.json();
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        showToast("🚀 Error de conexión");
        console.error(error);
        return [];
    } finally {
        showLoading(false);
    }
}

/**
 * UI HELPERS
 */
function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
}

function showLoading(isLoading) {
    // CAMBIO 2: Loader más atractivo con spinner
    statusContainer.innerHTML = isLoading ? 
        '<div class="loader"><div class="spinner"></div><span style="color:var(--primary)">Sincronizando con satélites...</span></div>' : 
        '';
}

function renderGallery(items) {
    gallery.innerHTML = "";
    if (items.length === 0) {
        gallery.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>No se encontraron imágenes en este sector.</p>";
        return;
    }
    // Guardamos los items actuales (sin filtrar)
    currentItems = items;
    applyFilterAndSearch();
}

// CAMBIO 1: Filtrar por tipo de contenido
function applyFilter() {
    let filtered = currentItems;
    if (activeFilter === 'image') {
        filtered = currentItems.filter(item => item.media_type === 'image');
    } else if (activeFilter === 'video') {
        filtered = currentItems.filter(item => item.media_type === 'video');
    }
    // Actualizar el estado activo de los botones
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === activeFilter);
    });
    return filtered;
}

// CAMBIO 3: Filtrar por búsqueda y resaltar coincidencias
function applySearch(items) {
    if (!searchTerm.trim()) return items;
    
    const term = searchTerm.toLowerCase().trim();
    return items.filter(item => 
        item.title.toLowerCase().includes(term) || 
        (item.explanation && item.explanation.toLowerCase().includes(term))
    );
}

// CAMBIO 3: Resaltar texto en título
function highlightText(text, term) {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Función combinada para aplicar filtro y búsqueda
function applyFilterAndSearch() {
    let items = applyFilter();
    items = applySearch(items);
    
    gallery.innerHTML = "";
    if (items.length === 0) {
        gallery.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>No se encontraron resultados.</p>";
        return;
    }
    items.forEach(createCard);
}

/**
 * COMPONENTES
 */
function createCard(data) {
    const card = document.createElement("div");
    card.className = "card";
    
    // CAMBIO 1: Soporte para videos con thumbnails
    const mediaUrl = data.media_type === 'video' ? data.thumbnail_url : data.url;
    
    // CAMBIO 3: Resaltar título si hay búsqueda activa
    const highlightedTitle = searchTerm ? highlightText(data.title, searchTerm) : data.title;
    
    card.innerHTML = `
        <div class="card-img-container">
            <img src="${mediaUrl}" alt="${data.title}" loading="lazy">
        </div>
        <div class="card-content">
            <small>${data.date}</small>
            <h3>${highlightedTitle}</h3>
        </div>
    `;
    card.onclick = () => {
        // CAMBIO 3: Cambiar fondo dinámico del hero
        heroSection.style.backgroundImage = `linear-gradient(rgba(5, 7, 10, 0.7), rgba(5, 7, 10, 0.7)), url('${mediaUrl}')`;
        openModal(data);
    };
    gallery.appendChild(card);
}

function openModal(data) {
    const isFavorite = checkIfFavorite(data.date);
    // CAMBIO 1: Mostrar iframe en modal si es video
    const mediaContent = data.media_type === 'video' 
        ? `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`
        : `<img src="${data.hdurl || data.url}" alt="${data.title}">`;
    
    document.getElementById("modalBody").innerHTML = `
        <small style="color:var(--primary)">${data.date}</small>
        <h2 style="margin:10px 0">${data.title}</h2>
        ${mediaContent}
        <p style="line-height:1.6; color:#cbd5e1; margin-bottom:20px">${data.explanation}</p>
        
        <div style="display:flex; gap:10px">
            <button class="btn" style="background:${isFavorite ? '#ef4444':'#22c55e'}; color:white" 
                onclick='toggleFavorite(${JSON.stringify(data).replace(/'/g, "&apos;")})'>
                ${isFavorite ? '🗑️ Eliminar de Favoritos' : '❤️ Guardar en Favoritos'}
            </button>
            ${data.media_type === 'image' ? 
                `<a href="${data.hdurl || data.url}" target="_blank" class="btn" style="background:#334155; color:white; text-decoration:none">
                    📥 Descargar HD
                </a>` : 
                `<a href="${data.url}" target="_blank" class="btn" style="background:#334155; color:white; text-decoration:none">
                    🎬 Ver en YouTube
                </a>`
            }
        </div>
    `;
    document.getElementById("modal").classList.add("active");
}

function closeModal() {
    document.getElementById("modal").classList.remove("active");
}

/**
 * GESTIÓN DE FAVORITOS (LOCALSTORAGE)
 */
function getFavorites() {
    return JSON.parse(localStorage.getItem("nasa_favs")) || [];
}

function checkIfFavorite(date) {
    return getFavorites().some(f => f.date === date);
}

function toggleFavorite(data) {
    let favs = getFavorites();
    const index = favs.findIndex(f => f.date === data.date);

    if (index === -1) {
        favs.push(data);
        showToast("Guardado en favoritos 🚀");
    } else {
        favs.splice(index, 1);
        showToast("Eliminado de favoritos");
    }

    localStorage.setItem("nasa_favs", JSON.stringify(favs));
    closeModal();
    // Si estábamos viendo favoritos, refrescar la vista
    if (gallery.dataset.view === "favorites") showFavorites();
}

function showFavorites() {
    gallery.dataset.view = "favorites";
    const favs = getFavorites();
    renderGallery(favs);
}

/**
 * ACCIONES PRINCIPALES
 */
async function loadToday() {
    gallery.dataset.view = "all";
    const data = await apiCall();
    renderGallery(data);
}

async function loadRange() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    
    if (!start || !end) return showToast("Faltan fechas");
    if (start > end) return showToast("Fecha inicio mayor a fin");

    gallery.dataset.view = "all";
    const data = await apiCall(`&start_date=${start}&end_date=${end}`);
    renderGallery(data.reverse());
}

// CAMBIO 2: Modo Aleatorio Avanzado
async function loadRandom() {
    gallery.dataset.view = "all";
    const data = await apiCall(`&count=5&thumbs=true`); // Pedimos 5 aleatorias con thumbs
    renderGallery(data);
}

// CAMBIO 1: Eventos para filtros
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        activeFilter = e.target.dataset.filter;
        applyFilterAndSearch();
    });
});

// CAMBIO 3: Evento para búsqueda en tiempo real
document.getElementById('searchInput').addEventListener('input', (e) => {
    searchTerm = e.target.value;
    applyFilterAndSearch();
});

// Carga inicial
loadToday();