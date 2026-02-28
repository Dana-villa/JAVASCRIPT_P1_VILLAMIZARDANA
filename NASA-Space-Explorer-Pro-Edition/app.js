// CAMBIO: Se añade actualización de fondo del hero al abrir modal.
// Se mantienen todas las funciones originales: fetch, filtros, búsqueda, favoritos, etc.

// Configuración API
const API_KEY = 'lGP8nF5mFwykQfPIL2cD24QuGxDPGTe6hfWNhq1D';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

// Elementos del DOM
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');
const toast = document.getElementById('toast');
const loader = document.getElementById('loader');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const rangeSearchBtn = document.getElementById('rangeSearchBtn');
const todayBtn = document.getElementById('todayBtn');
const randomBtn = document.getElementById('randomBtn');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const favoritesBtn = document.getElementById('favoritesBtn');
const heroSection = document.getElementById('heroSection'); // CAMBIO: Para actualizar fondo

// Estado
let allItems = [];           // Todos los elementos obtenidos
let filteredItems = [];       // Después de filtro y búsqueda
let favorites = JSON.parse(localStorage.getItem('apodFavorites')) || [];
let currentFilter = 'all';
let searchTerm = '';

// Inicializar fechas con hoy y hace 7 días (para rango por defecto)
const today = new Date().toISOString().split('T')[0];
const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
startDate.value = lastWeek;
endDate.value = today;

// Mostrar/ocultar loader
function showLoader(show) {
    loader.style.display = show ? 'flex' : 'none';
}

// Mostrar toast
function showToast(message, isSuccess = true) {
    toast.style.display = 'flex';
    toast.textContent = message;
    toast.style.borderLeftColor = isSuccess ? '#00f2fe' : '#ff6ec7';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Actualizar fondo del hero con la imagen de la APOD seleccionada
function updateHeroBackground(imageUrl) {
    if (imageUrl) {
        // Cambiamos el background-image del hero (manteniendo overlay oscuro)
        heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${imageUrl}')`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
    } else {
        // Vuelve al estilo por defecto (transparente con blur)
        heroSection.style.backgroundImage = 'none';
    }
}

// Llamada a la API para un rango de fechas
async function fetchAPODRange(start, end) {
    try {
        showLoader(true);
        const url = `${BASE_URL}?api_key=${API_KEY}&start_date=${start}&end_date=${end}&thumbs=true`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la respuesta de NASA');
        const data = await response.json();
        // Invertir para mostrar más reciente primero
        allItems = data.reverse();
        applyFiltersAndRender();
        showToast('Rango cargado correctamente');
    } catch (error) {
        console.error(error);
        showToast('🚀 Error al cargar datos', false);
    } finally {
        showLoader(false);
    }
}

// Obtener APOD de hoy
async function fetchToday() {
    try {
        showLoader(true);
        const url = `${BASE_URL}?api_key=${API_KEY}&date=${today}&thumbs=true`;
        const response = await fetch(url);
        if (!response.ok) throw new Error();
        const data = await response.json();
        allItems = [data];
        applyFiltersAndRender();
        showToast('Imagen del día cargada');
    } catch (error) {
        showToast('🚀 Error al cargar hoy', false);
    } finally {
        showLoader(false);
    }
}

// Obtener una fecha aleatoria (dentro de los años APOD)
async function fetchRandom() {
    try {
        showLoader(true);
        // Generar fecha aleatoria entre 1995-06-16 y hoy
        const start = new Date('1995-06-16').getTime();
        const end = new Date().getTime();
        const randomTime = start + Math.random() * (end - start);
        const randomDate = new Date(randomTime).toISOString().split('T')[0];
        const url = `${BASE_URL}?api_key=${API_KEY}&date=${randomDate}&thumbs=true`;
        const response = await fetch(url);
        if (!response.ok) throw new Error();
        const data = await response.json();
        allItems = [data];
        applyFiltersAndRender();
        showToast('Universo aleatorio explorado');
    } catch (error) {
        showToast('🚀 Error en aleatorio', false);
    } finally {
        showLoader(false);
    }
}

// Aplicar filtros y búsqueda, luego renderizar
function applyFiltersAndRender() {
    // Primero filtro por tipo
    let filtered = allItems.filter(item => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'image') return item.media_type === 'image';
        if (currentFilter === 'video') return item.media_type === 'video';
        return true;
    });

    // Luego filtro por búsqueda en título o explicación
    if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
            (item.title && item.title.toLowerCase().includes(term)) || 
            (item.explanation && item.explanation.toLowerCase().includes(term))
        );
    }

    filteredItems = filtered;
    renderGallery(filteredItems);
}

// Renderizar galería
function renderGallery(items) {
    if (!items.length) {
        gallery.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:50px;">No se encontraron elementos</p>';
        return;
    }

    gallery.innerHTML = items.map(item => {
        const mediaUrl = item.media_type === 'image' ? item.url : (item.thumbnail_url || item.url);
        return `
            <div class="card" data-date="${item.date}">
                <img class="card-image" src="${mediaUrl}" alt="${item.title}" loading="lazy">
                <div class="card-content">
                    <div class="card-date">${item.date}</div>
                    <div class="card-title">${item.title}</div>
                </div>
            </div>
        `;
    }).join('');

    // Añadir event listeners a cada tarjeta
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const date = card.dataset.date;
            const item = allItems.find(i => i.date === date);
            if (item) openModal(item);
        });
    });
}

// Abrir modal con detalle
function openModal(item) {
    // CAMBIO: Actualizar fondo del hero con la imagen del ítem
    if (item.media_type === 'image') {
        updateHeroBackground(item.url);
    } else if (item.thumbnail_url) {
        updateHeroBackground(item.thumbnail_url);
    } else {
        updateHeroBackground(null);
    }

    const isFavorite = favorites.some(fav => fav.date === item.date);
    const mediaHtml = item.media_type === 'image' 
        ? `<img src="${item.hdurl || item.url}" class="modal-media" alt="${item.title}">`
        : `<iframe class="modal-media" height="400" src="${item.url}" frameborder="0" allowfullscreen></iframe>`;

    const favoriteIcon = isFavorite ? 'fas fa-star' : 'far fa-star';
    modalBody.innerHTML = `
        <h2>${item.title}</h2>
        <p><strong>${item.date}</strong></p>
        ${mediaHtml}
        <p>${item.explanation}</p>
        <div class="modal-actions">
            <button class="btn btn-primary" id="modalFavoriteBtn"><i class="${favoriteIcon}"></i> ${isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}</button>
            ${item.media_type === 'image' && item.hdurl ? `<a href="${item.hdurl}" target="_blank" class="btn btn-outline"><i class="fas fa-download"></i> Descargar HD</a>` : ''}
            ${item.media_type === 'video' ? `<a href="${item.url}" target="_blank" class="btn btn-outline"><i class="fab fa-youtube"></i> Ver en YouTube</a>` : ''}
        </div>
    `;

    modal.style.display = 'flex';

    // Botón de favoritos dentro del modal
    document.getElementById('modalFavoriteBtn').addEventListener('click', () => toggleFavorite(item));
}

// Cerrar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    // Opcional: restaurar fondo del hero al cerrar? Lo dejamos como estaba.
});

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Gestionar favoritos
function toggleFavorite(item) {
    const index = favorites.findIndex(fav => fav.date === item.date);
    if (index === -1) {
        favorites.push(item);
        showToast('Añadido a favoritos ❤️');
    } else {
        favorites.splice(index, 1);
        showToast('🗑️ Eliminado de favoritos');
    }
    localStorage.setItem('apodFavorites', JSON.stringify(favorites));
    // Si el modal está abierto, actualizamos el icono
    if (modal.style.display === 'flex') {
        const btn = document.getElementById('modalFavoriteBtn');
        if (btn) {
            const isFav = favorites.some(fav => fav.date === item.date);
            btn.innerHTML = `<i class="${isFav ? 'fas fa-star' : 'far fa-star'}"></i> ${isFav ? '🗑️ Quitar de favoritos' : 'Añadir a favoritos ❤️'}`;
        }
    }
}

// Mostrar favoritos (puede abrir modal con lista, por simplicidad cargamos grid)
function showFavorites() {
    allItems = [...favorites];
    applyFiltersAndRender();
    showToast('Mostrando favoritos ❤️');
}

// Event listeners
rangeSearchBtn.addEventListener('click', () => {
    if (startDate.value && endDate.value) {
        fetchAPODRange(startDate.value, endDate.value);
    } else {
        showToast('Selecciona ambas fechas', false);
    }
});

todayBtn.addEventListener('click', fetchToday);
randomBtn.addEventListener('click', fetchRandom);

searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    applyFiltersAndRender();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        applyFiltersAndRender();
    });
});

favoritesBtn.addEventListener('click', showFavorites);

// Cargar datos iniciales (últimos 7 días)
fetchAPODRange(lastWeek, today);

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.style.display = 'none';
});