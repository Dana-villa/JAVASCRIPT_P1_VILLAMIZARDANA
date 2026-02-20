// Elementos del DOM
const imagenPokemon = document.getElementById('sprite-pokemon');
const textoNombre = document.getElementById('nombre-pokemon');
const entradaBusqueda = document.getElementById('campo-busqueda');
const botonAnterior = document.getElementById('boton-prev');
const botonSiguiente = document.getElementById('boton-next');

// Pokémon inicial (474 = Porygon-Z)
let idActual = 474;

// Función para capitalizar nombres con guiones (ej. "giratina-altered")
function capitalizar(texto) {
    return texto
        .split('-')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join('-');
}

// Función asíncrona que obtiene los datos de la API
async function cargarPokemon(identificador) {
    // Mostrar estado de carga
    textoNombre.textContent = 'Loading...';
    imagenPokemon.src = '';
    imagenPokemon.alt = '';
    imagenPokemon.style.width = '0';
    imagenPokemon.style.height = '0';

    // Controlador para abortar la petición después de 1.5s
    const controlador = new AbortController();
    const timeout = setTimeout(() => controlador.abort(), 1500);

    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${identificador}`, {
            signal: controlador.signal
        });
        clearTimeout(timeout);

        if (!respuesta.ok) {
            throw new Error('#??? - ERROR. Not Found');
        }

        const datos = await respuesta.json();
        idActual = datos.id;

        const nombreCapitalizado = capitalizar(datos.name);
        // Formato: "id - Nombre" con span para el nombre
        textoNombre.innerHTML = `${datos.id} - <span>${nombreCapitalizado}</span>`;

        // Obtener sprite animado si existe, si no, el normal
        const spriteAnimado = datos.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default;
        imagenPokemon.src = spriteAnimado || datos.sprites.front_default || './images/missingno.png';
        imagenPokemon.alt = datos.name || 'MissingNo';

        // Ajustar tamaño para MissingNo
        if (imagenPokemon.src.includes('missingno.png')) {
            imagenPokemon.style.width = '64px';
            imagenPokemon.style.height = '64px';
        } else {
            imagenPokemon.style.width = '';
            imagenPokemon.style.height = '';
        }

    } catch (error) {
        clearTimeout(timeout);
        textoNombre.textContent = '#??? - ERROR. Not Found';
        imagenPokemon.src = './images/missingno.png';
        imagenPokemon.alt = 'MissingNo';
        imagenPokemon.style.width = '64px';
        imagenPokemon.style.height = '64px';
        console.error(error);
    }
}

// Evento para buscar al presionar Enter
entradaBusqueda.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const valor = entradaBusqueda.value.trim().toLowerCase();
        if (valor !== '') {
            cargarPokemon(valor);
            entradaBusqueda.value = '';
        }
    }
});

// Botón anterior
botonAnterior.addEventListener('click', () => {
    if (idActual > 1) {
        idActual--;
        cargarPokemon(idActual);
    }
});

// Botón siguiente
botonSiguiente.addEventListener('click', () => {
    idActual++;
    cargarPokemon(idActual);
});

// Cargar el Pokémon inicial
cargarPokemon(idActual);