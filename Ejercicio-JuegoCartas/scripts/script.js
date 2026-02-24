/* === Lógica del juego de Badugi ====

   CONCEPTOS CLAVE QUE VERÁS AQUÍ:
   ─────────────────────────────────
   1. fetch()       → Llamadas a la API (peticiones HTTP)
   2. async/await   → Manejo de promesas de forma legible
   3. DOM           → Manipulación de elementos HTML con JavaScript
   4. Eventos       → Escuchar clics en botones y cartas

   FLUJO DEL JUEGO:
   ─────────────────
   Nueva Partida
     → Crear mazo (API)
     → Repartir 4 cartas (API)
     → Mostrar cartas en pantalla

   Cambiar Cartas
     → Devolver cartas seleccionadas al mazo (API)
     → Pedir nuevas cartas (API)
     → Actualizar pantalla
     → Evaluar la mano y mostrar resultado
================================================================ */

/* --- CONSTANTES Y ESTADO GLOBAL: Aquí guardamos datos que necesitamos usar en varias funciones. Es como nuestra "memoria de la partida". --- */

// URL base de la API de cartas
const API_BASE = 'https://deckofcardsapi.com/api/deck';

// Estado del juego: un objeto que guarda todo lo que necesitamos saber durante una partida.
let estado = {
  deckId: null,       // ID del mazo que nos da la API (ej: "abc123")
  mano: [],           // Array de objetos carta que tiene el jugador
  seleccionadas: new Set(), // Índices (0-3) de las cartas marcadas para cambiar
  enJuego: false,     // true si hay una partida activa
};


/* --- REFERENCIAS AL DOM: Buscamos los elementos HTML por su "id" y los guardamos en variables para no tener que buscarlos cada vez que los usamos. Es como decirle a JavaScript "guarda esta etiqueta en memoria". --- */
const cardsArea        = document.getElementById('cards-area');        // Zona de cartas
const statusMessage    = document.getElementById('status-message');    // Texto de estado
const resultPanel      = document.getElementById('result-panel');      // Panel de resultado
const selectHint       = document.getElementById('select-hint');       // Pista de selección
const btnNewGame       = document.getElementById('btn-new-game');      // Botón nueva partida
const btnChangeCards   = document.getElementById('btn-change-cards'); // Botón cambiar cartas


/* === FUNCIONES DE LA API === */

/* crearMazo(): Pide a la API que cree y baraje un mazo nuevo de 52 cartas. La API nos devuelve un objeto con un "deck_id" único que usaremos en todas las llamadas siguientes. Retorna: el ID del mazo (string) o lanza un error. */
async function crearMazo() {
  // fetch() hace una petición HTTP GET a la URL indicada.
  // Devuelve una "promesa" que se resuelve cuando llega la respuesta.
  const respuesta = await fetch(`${API_BASE}/new/shuffle/?deck_count=1`);

  // .json() convierte el texto de la respuesta en un objeto JavaScript.
  // También es asíncrono, por eso usamos await.
  const datos = await respuesta.json();

  // Verificamos que la API respondió correctamente
  if (!datos.success) {
    throw new Error('No se pudo crear el mazo');
  }

  // Devolvemos solo el ID del mazo
  return datos.deck_id;
}

/* repartirCartas(deckId, cantidad): Pide a la API que saque "cantidad" cartas del mazo con ID "deckId". La API devuelve un array de objetos carta, cada uno con:
 *   - code:  código de la carta (ej: "AS" = As de Espadas)
 *   - suit:  palo en inglés (SPADES, HEARTS, DIAMONDS, CLUBS)
 *   - value: valor en inglés (ACE, 2, 3, ..., KING)
 *   - image: URL de la imagen de la carta
 *Retorna: array de cartas. */
async function repartirCartas(deckId, cantidad) {
  const respuesta = await fetch(`${API_BASE}/${deckId}/draw/?count=${cantidad}`);
  const datos = await respuesta.json();

  if (!datos.success) {
    throw new Error('No se pudieron repartir las cartas');
  }

  return datos.cards; // Array de objetos carta
}

/* devolverCartas(deckId, codigosCartas): Devuelve las cartas seleccionadas al mazo para luego barajar y volver a repartir. La API necesita los códigos de las cartas separados por comas (ej: "AS,2H,KC"). Retorna: nada relevante (solo confirma que se devolvieron). */
async function devolverCartas(deckId, codigosCartas) {
  // Unimos los códigos con coma para formar la URL
  const codigos = codigosCartas.join(',');
  const respuesta = await fetch(`${API_BASE}/${deckId}/return/?cards=${codigos}`);
  const datos = await respuesta.json();

  if (!datos.success) {
    throw new Error('No se pudieron devolver las cartas');
  }
}

/* barajarMazo(deckId): Le pide a la API que vuelva a barajar solo las cartas que están en el mazo (las que no se repartieron aún). Útil después de devolver cartas seleccionadas. */
async function barajarMazo(deckId) {
  const respuesta = await fetch(`${API_BASE}/${deckId}/shuffle/`);
  const datos = await respuesta.json();

  if (!datos.success) {
    throw new Error('No se pudo barajar el mazo');
  }
}


/* === LÓGICA DEL BADUGI: Aquí implementamos las reglas del juego para evaluar qué tan buena es la mano del jugador. === */
/*evaluarMano(cartas): Determina cuántas cartas forman un Badugi válido.
 * REGLAS DEL BADUGI:
 * - Una mano de Badugi completa tiene 4 cartas.
 * - Cada carta debe tener un PALO diferente.
 * - Cada carta debe tener un VALOR diferente.
 * - Si hay duplicados (mismo palo o mismo valor), esas cartas
 *   no cuentan y se descartan para la evaluación.
 * - Gana quien tenga más cartas válidas (4 > 3 > 2 > 1).
 * - En empate de cantidad, gana la carta más baja.
 * Retorna: objeto con { cantidad, cartas } donde:
 *   - cantidad: número de cartas válidas (1 a 4)
 *   - cartas:   array de las cartas que forman el Badugi */
function evaluarMano(cartas) {
  // Definimos el orden de los valores de menor a mayor.
  // En Badugi el As vale 1 (el más bajo), por eso va primero.
  const ordenValor = ['ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'];

  // Ordenamos las cartas de menor a mayor valor.
  // Esto nos ayuda a quedarnos con las de menor valor cuando hay duplicados.
  const cartasOrdenadas = [...cartas].sort((a, b) => {
    return ordenValor.indexOf(a.value) - ordenValor.indexOf(b.value);
  });

  // Sets (colecciones sin duplicados) para rastrear palos y valores ya usados
  const palosUsados  = new Set();
  const valoresUsados = new Set();

  // Array de cartas que forman el Badugi válido
  const badugui = [];

  // Recorremos las cartas ordenadas e incluimos solo las que son únicas
  for (const carta of cartasOrdenadas) {
    // Si el palo o el valor ya aparecen en nuestra mano, la carta no cuenta
    if (palosUsados.has(carta.suit) || valoresUsados.has(carta.value)) {
      continue; // Saltamos esta carta
    }

    // La carta es válida: la agregamos al Badugi
    badugui.push(carta);
    palosUsados.add(carta.suit);
    valoresUsados.add(carta.value);
  }

  return {
    cantidad: badugui.length,
    cartas: badugui,
  };
}

/* obtenerMensajeResultado(evaluacion): Convierte el resultado de la evaluación en un mensaje legible para el jugador. Retorna: objeto con { texto, clase } para el panel de resultado. */
function obtenerMensajeResultado(evaluacion) {
  const { cantidad, cartas } = evaluacion;

  // Convertimos los valores de las cartas al español para mostrarlos
  const nombresValor = {
    ACE: 'A', '2': '2', '3': '3', '4': '4', '5': '5',
    '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
    JACK: 'J', QUEEN: 'Q', KING: 'K',
  };
  const simboloPalo = {
    SPADES: '♠', HEARTS: '♥', DIAMONDS: '♦', CLUBS: '♣',
  };

  // Construimos la descripción de las cartas válidas
  const descripcion = cartas
    .map(c => `${nombresValor[c.value]}${simboloPalo[c.suit]}`)
    .join('  ');

  // Retornamos mensaje y clase CSS según la cantidad de cartas válidas
  if (cantidad === 4) {
    return {
      texto: `¡BADUGI COMPLETO! Tienes un Badugi de 4 cartas: ${descripcion}`,
      clase: 'result-badugi4',
    };
  } else if (cantidad === 3) {
    return {
      texto: `Badugi de 3 cartas: ${descripcion} — ¡Buen intento! Falta una carta válida.`,
      clase: 'result-badugi3',
    };
  } else if (cantidad === 2) {
    return {
      texto: `Badugi de 2 cartas: ${descripcion} — Necesitas mejorar tu mano.`,
      clase: 'result-badugi2',
    };
  } else {
    return {
      texto: `Solo 1 carta válida: ${descripcion} — Mano muy débil.`,
      clase: 'result-badugi1',
    };
  }
}


/* === FUNCIONES DE INTERFAZ (DOM): Estas funciones se encargan de actualizar lo que el usuario ve.=== */
/* mostrarCargando(texto): Muestra un spinner de carga y un mensaje mientras esperamos la API. */
function mostrarCargando(texto = 'Cargando...') {
  // Actualizamos el mensaje de estado
  statusMessage.innerHTML = texto;

  // Vaciamos el área de cartas y mostramos el spinner
  cardsArea.innerHTML = '<div class="loader"></div>';

  // Deshabilitamos los botones para evitar dobles clics
  btnNewGame.disabled = true;
  btnChangeCards.disabled = true;
}

/* actualizarEstadoUI(texto): Simplemente actualiza el texto del mensaje de estado. */
function actualizarEstadoUI(texto) {
  statusMessage.innerHTML = texto;
}

/* renderizarCartas(): Dibuja las cartas actuales en el área de cartas. Recorre el array "estado.mano" y crea un div por cada carta.
 * Manipulación del DOM:
 * - innerHTML = '' → vacía el contenedor
 * - createElement  → crea un nuevo elemento HTML
 * - classList      → agrega/elimina clases CSS
 * - appendChild    → inserta el elemento en el DOM  */
function renderizarCartas() {
  // Primero vaciamos el área
  cardsArea.innerHTML = '';

  // Recorremos cada carta de la mano del jugador
  estado.mano.forEach((carta, indice) => {
    // Creamos un div para la carta
    const divCarta = document.createElement('div');
    divCarta.classList.add('card');

    // Si esta carta está en el set de seleccionadas, le agregamos la clase CSS
    if (estado.seleccionadas.has(indice)) {
      divCarta.classList.add('selected');
    }

    // Creamos la imagen de la carta con la URL que nos dio la API
    const img = document.createElement('img');
    img.src = carta.image;
    img.alt = `${carta.value} de ${carta.suit}`;

    // Insertamos la imagen dentro del div
    divCarta.appendChild(img);

    // ─── EVENTO DE CLIC ───
    // Cuando el jugador hace clic en una carta, la seleccionamos o deseleccionamos.
    // "indice" aquí es la posición de la carta (0, 1, 2 o 3).
    divCarta.addEventListener('click', () => {
      if (!estado.enJuego) return; // Ignoramos clics si no hay partida

      if (estado.seleccionadas.has(indice)) {
        estado.seleccionadas.delete(indice); // Deseleccionamos
      } else {
        estado.seleccionadas.add(indice);    // Seleccionamos
      }

      // Volvemos a dibujar las cartas para reflejar el cambio
      renderizarCartas();
    });

    // Insertamos el div de la carta en el área de cartas
    cardsArea.appendChild(divCarta);
  });
}

/*mostrarResultado(evaluacion): Muestra el panel de resultado con el mensaje apropiado. */
function mostrarResultado(evaluacion) {
  const { texto, clase } = obtenerMensajeResultado(evaluacion);

  // Limpiamos clases anteriores del panel
  resultPanel.className = 'result-panel';

  // Agregamos la clase de color según el resultado
  resultPanel.classList.add(clase);

  // Insertamos el texto
  resultPanel.innerHTML = texto;

  // Hacemos visible el panel quitando la clase "hidden"
  resultPanel.classList.remove('hidden');
}


/* === FLUJO PRINCIPAL DEL JUEGO === */
/* iniciarNuevaPartida(): Orquesta el inicio del juego:
 * 1. Muestra carga
 * 2. Crea mazo con la API
 * 3. Reparte 4 cartas
 * 4. Actualiza la interfaz */
async function iniciarNuevaPartida() {
  try {
    mostrarCargando('Barajando el mazo...');

    // Ocultamos el panel de resultado de la partida anterior
    resultPanel.classList.add('hidden');

    // PASO 1: Creamos un mazo nuevo con la API
    estado.deckId = await crearMazo();

    actualizarEstadoUI('Repartiendo cartas...');

    // PASO 2: Pedimos 4 cartas al mazo recién creado
    estado.mano = await repartirCartas(estado.deckId, 4);

    // PASO 3: Limpiamos las cartas seleccionadas de partidas anteriores
    estado.seleccionadas.clear();

    // PASO 4: Marcamos que hay partida activa
    estado.enJuego = true;

    // PASO 5: Dibujamos las cartas en pantalla
    renderizarCartas();

    // PASO 6: Actualizamos la interfaz
    actualizarEstadoUI('Selecciona las cartas que quieras cambiar.');
    selectHint.classList.remove('hidden');   // Mostramos la pista

    // Habilitamos el botón de cambio y actualizamos el de nueva partida
    btnNewGame.disabled = false;
    btnNewGame.textContent = 'Nueva Partida';
    btnChangeCards.disabled = false;

  } catch (error) {
    // Si algo falla (sin internet, API caída, etc.) mostramos el error
    console.error('Error al iniciar la partida:', error);
    actualizarEstadoUI(`Error: ${error.message}. Comprueba tu conexión e inténtalo de nuevo.`);
    cardsArea.innerHTML = '';
    btnNewGame.disabled = false;
  }
}

/* cambiarCartasSeleccionadas(): Orquesta el cambio de cartas:
 * 1. Identifica las cartas seleccionadas
 * 2. Las devuelve al mazo
 * 3. Baraja el mazo
 * 4. Pide nuevas cartas en su lugar
 * 5. Evalúa la mano y muestra resultado */
async function cambiarCartasSeleccionadas() {
  try {
    // Si no hay cartas seleccionadas, solo evaluamos la mano actual
    if (estado.seleccionadas.size === 0) {
      const evaluacion = evaluarMano(estado.mano);
      mostrarResultado(evaluacion);
      actualizarEstadoUI('Mano evaluada. Pulsa "Nueva Partida" para volver a jugar.');
      btnChangeCards.disabled = true;
      estado.enJuego = false;
      return;
    }

    mostrarCargando('Cambiando cartas...');

    // PASO 1: Identificamos las cartas a devolver por su código (ej: "AS")
    const cartasADevolver = [];
    const indicesAReemplazar = [];

    estado.seleccionadas.forEach(indice => {
      cartasADevolver.push(estado.mano[indice].code);
      indicesAReemplazar.push(indice);
    });

    // PASO 2: Devolvemos las cartas al mazo
    await devolverCartas(estado.deckId, cartasADevolver);

    // PASO 3: Barajamos para que las cartas devueltas entren aleatoriamente
    await barajarMazo(estado.deckId);

    // PASO 4: Pedimos el mismo número de cartas que devolvimos
    const nuevasCartas = await repartirCartas(estado.deckId, cartasADevolver.length);

    // PASO 5: Reemplazamos las cartas en la mano del jugador
    // Recorremos los índices que había que reemplazar y asignamos las nuevas cartas
    indicesAReemplazar.forEach((indice, i) => {
      estado.mano[indice] = nuevasCartas[i];
    });

    // PASO 6: Limpiamos la selección
    estado.seleccionadas.clear();

    // PASO 7: Evaluamos la mano resultante
    const evaluacion = evaluarMano(estado.mano);

    // PASO 8: Actualizamos la interfaz
    estado.enJuego = false; // La partida terminó (en Badugi básico solo hay un cambio)
    renderizarCartas();
    mostrarResultado(evaluacion);
    actualizarEstadoUI('Partida terminada. Pulsa "Nueva Partida" para volver a jugar.');

    // Mostramos el botón de nueva partida y deshabilitamos el de cambio
    btnNewGame.disabled = false;
    btnChangeCards.disabled = true;
    selectHint.classList.add('hidden');

  } catch (error) {
    console.error('Error al cambiar cartas:', error);
    actualizarEstadoUI(`Error: ${error.message}. Comprueba tu conexión e inténtalo de nuevo.`);
    // Restauramos los botones para que el usuario pueda reintentar
    btnNewGame.disabled = false;
    btnChangeCards.disabled = false;
    renderizarCartas(); // Volvemos a mostrar las cartas actuales
  }
}


/* === EVENTOS DE LOS BOTONES: "addEventListener" escucha un evento (aquí 'click') y ejecuta una función cuando ocurre.  === */

// Clic en "Nueva Partida" → llama a la función iniciarNuevaPartida
btnNewGame.addEventListener('click', iniciarNuevaPartida);

// Clic en "Cambiar Cartas" → llama a la función cambiarCartasSeleccionadas
btnChangeCards.addEventListener('click', cambiarCartasSeleccionadas);


/* === INICIALIZACIÓN: Este código se ejecuta inmediatamente cuando se carga el script.
   No hacemos nada automáticamente: esperamos a que el usuario
   pulse "Nueva Partida". ==== */
console.log('Badugi cargado. ¡Pulsa "Nueva Partida" para comenzar!');