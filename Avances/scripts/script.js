/*=== Programa: CampusLands ERP - Sistema de Gestión Académica ===
  
  Este programa te mostrará menús usando ventanas emergentes (prompt).
  Los listados y reportes aparecerán en la consola del navegador.
  
  ¡IMPORTANTE! Abre la consola antes de empezar para ver todos los reportes. ===*/

// === Sección 1: Datos iniciales del sistema ===

// Aquí guardamos toda la información del programa en "arreglos" (listas).
// Un arreglo es como una lista de elementos que podemos guardar en una variable.
// Por ejemplo: listaDeNumeros = [1, 2, 3, 4]
// Un "objeto" es como una ficha con varios datos relacionados.
// Por ejemplo: persona = { nombre: "Juan", edad: 25 }

// --- Arreglo de Campers (ESTUDIANTES) ---
// Cada camper (estudiante) es un objeto con su información personal
let campers = [
    // Aquí empezamos con un camper de ejemplo para que veas cómo funciona
    {
        id: 1001,
        nombres: "María",
        apellidos: "García López",
        direccion: "Calle 10 #20-30, Bucaramanga",
        acudiente: "Pedro García",
        telefonoCelular: "3001234567",
        telefonoFijo: "6071234567",
        estado: "Inscrito", // Puede ser: "En proceso de ingreso", "Inscrito", "Aprobado", "Cursando", "Graduado", "Expulsado", "Retirado"
        riesgo: "Ninguno" // Puede ser: "Ninguno", "Bajo", "Alto"
    }
];

// --- Arreglo de Trainers (INSTRUCTORES) ---
// Cada trainer es una persona que enseña en CampusLands
let trainers = [
    {
        id: 2001,
        nombre: "Carlos Rodríguez",
        rutasQuePuedeDictar: ["Ruta NodeJS", "Ruta Java"], // Lista de rutas que puede enseñar
        horario: "Lunes a Viernes 8:00 AM - 12:00 PM"
    },
    {
        id: 2002,
        nombre: "Ana Martínez",
        rutasQuePuedeDictar: ["Ruta NetCore", "Ruta Java"],
        horario: "Lunes a Viernes 2:00 PM - 6:00 PM"
    }
];

// --- Arreglo de rutas de entrenamiento ---
// Una ruta es como una "carrera" o programa de estudios completo
let rutasEntrenamiento = [
    {
        nombreRuta: "Ruta NodeJS",
        modulos: [
            {
                nombreModulo: "Fundamentos de programación",
                descripcion: "Introducción a la algoritmia, PSeInt y Python"
            },
            {
                nombreModulo: "Programación Web",
                descripcion: "HTML, CSS y Bootstrap"
            },
            {
                nombreModulo: "Programación formal",
                descripcion: "Java, JavaScript, C#"
            },
            {
                nombreModulo: "Bases de datos",
                descripcion: "MySQL, MongoDB y PostgreSQL",
                sgbdPrincipal: "MongoDB",
                sgbdAlternativo: "MySQL"
            },
            {
                nombreModulo: "Backend",
                descripcion: "NodeJS y Express"
            }
        ],
        campersIds: [], // Aquí guardaremos los ids de los campers en esta ruta
        trainersIds: [] // Aquí guardaremos los ids de los trainers que dictan esta ruta
    },
    {
        nombreRuta: "Ruta Java",
        modulos: [
            {
                nombreModulo: "Fundamentos de programación",
                descripcion: "Introducción a la algoritmia, PSeInt y Python"
            },
            {
                nombreModulo: "Programación Web",
                descripcion: "HTML, CSS y Bootstrap"
            },
            {
                nombreModulo: "Programación formal",
                descripcion: "Java, JavaScript, C#"
            },
            {
                nombreModulo: "Bases de datos",
                descripcion: "MySQL, MongoDB y PostgreSQL",
                sgbdPrincipal: "MySQL",
                sgbdAlternativo: "PostgreSQL"
            },
            {
                nombreModulo: "Backend",
                descripcion: "Spring Boot"
            }
        ],
        campersIds: [],
        trainersIds: []
    },
    {
        nombreRuta: "Ruta NetCore",
        modulos: [
            {
                nombreModulo: "Fundamentos de programación",
                descripcion: "Introducción a la algoritmia, PSeInt y Python"
            },
            {
                nombreModulo: "Programación Web",
                descripcion: "HTML, CSS y Bootstrap"
            },
            {
                nombreModulo: "Programación formal",
                descripcion: "Java, JavaScript, C#"
            },
            {
                nombreModulo: "Bases de datos",
                descripcion: "MySQL, MongoDB y PostgreSQL",
                sgbdPrincipal: "PostgreSQL",
                sgbdAlternativo: "MySQL"
            },
            {
                nombreModulo: "Backend",
                descripcion: "NetCore"
            }
        ],
        campersIds: [],
        trainersIds: []
    }
];

// --- Arreglo de áreas de entrenamiento (SALONES) ---
// Cada área es un salón donde se dan clases. Máximo 33 campers por área.
let areasEntrenamiento = [
    {
        idArea: "Sala 1",
        capacidadMaxima: 33,
        campersActuales: 0, // Contador de cuántos campers están en esta área
        campersIds: [] // Lista de ids de campers en esta área
    },
    {
        idArea: "Sala 2",
        capacidadMaxima: 33,
        campersActuales: 0,
        campersIds: []
    },
    {
        idArea: "Sala 3",
        capacidadMaxima: 33,
        campersActuales: 0,
        campersIds: []
    }
];

// --- Arreglo de matrículas ---
// Una matrícula relaciona un camper con una ruta, un trainer y un área
let matriculas = [];

// --- Arreglo de notas por módulo ---
// Aquí guardamos las notas de cada camper en cada módulo
let notasModulos = [];

// --- Contador para generar IDS únicos de matrícula ---
let contadorIdMatricula = 1;


// === Sección 2: Funciones Auxiliares (AYUDANTES) ====

// Estas son funciones pequeñas que nos ayudan en varias partes del programa

/*
  Función: buscarCamperPorId
  Qué hace: Busca un camper (estudiante) en la lista usando su id
  Recibe: El número de identificación del camper
  Retorna: El objeto camper si lo encuentra, o null si no existe
*/
function buscarCamperPorId(id) {
    // Recorremos todos los campers de la lista
    for (let i = 0; i < campers.length; i++) {
        // Si encontramos uno con el mismo id, lo devolvemos
        if (campers[i].id === id) {
            return campers[i];
        }
    }
    // Si llegamos aquí, no encontramos el camper
    return null;
}

/*
  Función: buscarTrainerPorId
  Qué hace: Busca un trainer (instructor) en la lista usando su id
  Recibe: El número de identificación del trainer
  Retorna: El objeto trainer si lo encuentra, o null si no existe
*/
function buscarTrainerPorId(id) {
    for (let i = 0; i < trainers.length; i++) {
        if (trainers[i].id === id) {
            return trainers[i];
        }
    }
    return null;
}

/*
  Función: buscarRutaPorNombre
  Qué hace: Busca una ruta de entrenamiento por su nombre
  Recibe: El nombre de la ruta (texto)
  Retorna: El objeto ruta si lo encuentra, o null si no existe
*/
function buscarRutaPorNombre(nombre) {
    for (let i = 0; i < rutasEntrenamiento.length; i++) {
        if (rutasEntrenamiento[i].nombreRuta === nombre) {
            return rutasEntrenamiento[i];
        }
    }
    return null;
}

/*
  Función: buscarAreaPorId
  Qué hace: Busca un área (salón) por su identificador
  Recibe: El id del área (texto como "Sala 1")
  Retorna: El objeto área si lo encuentra, o null si no existe
*/
function buscarAreaPorId(idArea) {
    for (let i = 0; i < areasEntrenamiento.length; i++) {
        if (areasEntrenamiento[i].idArea === idArea) {
            return areasEntrenamiento[i];
        }
    }
    return null;
}

/*
  Función: validarNumeroEnRango
  Qué hace: Verifica que un número esté entre un valor mínimo y máximo
  Recibe: El número a validar, el mínimo y el máximo
  Retorna: true si está en el rango, false si no
*/
function validarNumeroEnRango(numero, minimo, maximo) {
    // Verificamos que sea un número válido y que esté en el rango
    return !isNaN(numero) && numero >= minimo && numero <= maximo;
}


// === Sección 3: Funciones del rol Coordinador ===

/*
  Función: registrarCamper
  Qué hace: Permite al coordinador registrar un nuevo camper (estudiante)
           Pide todos los datos necesarios y los guarda en el sistema
  Recibe: Nada
  Retorna: Nada (muestra alertas al usuario)
*/
function registrarCamper() {
    console.log("\n=== REGISTRO DE NUEVO CAMPER ===");
    
    // Pedimos el ID del camper
    let idTexto = prompt("Ingresa el número de identificación (cédula) del camper:");
    
    // Si el usuario presiona Cancelar, salimos de la función
    if (idTexto === null) {
        alert("Registro cancelado.");
        return;
    }
    
    // Convertimos el texto a número
    let id = parseInt(idTexto);
    
    // Verificamos que sea un número válido
    if (isNaN(id)) {
        alert("Error: El ID debe ser un número válido.");
        return;
    }
    
    // Verificamos que el ID no esté repetido
    if (buscarCamperPorId(id) !== null) {
        alert("Error: Ya existe un camper con ese ID.");
        return;
    }
    
    // Pedimos los demás datos
    let nombres = prompt("Ingresa los nombres del camper:");
    if (nombres === null) { alert("Registro cancelado."); return; }
    
    let apellidos = prompt("Ingresa los apellidos del camper:");
    if (apellidos === null) { alert("Registro cancelado."); return; }
    
    let direccion = prompt("Ingresa la dirección de residencia:");
    if (direccion === null) { alert("Registro cancelado."); return; }
    
    let acudiente = prompt("Ingresa el nombre del acudiente:");
    if (acudiente === null) { alert("Registro cancelado."); return; }
    
    let telefonoCelular = prompt("Ingresa el teléfono celular:");
    if (telefonoCelular === null) { alert("Registro cancelado."); return; }
    
    let telefonoFijo = prompt("Ingresa el teléfono fijo (o deja en blanco si no tiene):");
    if (telefonoFijo === null) { telefonoFijo = ""; } // Si cancela, dejamos vacío
    
    // Creamos el objeto camper con todos sus datos
    // El estado inicial es "En proceso de ingreso"
    let nuevoCamper = {
        id: id,
        nombres: nombres,
        apellidos: apellidos,
        direccion: direccion,
        acudiente: acudiente,
        telefonoCelular: telefonoCelular,
        telefonoFijo: telefonoFijo,
        estado: "En proceso de ingreso",
        riesgo: "Ninguno"
    };
    
    // Agregamos el nuevo camper al arreglo de campers
    campers.push(nuevoCamper);
    
    // Mostramos mensaje de éxito
    alert("¡Camper registrado exitosamente!\n\nID: " + id + "\nNombre: " + nombres + " " + apellidos);
    console.log("Camper registrado:", nuevoCamper);
}

/*
  Función: registrarTrainer
  Qué hace: Permite al coordinador registrar un nuevo trainer (instructor)
  Recibe: Nada
  Retorna: Nada
*/
function registrarTrainer() {
    console.log("\n=== REGISTRO DE NUEVO TRAINER ===");
    
    let idTexto = prompt("Ingresa el número de identificación del trainer:");
    if (idTexto === null) { alert("Registro cancelado."); return; }
    
    let id = parseInt(idTexto);
    if (isNaN(id)) {
        alert("Error: El ID debe ser un número válido.");
        return;
    }
    
    // Verificamos que el ID no esté repetido
    if (buscarTrainerPorId(id) !== null) {
        alert("Error: Ya existe un trainer con ese ID.");
        return;
    }
    
    let nombre = prompt("Ingresa el nombre completo del trainer:");
    if (nombre === null) { alert("Registro cancelado."); return; }
    
    let horario = prompt("Ingresa el horario del trainer (ejemplo: Lunes a Viernes 8:00 AM - 12:00 PM):");
    if (horario === null) { alert("Registro cancelado."); return; }
    
    // Mostramos las rutas disponibles para que el coordinador sepa cuáles existen
    let textoRutas = "Rutas disponibles:\n";
    for (let i = 0; i < rutasEntrenamiento.length; i++) {
        textoRutas += "- " + rutasEntrenamiento[i].nombreRuta + "\n";
    }
    
    alert(textoRutas);
    
    let rutasTexto = prompt("Ingresa las rutas que puede dictar, separadas por comas (ejemplo: Ruta NodeJS, Ruta Java):");
    if (rutasTexto === null) { alert("Registro cancelado."); return; }
    
    // Convertimos el texto en un arreglo, separando por comas
    // Por ejemplo: "Ruta NodeJS, Ruta Java" se convierte en ["Ruta NodeJS", "Ruta Java"]
    let rutasQuePuedeDictar = rutasTexto.split(",").map(function(ruta) {
        return ruta.trim(); // trim() elimina espacios al inicio y final
    });
    
    // Creamos el objeto trainer
    let nuevoTrainer = {
        id: id,
        nombre: nombre,
        rutasQuePuedeDictar: rutasQuePuedeDictar,
        horario: horario
    };
    
    // Lo agregamos al arreglo
    trainers.push(nuevoTrainer);
    
    alert("¡Trainer registrado exitosamente!\n\nID: " + id + "\nNombre: " + nombre);
    console.log("Trainer registrado:", nuevoTrainer);
}

/*
  Función: crearRutaEntrenamiento
  Qué hace: Permite crear una nueva ruta de entrenamiento con sus módulos
  Recibe: Nada
  Retorna: Nada
*/
function crearRutaEntrenamiento() {
    console.log("\n=== CREAR NUEVA RUTA DE ENTRENAMIENTO ===");
    
    let nombreRuta = prompt("Ingresa el nombre de la nueva ruta (ejemplo: Ruta Python):");
    if (nombreRuta === null) { alert("Creación cancelada."); return; }
    
    // Verificamos que no exista ya una ruta con ese nombre
    if (buscarRutaPorNombre(nombreRuta) !== null) {
        alert("Error: Ya existe una ruta con ese nombre.");
        return;
    }
    
    // Creamos los 5 módulos por defecto que todas las rutas tienen
    let modulos = [
        {
            nombreModulo: "Fundamentos de programación",
            descripcion: "Introducción a la algoritmia, PSeInt y Python"
        },
        {
            nombreModulo: "Programación Web",
            descripcion: "HTML, CSS y Bootstrap"
        },
        {
            nombreModulo: "Programación formal",
            descripcion: "Java, JavaScript, C#"
        },
        {
            nombreModulo: "Bases de datos",
            descripcion: "MySQL, MongoDB y PostgreSQL",
            sgbdPrincipal: "",
            sgbdAlternativo: ""
        },
        {
            nombreModulo: "Backend",
            descripcion: ""
        }
    ];
    
    // Pedimos al coordinador que especifique el SGBD principal para bases de datos
    let sgbdPrincipal = prompt("Para el módulo de Bases de datos, ¿cuál es el SGBD principal? (MySQL, MongoDB o PostgreSQL):");
    if (sgbdPrincipal === null) { sgbdPrincipal = "MySQL"; }
    modulos[3].sgbdPrincipal = sgbdPrincipal;
    
    let sgbdAlternativo = prompt("¿Cuál es el SGBD alternativo?:");
    if (sgbdAlternativo === null) { sgbdAlternativo = "PostgreSQL"; }
    modulos[3].sgbdAlternativo = sgbdAlternativo;
    
    // Pedimos la tecnología del backend
    let backendTecnologia = prompt("Para el módulo de Backend, ¿cuál es la tecnología? (NodeJS, Spring Boot, NetCore, etc.):");
    if (backendTecnologia === null) { backendTecnologia = "NodeJS"; }
    modulos[4].descripcion = backendTecnologia;
    
    // Creamos la nueva ruta
    let nuevaRuta = {
        nombreRuta: nombreRuta,
        modulos: modulos,
        campersIds: [],
        trainersIds: []
    };
    
    // La agregamos al arreglo
    rutasEntrenamiento.push(nuevaRuta);
    
    alert("¡Ruta creada exitosamente!\n\nNombre: " + nombreRuta);
    console.log("Ruta creada:", nuevaRuta);
}

/*
  Función: registrarNotasPruebaInicial
  Qué hace: Registra las notas de la prueba inicial de un camper
           Si el promedio es >= 60, el camper pasa a estado "Aprobado"
  Recibe: Nada
  Retorna: Nada
*/
function registrarNotasPruebaInicial() {
    console.log("\n=== REGISTRO DE NOTAS - PRUEBA INICIAL ===");
    
    let idTexto = prompt("Ingresa el ID del camper:");
    if (idTexto === null) { alert("Operación cancelada."); return; }
    
    let id = parseInt(idTexto);
    let camper = buscarCamperPorId(id);
    
    if (camper === null) {
        alert("Error: No se encontró un camper con ese ID.");
        return;
    }
    
    alert("Camper encontrado: " + camper.nombres + " " + camper.apellidos + "\nEstado actual: " + camper.estado);
    
    // Pedimos la nota teórica
    let notaTeoricaTexto = prompt("Ingresa la nota teórica (0 a 100):");
    if (notaTeoricaTexto === null) { alert("Operación cancelada."); return; }
    let notaTeorica = parseFloat(notaTeoricaTexto);
    
    // Validamos que sea un número entre 0 y 100
    if (!validarNumeroEnRango(notaTeorica, 0, 100)) {
        alert("Error: La nota teórica debe ser un número entre 0 y 100.");
        return;
    }
    
    // Pedimos la nota práctica
    let notaPracticaTexto = prompt("Ingresa la nota práctica (0 a 100):");
    if (notaPracticaTexto === null) { alert("Operación cancelada."); return; }
    let notaPractica = parseFloat(notaPracticaTexto);
    
    if (!validarNumeroEnRango(notaPractica, 0, 100)) {
        alert("Error: La nota práctica debe ser un número entre 0 y 100.");
        return;
    }
    
    // Calculamos el promedio simple
    let promedio = (notaTeorica + notaPractica) / 2;
    
    // Si el promedio es mayor o igual a 60, el camper aprueba
    if (promedio >= 60) {
        camper.estado = "Aprobado";
        alert("¡Felicitaciones!\n\n" + camper.nombres + " " + camper.apellidos + " ha APROBADO la prueba inicial.\n\nNota teórica: " + notaTeorica + "\nNota práctica: " + notaPractica + "\nPromedio: " + promedio.toFixed(2) + "\n\nEl camper ahora está en estado: Aprobado");
    } else {
        // Si no aprueba, cambiamos su estado a "Inscrito" (o lo dejamos como está)
        if (camper.estado === "En proceso de ingreso") {
            camper.estado = "Inscrito";
        }
        alert("Prueba inicial NO aprobada.\n\n" + camper.nombres + " " + camper.apellidos + "\n\nNota teórica: " + notaTeorica + "\nNota práctica: " + notaPractica + "\nPromedio: " + promedio.toFixed(2) + "\n\nNecesita al menos 60 puntos para aprobar.\nEstado actual: " + camper.estado);
    }
    
    console.log("Notas de prueba inicial registradas para camper ID " + id + ":");
    console.log("  Nota teórica: " + notaTeorica);
    console.log("  Nota práctica: " + notaPractica);
    console.log("  Promedio: " + promedio.toFixed(2));
    console.log("  Estado final: " + camper.estado);
}

/*
  Función: matricularCamperEnRuta
  Qué hace: Asigna un camper aprobado a una ruta, con un trainer y un área
           Solo se pueden matricular campers en estado "Aprobado"
  Recibe: Nada
  Retorna: Nada
*/
function matricularCamperEnRuta() {
    console.log("\n=== MATRICULAR CAMPER EN RUTA ===");
    
    // Paso 1: Pedir el ID del camper
    let idCamperTexto = prompt("Ingresa el ID del camper:");
    if (idCamperTexto === null) { alert("Operación cancelada."); return; }
    
    let idCamper = parseInt(idCamperTexto);
    let camper = buscarCamperPorId(idCamper);
    
    if (camper === null) {
        alert("Error: No se encontró un camper con ese ID.");
        return;
    }
    
    // Verificamos que el camper esté aprobado
    if (camper.estado !== "Aprobado") {
        alert("Error: El camper debe estar en estado 'Aprobado' para poder matricularse.\n\nEstado actual: " + camper.estado);
        return;
    }
    
    // Paso 2: Mostrar rutas disponibles y pedir que elija una
    let textoRutas = "Rutas disponibles:\n";
    for (let i = 0; i < rutasEntrenamiento.length; i++) {
        textoRutas += (i + 1) + ". " + rutasEntrenamiento[i].nombreRuta + "\n";
    }
    
    let opcionRutaTexto = prompt(textoRutas + "\nIngresa el número de la ruta:");
    if (opcionRutaTexto === null) { alert("Operación cancelada."); return; }
    
    let opcionRuta = parseInt(opcionRutaTexto);
    if (isNaN(opcionRuta) || opcionRuta < 1 || opcionRuta > rutasEntrenamiento.length) {
        alert("Error: Opción de ruta inválida.");
        return;
    }
    
    let ruta = rutasEntrenamiento[opcionRuta - 1];
    let nombreRuta = ruta.nombreRuta;
    
    // Paso 3: Mostrar trainers disponibles para esa ruta
    let trainersDisponibles = [];
    for (let i = 0; i < trainers.length; i++) {
        // Verificamos si el trainer puede dictar esta ruta
        let puedeDictar = false;
        for (let j = 0; j < trainers[i].rutasQuePuedeDictar.length; j++) {
            if (trainers[i].rutasQuePuedeDictar[j] === nombreRuta) {
                puedeDictar = true;
                break;
            }
        }
        if (puedeDictar) {
            trainersDisponibles.push(trainers[i]);
        }
    }
    
    if (trainersDisponibles.length === 0) {
        alert("Error: No hay trainers disponibles para la ruta " + nombreRuta);
        return;
    }
    
    let textoTrainers = "Trainers disponibles para " + nombreRuta + ":\n";
    for (let i = 0; i < trainersDisponibles.length; i++) {
        textoTrainers += (i + 1) + ". " + trainersDisponibles[i].nombre + " (ID: " + trainersDisponibles[i].id + ")\n";
    }
    
    let opcionTrainerTexto = prompt(textoTrainers + "\nIngresa el número del trainer:");
    if (opcionTrainerTexto === null) { alert("Operación cancelada."); return; }
    
    let opcionTrainer = parseInt(opcionTrainerTexto);
    if (isNaN(opcionTrainer) || opcionTrainer < 1 || opcionTrainer > trainersDisponibles.length) {
        alert("Error: Opción de trainer inválida.");
        return;
    }
    
    let trainer = trainersDisponibles[opcionTrainer - 1];
    let idTrainer = trainer.id;
    
    // Paso 4: Mostrar áreas disponibles
    let textoAreas = "Áreas de entrenamiento disponibles:\n";
    for (let i = 0; i < areasEntrenamiento.length; i++) {
        let area = areasEntrenamiento[i];
        let cuposDisponibles = area.capacidadMaxima - area.campersActuales;
        textoAreas += (i + 1) + ". " + area.idArea + " (Cupos disponibles: " + cuposDisponibles + "/" + area.capacidadMaxima + ")\n";
    }
    
    let opcionAreaTexto = prompt(textoAreas + "\nIngresa el número del área:");
    if (opcionAreaTexto === null) { alert("Operación cancelada."); return; }
    
    let opcionArea = parseInt(opcionAreaTexto);
    if (isNaN(opcionArea) || opcionArea < 1 || opcionArea > areasEntrenamiento.length) {
        alert("Error: Opción de área inválida.");
        return;
    }
    
    let area = areasEntrenamiento[opcionArea - 1];
    
    // Verificamos que el área no esté llena
    if (area.campersActuales >= area.capacidadMaxima) {
        alert("Error: El área " + area.idArea + " está llena. No se pueden matricular más campers.");
        return;
    }
    
    // Paso 5: Pedir fechas
    let fechaInicio = prompt("Ingresa la fecha de inicio (ejemplo: 2024-03-01):");
    if (fechaInicio === null) { alert("Operación cancelada."); return; }
    
    let fechaFin = prompt("Ingresa la fecha de finalización (ejemplo: 2024-12-15):");
    if (fechaFin === null) { alert("Operación cancelada."); return; }
    
    // Paso 6: Crear la matrícula
    let nuevaMatricula = {
        idMatricula: contadorIdMatricula,
        idCamper: idCamper,
        idTrainer: idTrainer,
        nombreRuta: nombreRuta,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        idArea: area.idArea
    };
    
    contadorIdMatricula++; // Aumentamos el contador para la próxima matrícula
    
    // Agregamos la matrícula al arreglo
    matriculas.push(nuevaMatricula);
    
    // Actualizamos el área (agregamos al camper y aumentamos el contador)
    area.campersIds.push(idCamper);
    area.campersActuales++;
    
    // Actualizamos la ruta (agregamos el camper y el trainer si no están ya)
    if (ruta.campersIds.indexOf(idCamper) === -1) {
        ruta.campersIds.push(idCamper);
    }
    if (ruta.trainersIds.indexOf(idTrainer) === -1) {
        ruta.trainersIds.push(idTrainer);
    }
    
    // Cambiamos el estado del camper a "Cursando"
    camper.estado = "Cursando";
    
    alert("¡Matrícula exitosa!\n\nCamper: " + camper.nombres + " " + camper.apellidos + "\nRuta: " + nombreRuta + "\nTrainer: " + trainer.nombre + "\nÁrea: " + area.idArea + "\nID de matrícula: " + nuevaMatricula.idMatricula);
    
    console.log("Matrícula creada:", nuevaMatricula);
}

/*
  Función: consultarCampersEnRiesgo
  Qué hace: Muestra en la consola todos los campers que tienen riesgo "Alto"
  Recibe: Nada
  Retorna: Nada
*/
function consultarCampersEnRiesgo() {
    console.log("\n========================================");
    console.log("  CAMPERS EN RIESGO ALTO");
    console.log("========================================");
    
    let hayRiesgo = false;
    
    // Recorremos todos los campers
    for (let i = 0; i < campers.length; i++) {
        if (campers[i].riesgo === "Alto") {
            hayRiesgo = true;
            console.log("\nID: " + campers[i].id);
            console.log("Nombre: " + campers[i].nombres + " " + campers[i].apellidos);
            console.log("Estado: " + campers[i].estado);
            console.log("Riesgo: " + campers[i].riesgo);
            console.log("Teléfono: " + campers[i].telefonoCelular);
            console.log("Acudiente: " + campers[i].acudiente);
            console.log("---");
        }
    }
    
    if (!hayRiesgo) {
        console.log("\nNo hay campers en riesgo alto en este momento.");
    }
    
    console.log("\n========================================\n");
    alert("Consulta realizada. Revisa la consola del navegador (F12) para ver los resultados.");
}


// === Sección 4: Funciones del rol Trainer ===

/*
  Función: verCampersAsignados
  Qué hace: Muestra en la consola los campers que tiene asignados un trainer
  Recibe: Nada (pero pide el ID del trainer al usuario)
  Retorna: Nada
*/
function verCampersAsignados() {
    console.log("\n=== VER CAMPERS ASIGNADOS ===");
    
    let idTrainerTexto = prompt("Ingresa tu ID como trainer:");
    if (idTrainerTexto === null) { alert("Operación cancelada."); return; }
    
    let idTrainer = parseInt(idTrainerTexto);
    let trainer = buscarTrainerPorId(idTrainer);
    
    if (trainer === null) {
        alert("Error: No se encontró un trainer con ese ID.");
        return;
    }
    
    alert("Trainer: " + trainer.nombre + "\n\nBuscando campers asignados...");
    
    console.log("\n========================================");
    console.log("  CAMPERS ASIGNADOS A " + trainer.nombre);
    console.log("========================================");
    
    // Buscamos todas las matrículas de este trainer
    let matriculasTrainer = [];
    for (let i = 0; i < matriculas.length; i++) {
        if (matriculas[i].idTrainer === idTrainer) {
            matriculasTrainer.push(matriculas[i]);
        }
    }
    
    if (matriculasTrainer.length === 0) {
        console.log("\nNo tienes campers asignados en este momento.");
        alert("No tienes campers asignados en este momento.");
        return;
    }
    
    // Mostramos cada camper
    for (let i = 0; i < matriculasTrainer.length; i++) {
        let matricula = matriculasTrainer[i];
        let camper = buscarCamperPorId(matricula.idCamper);
        
        if (camper !== null) {
            console.log("\n--- Camper " + (i + 1) + " ---");
            console.log("Nombre: " + camper.nombres + " " + camper.apellidos);
            console.log("ID: " + camper.id);
            console.log("Ruta: " + matricula.nombreRuta);
            console.log("Estado: " + camper.estado);
            console.log("Riesgo: " + camper.riesgo);
            console.log("Área: " + matricula.idArea);
        }
    }
    
    console.log("\n========================================\n");
    alert("Consulta realizada. Revisa la consola del navegador (F12) para ver tus campers asignados.");
}

/*
  Función: registrarNotasModulo
  Qué hace: Permite a un trainer registrar las notas de un camper en un módulo
           Calcula la nota final y determina si aprobó o reprobó
  Recibe: Nada
  Retorna: Nada
*/
function registrarNotasModulo() {
    console.log("\n=== REGISTRAR NOTAS DE MÓDULO ===");
    
    // Paso 1: Pedir el ID del trainer
    let idTrainerTexto = prompt("Ingresa tu ID como trainer:");
    if (idTrainerTexto === null) { alert("Operación cancelada."); return; }
    
    let idTrainer = parseInt(idTrainerTexto);
    let trainer = buscarTrainerPorId(idTrainer);
    
    if (trainer === null) {
        alert("Error: No se encontró un trainer con ese ID.");
        return;
    }
    
    // Paso 2: Mostrar las rutas que este trainer puede dictar
    let textoRutas = "Rutas que puedes dictar:\n";
    for (let i = 0; i < trainer.rutasQuePuedeDictar.length; i++) {
        textoRutas += (i + 1) + ". " + trainer.rutasQuePuedeDictar[i] + "\n";
    }
    
    let opcionRutaTexto = prompt(textoRutas + "\nIngresa el número de la ruta:");
    if (opcionRutaTexto === null) { alert("Operación cancelada."); return; }
    
    let opcionRuta = parseInt(opcionRutaTexto);
    if (isNaN(opcionRuta) || opcionRuta < 1 || opcionRuta > trainer.rutasQuePuedeDictar.length) {
        alert("Error: Opción de ruta inválida.");
        return;
    }
    
    let nombreRuta = trainer.rutasQuePuedeDictar[opcionRuta - 1];
    let ruta = buscarRutaPorNombre(nombreRuta);
    
    if (ruta === null) {
        alert("Error: No se encontró la ruta.");
        return;
    }
    
    // Paso 3: Mostrar los módulos de la ruta
    let textoModulos = "Módulos de " + nombreRuta + ":\n";
    for (let i = 0; i < ruta.modulos.length; i++) {
        textoModulos += (i + 1) + ". " + ruta.modulos[i].nombreModulo + "\n";
    }
    
    let opcionModuloTexto = prompt(textoModulos + "\nIngresa el número del módulo:");
    if (opcionModuloTexto === null) { alert("Operación cancelada."); return; }
    
    let opcionModulo = parseInt(opcionModuloTexto);
    if (isNaN(opcionModulo) || opcionModulo < 1 || opcionModulo > ruta.modulos.length) {
        alert("Error: Opción de módulo inválida.");
        return;
    }
    
    let modulo = ruta.modulos[opcionModulo - 1];
    let nombreModulo = modulo.nombreModulo;
    
    // Paso 4: Buscar campers matriculados con este trainer en esta ruta
    let campersDisponibles = [];
    for (let i = 0; i < matriculas.length; i++) {
        if (matriculas[i].idTrainer === idTrainer && matriculas[i].nombreRuta === nombreRuta) {
            let camper = buscarCamperPorId(matriculas[i].idCamper);
            if (camper !== null) {
                campersDisponibles.push(camper);
            }
        }
    }
    
    if (campersDisponibles.length === 0) {
        alert("No tienes campers asignados en esta ruta.");
        return;
    }
    
    // Paso 5: Mostrar los campers y pedir que elija uno
    let textoCampers = "Campers en " + nombreRuta + ":\n";
    for (let i = 0; i < campersDisponibles.length; i++) {
        textoCampers += (i + 1) + ". " + campersDisponibles[i].nombres + " " + campersDisponibles[i].apellidos + " (ID: " + campersDisponibles[i].id + ")\n";
    }
    
    let opcionCamperTexto = prompt(textoCampers + "\nIngresa el número del camper:");
    if (opcionCamperTexto === null) { alert("Operación cancelada."); return; }
    
    let opcionCamper = parseInt(opcionCamperTexto);
    if (isNaN(opcionCamper) || opcionCamper < 1 || opcionCamper > campersDisponibles.length) {
        alert("Error: Opción de camper inválida.");
        return;
    }
    
    let camper = campersDisponibles[opcionCamper - 1];
    
    // Paso 6: Pedir las tres notas
    let notaTeoricaTexto = prompt("Ingresa la nota teórica (0 a 100) para " + camper.nombres + " en " + nombreModulo + ":");
    if (notaTeoricaTexto === null) { alert("Operación cancelada."); return; }
    let notaTeorica = parseFloat(notaTeoricaTexto);
    
    if (!validarNumeroEnRango(notaTeorica, 0, 100)) {
        alert("Error: La nota teórica debe ser un número entre 0 y 100.");
        return;
    }
    
    let notaPracticaTexto = prompt("Ingresa la nota práctica (0 a 100):");
    if (notaPracticaTexto === null) { alert("Operación cancelada."); return; }
    let notaPractica = parseFloat(notaPracticaTexto);
    
    if (!validarNumeroEnRango(notaPractica, 0, 100)) {
        alert("Error: La nota práctica debe ser un número entre 0 y 100.");
        return;
    }
    
    let notaQuicesTrabajosTexto = prompt("Ingresa la nota de quices/trabajos (0 a 100):");
    if (notaQuicesTrabajosTexto === null) { alert("Operación cancelada."); return; }
    let notaQuicesTrabajos = parseFloat(notaQuicesTrabajosTexto);
    
    if (!validarNumeroEnRango(notaQuicesTrabajos, 0, 100)) {
        alert("Error: La nota de quices/trabajos debe ser un número entre 0 y 100.");
        return;
    }
    
    // Paso 7: Calcular la nota final del módulo
    // Fórmula: 30% teórica + 60% práctica + 10% quices/trabajos
    let notaFinalModulo = (notaTeorica * 0.3) + (notaPractica * 0.6) + (notaQuicesTrabajos * 0.1);
    
    // Determinar si aprobó (nota >= 60)
    let aprobado = notaFinalModulo >= 60;
    
    // Paso 8: Guardar la nota en el arreglo notasModulos
    // Primero verificamos si ya existe una nota para este camper en este módulo
    let notaExistente = null;
    for (let i = 0; i < notasModulos.length; i++) {
        if (notasModulos[i].idCamper === camper.id && 
            notasModulos[i].nombreRuta === nombreRuta && 
            notasModulos[i].nombreModulo === nombreModulo) {
            notaExistente = notasModulos[i];
            break;
        }
    }
    
    if (notaExistente !== null) {
        // Actualizamos la nota existente
        notaExistente.notaTeorica = notaTeorica;
        notaExistente.notaPractica = notaPractica;
        notaExistente.notaQuicesTrabajos = notaQuicesTrabajos;
        notaExistente.notaFinalModulo = notaFinalModulo;
        notaExistente.aprobado = aprobado;
    } else {
        // Creamos una nueva nota
        let nuevaNota = {
            idCamper: camper.id,
            nombreRuta: nombreRuta,
            nombreModulo: nombreModulo,
            notaTeorica: notaTeorica,
            notaPractica: notaPractica,
            notaQuicesTrabajos: notaQuicesTrabajos,
            notaFinalModulo: notaFinalModulo,
            aprobado: aprobado
        };
        notasModulos.push(nuevaNota);
    }
    
    // Paso 9: Actualizar el riesgo del camper
    actualizarRiesgoCamper(camper.id);
    
    // Paso 10: Mostrar resultado
    let mensaje = "Notas registradas para:\n" +
                  "Camper: " + camper.nombres + " " + camper.apellidos + "\n" +
                  "Ruta: " + nombreRuta + "\n" +
                  "Módulo: " + nombreModulo + "\n\n" +
                  "Nota teórica (30%): " + notaTeorica + "\n" +
                  "Nota práctica (60%): " + notaPractica + "\n" +
                  "Nota quices/trabajos (10%): " + notaQuicesTrabajos + "\n\n" +
                  "NOTA FINAL: " + notaFinalModulo.toFixed(2) + "\n" +
                  "Estado: " + (aprobado ? "APROBADO ✓" : "REPROBADO ✗");
    
    alert(mensaje);
    console.log("\n" + mensaje);
}

/*
  Función: consultarNotasCampers
  Qué hace: Muestra en la consola las notas de los campers de un trainer
  Recibe: Nada
  Retorna: Nada
*/
function consultarNotasCampers() {
    console.log("\n=== CONSULTAR NOTAS DE CAMPERS ===");
    
    let idTrainerTexto = prompt("Ingresa tu ID como trainer:");
    if (idTrainerTexto === null) { alert("Operación cancelada."); return; }
    
    let idTrainer = parseInt(idTrainerTexto);
    let trainer = buscarTrainerPorId(idTrainer);
    
    if (trainer === null) {
        alert("Error: No se encontró un trainer con ese ID.");
        return;
    }
    
    console.log("\n========================================");
    console.log("  NOTAS DE CAMPERS - TRAINER: " + trainer.nombre);
    console.log("========================================");
    
    // Buscamos todas las matrículas de este trainer
    let hayNotas = false;
    
    for (let i = 0; i < matriculas.length; i++) {
        if (matriculas[i].idTrainer === idTrainer) {
            let camper = buscarCamperPorId(matriculas[i].idCamper);
            if (camper === null) continue;
            
            console.log("\n--- " + camper.nombres + " " + camper.apellidos + " (ID: " + camper.id + ") ---");
            console.log("Ruta: " + matriculas[i].nombreRuta);
            
            // Buscamos las notas de este camper en esta ruta
            let notasCamper = [];
            for (let j = 0; j < notasModulos.length; j++) {
                if (notasModulos[j].idCamper === camper.id && notasModulos[j].nombreRuta === matriculas[i].nombreRuta) {
                    notasCamper.push(notasModulos[j]);
                }
            }
            
            if (notasCamper.length === 0) {
                console.log("  No hay notas registradas aún.");
            } else {
                hayNotas = true;
                for (let j = 0; j < notasCamper.length; j++) {
                    let nota = notasCamper[j];
                    console.log("\n  Módulo: " + nota.nombreModulo);
                    console.log("    Teórica: " + nota.notaTeorica);
                    console.log("    Práctica: " + nota.notaPractica);
                    console.log("    Quices/Trabajos: " + nota.notaQuicesTrabajos);
                    console.log("    FINAL: " + nota.notaFinalModulo.toFixed(2) + " - " + (nota.aprobado ? "APROBADO" : "REPROBADO"));
                }
            }
        }
    }
    
    if (!hayNotas) {
        console.log("\nNo hay notas registradas para tus campers.");
    }
    
    console.log("\n========================================\n");
    alert("Consulta realizada. Revisa la consola del navegador (F12) para ver las notas.");
}


// === Sección 5: Funciones del rol Camper ===

/*
  Función: consultarInformacionCamper
  Qué hace: Muestra la información básica de un camper
  Recibe: Nada
  Retorna: Nada
*/
function consultarInformacionCamper() {
    console.log("\n=== CONSULTAR INFORMACIÓN PERSONAL ===");
    
    let idTexto = prompt("Ingresa tu ID como camper:");
    if (idTexto === null) { alert("Operación cancelada."); return; }
    
    let id = parseInt(idTexto);
    let camper = buscarCamperPorId(id);
    
    if (camper === null) {
        alert("Error: No se encontró un camper con ese ID.");
        return;
    }
    
    let info = "=== INFORMACIÓN PERSONAL ===\n\n" +
               "ID: " + camper.id + "\n" +
               "Nombre: " + camper.nombres + " " + camper.apellidos + "\n" +
               "Dirección: " + camper.direccion + "\n" +
               "Acudiente: " + camper.acudiente + "\n" +
               "Teléfono celular: " + camper.telefonoCelular + "\n" +
               "Teléfono fijo: " + camper.telefonoFijo + "\n\n" +
               "Estado: " + camper.estado + "\n" +
               "Nivel de riesgo: " + camper.riesgo;
    
    alert(info);
    console.log("\n" + info);
}

/*
  Función: consultarRutaMatriculada
  Qué hace: Muestra en qué ruta está matriculado un camper
  Recibe: Nada
  Retorna: Nada
*/
function consultarRutaMatriculada() {
    console.log("\n=== CONSULTAR RUTA MATRICULADA ===");
    
    let idTexto = prompt("Ingresa tu ID como camper:");
    if (idTexto === null) { alert("Operación cancelada."); return; }
    
    let id = parseInt(idTexto);
    let camper = buscarCamperPorId(id);
    
    if (camper === null) {
        alert("Error: No se encontró un camper con ese ID.");
        return;
    }
    
    // Buscamos si el camper tiene alguna matrícula
    let matriculaEncontrada = null;
    for (let i = 0; i < matriculas.length; i++) {
        if (matriculas[i].idCamper === id) {
            matriculaEncontrada = matriculas[i];
            break;
        }
    }
    
    if (matriculaEncontrada === null) {
        alert("No estás matriculado en ninguna ruta actualmente.\n\nEstado: " + camper.estado);
        console.log("Camper " + id + " no tiene matrícula activa.");
        return;
    }
    
    let trainer = buscarTrainerPorId(matriculaEncontrada.idTrainer);
    let nombreTrainer = trainer !== null ? trainer.nombre : "No asignado";
    
    let info = "=== INFORMACIÓN DE MATRÍCULA ===\n\n" +
               "Camper: " + camper.nombres + " " + camper.apellidos + "\n" +
               "Ruta: " + matriculaEncontrada.nombreRuta + "\n" +
               "Trainer: " + nombreTrainer + "\n" +
               "Área: " + matriculaEncontrada.idArea + "\n" +
               "Fecha inicio: " + matriculaEncontrada.fechaInicio + "\n" +
               "Fecha fin: " + matriculaEncontrada.fechaFin + "\n" +
               "Estado: " + camper.estado;
    
    alert(info);
    console.log("\n" + info);
}

/*
  Función: consultarNotasPropias
  Qué hace: Muestra las notas de un camper en todos sus módulos
  Recibe: Nada
  Retorna: Nada
*/
function consultarNotasPropias() {
    console.log("\n=== CONSULTAR MIS NOTAS ===");
    
    let idTexto = prompt("Ingresa tu ID como camper:");
    if (idTexto === null) { alert("Operación cancelada."); return; }
    
    let id = parseInt(idTexto);
    let camper = buscarCamperPorId(id);
    
    if (camper === null) {
        alert("Error: No se encontró un camper con ese ID.");
        return;
    }
    
    console.log("\n========================================");
    console.log("  NOTAS DE " + camper.nombres + " " + camper.apellidos);
    console.log("========================================");
    
    // Buscamos todas las notas de este camper
    let notasCamper = [];
    for (let i = 0; i < notasModulos.length; i++) {
        if (notasModulos[i].idCamper === id) {
            notasCamper.push(notasModulos[i]);
        }
    }
    
    if (notasCamper.length === 0) {
        console.log("\nNo tienes notas registradas aún.");
        alert("No tienes notas registradas aún.");
        return;
    }
    
    // Mostramos cada nota
    for (let i = 0; i < notasCamper.length; i++) {
        let nota = notasCamper[i];
        console.log("\n--- " + nota.nombreModulo + " (" + nota.nombreRuta + ") ---");
        console.log("  Nota teórica (30%): " + nota.notaTeorica);
        console.log("  Nota práctica (60%): " + nota.notaPractica);
        console.log("  Nota quices/trabajos (10%): " + nota.notaQuicesTrabajos);
        console.log("  NOTA FINAL: " + nota.notaFinalModulo.toFixed(2));
        console.log("  Estado: " + (nota.aprobado ? "APROBADO ✓" : "REPROBADO ✗"));
    }
    
    console.log("\n========================================\n");
    alert("Consulta realizada. Revisa la consola del navegador (F12) para ver tus notas detalladas.");
}


// === Sección 6: Funciones de reportes ===

/*
  Función: listarCampersInscritos
  Qué hace: Muestra todos los campers en estado "Inscrito"
  Recibe: Nada
  Retorna: Nada
*/
function listarCampersInscritos() {
    console.log("\n========================================");
    console.log("  CAMPERS EN ESTADO: INSCRITO");
    console.log("========================================");
    
    let hayInscritos = false;
    
    for (let i = 0; i < campers.length; i++) {
        if (campers[i].estado === "Inscrito") {
            hayInscritos = true;
            console.log("\nID: " + campers[i].id);
            console.log("Nombre: " + campers[i].nombres + " " + campers[i].apellidos);
            console.log("Estado: " + campers[i].estado);
            console.log("---");
        }
    }
    
    if (!hayInscritos) {
        console.log("\nNo hay campers en estado 'Inscrito' actualmente.");
    }
    
    console.log("\n========================================\n");
    alert("Reporte generado. Revisa la consola del navegador (F12).");
}

/*
  Función: listarCampersAprobados
  Qué hace: Muestra todos los campers que aprobaron el examen inicial
  Recibe: Nada
  Retorna: Nada
*/
function listarCampersAprobados() {
    console.log("\n========================================");
    console.log("  CAMPERS QUE APROBARON EXAMEN INICIAL");
    console.log("========================================");
    
    let hayAprobados = false;
    
    for (let i = 0; i < campers.length; i++) {
        if (campers[i].estado === "Aprobado" || campers[i].estado === "Cursando" || campers[i].estado === "Graduado") {
            hayAprobados = true;
            console.log("\nID: " + campers[i].id);
            console.log("Nombre: " + campers[i].nombres + " " + campers[i].apellidos);
            console.log("Estado actual: " + campers[i].estado);
            console.log("---");
        }
    }
    
    if (!hayAprobados) {
        console.log("\nNo hay campers que hayan aprobado el examen inicial.");
    }
    
    console.log("\n========================================\n");
    alert("Reporte generado. Revisa la consola del navegador (F12).");
}

/*
  Función: listarTodosLosTrainers
  Qué hace: Muestra todos los trainers registrados en el sistema
  Recibe: Nada
  Retorna: Nada
*/
function listarTodosLosTrainers() {
    console.log("\n========================================");
    console.log("  LISTADO DE TODOS LOS TRAINERS");
    console.log("========================================");
    
    if (trainers.length === 0) {
        console.log("\nNo hay trainers registrados en el sistema.");
    } else {
        for (let i = 0; i < trainers.length; i++) {
            console.log("\n--- Trainer " + (i + 1) + " ---");
            console.log("ID: " + trainers[i].id);
            console.log("Nombre: " + trainers[i].nombre);
            console.log("Horario: " + trainers[i].horario);
            console.log("Rutas que puede dictar:");
            for (let j = 0; j < trainers[i].rutasQuePuedeDictar.length; j++) {
                console.log("  - " + trainers[i].rutasQuePuedeDictar[j]);
            }
        }
    }
    
    console.log("\n========================================\n");
    alert("Reporte generado. Revisa la consola del navegador (F12).");
}

/*
  Función: listarCampersBajoRendimiento
  Qué hace: Muestra campers que tienen al menos un módulo reprobado
  Recibe: Nada
  Retorna: Nada
*/
function listarCampersBajoRendimiento() {
    console.log("\n========================================");
    console.log("  CAMPERS CON BAJO RENDIMIENTO");
    console.log("  (Módulos reprobados)");
    console.log("========================================");
    
    let campersBajoRendimiento = {};
    
    // Recorremos todas las notas y buscamos las que no fueron aprobadas
    for (let i = 0; i < notasModulos.length; i++) {
        if (!notasModulos[i].aprobado) {
            let idCamper = notasModulos[i].idCamper;
            
            // Si este camper no está en el objeto, lo agregamos
            if (!campersBajoRendimiento[idCamper]) {
                let camper = buscarCamperPorId(idCamper);
                campersBajoRendimiento[idCamper] = {
                    camper: camper,
                    modulosReprobados: []
                };
            }
            
            // Agregamos el módulo reprobado
            campersBajoRendimiento[idCamper].modulosReprobados.push({
                ruta: notasModulos[i].nombreRuta,
                modulo: notasModulos[i].nombreModulo,
                nota: notasModulos[i].notaFinalModulo
            });
        }
    }
    
    // Mostramos los resultados
    let ids = Object.keys(campersBajoRendimiento);
    
    if (ids.length === 0) {
        console.log("\nNo hay campers con bajo rendimiento (todos han aprobado sus módulos).");
    } else {
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i];
            let datos = campersBajoRendimiento[id];
            let camper = datos.camper;
            
            console.log("\n--- Camper ---");
            console.log("ID: " + camper.id);
            console.log("Nombre: " + camper.nombres + " " + camper.apellidos);
            console.log("Riesgo: " + camper.riesgo);
            console.log("Módulos reprobados:");
            
            for (let j = 0; j < datos.modulosReprobados.length; j++) {
                let mod = datos.modulosReprobados[j];
                console.log("  - " + mod.modulo + " (" + mod.ruta + ") - Nota: " + mod.nota.toFixed(2));
            }
        }
    }
    
    console.log("\n========================================\n");
    alert("Reporte generado. Revisa la consola del navegador (F12).");
}

/*
  Función: listarCampersYTrainersPorRuta
  Qué hace: Muestra los campers y trainers asociados a una ruta específica
  Recibe: Nada
  Retorna: Nada
*/
function listarCampersYTrainersPorRuta() {
    console.log("\n=== LISTAR CAMPERS Y TRAINERS POR RUTA ===");
    
    // Mostramos las rutas disponibles
    let textoRutas = "Rutas disponibles:\n";
    for (let i = 0; i < rutasEntrenamiento.length; i++) {
        textoRutas += (i + 1) + ". " + rutasEntrenamiento[i].nombreRuta + "\n";
    }
    
    let opcionTexto = prompt(textoRutas + "\nIngresa el número de la ruta:");
    if (opcionTexto === null) { alert("Operación cancelada."); return; }
    
    let opcion = parseInt(opcionTexto);
    if (isNaN(opcion) || opcion < 1 || opcion > rutasEntrenamiento.length) {
        alert("Error: Opción inválida.");
        return;
    }
    
    let ruta = rutasEntrenamiento[opcion - 1];
    let nombreRuta = ruta.nombreRuta;
    
    console.log("\n========================================");
    console.log("  CAMPERS Y TRAINERS - RUTA: " + nombreRuta);
    console.log("========================================");
    
    // Buscamos todas las matrículas de esta ruta
    let matriculasRuta = [];
    for (let i = 0; i < matriculas.length; i++) {
        if (matriculas[i].nombreRuta === nombreRuta) {
            matriculasRuta.push(matriculas[i]);
        }
    }
    
    if (matriculasRuta.length === 0) {
        console.log("\nNo hay campers matriculados en esta ruta.");
        alert("No hay campers matriculados en esta ruta.");
        return;
    }
    
    // Recopilamos los IDs únicos de campers y trainers
    let idsTrainers = [];
    let idsCampers = [];
    
    for (let i = 0; i < matriculasRuta.length; i++) {
        if (idsCampers.indexOf(matriculasRuta[i].idCamper) === -1) {
            idsCampers.push(matriculasRuta[i].idCamper);
        }
        if (idsTrainers.indexOf(matriculasRuta[i].idTrainer) === -1) {
            idsTrainers.push(matriculasRuta[i].idTrainer);
        }
    }
    
    // Mostramos los trainers
    console.log("\n--- TRAINERS ---");
    for (let i = 0; i < idsTrainers.length; i++) {
        let trainer = buscarTrainerPorId(idsTrainers[i]);
        if (trainer !== null) {
            console.log("  - " + trainer.nombre + " (ID: " + trainer.id + ")");
        }
    }
    
    // Mostramos los campers
    console.log("\n--- CAMPERS ---");
    for (let i = 0; i < idsCampers.length; i++) {
        let camper = buscarCamperPorId(idsCampers[i]);
        if (camper !== null) {
            console.log("  - " + camper.nombres + " " + camper.apellidos + " (ID: " + camper.id + ")");
        }
    }
    
    console.log("\n========================================\n");
    alert("Reporte generado. Revisa la consola del navegador (F12).");
}

/*
  Función: reporteAprobadosReprobadosPorModulo
  Qué hace: Muestra cuántos campers aprobaron y reprobaron cada módulo,
            filtrando por ruta y trainer
  Recibe: Nada
  Retorna: Nada
*/
function reporteAprobadosReprobadosPorModulo() {
    console.log("\n=== REPORTE DE APROBADOS Y REPROBADOS POR MÓDULO ===");
    
    // Paso 1: Pedir la ruta
    let textoRutas = "Rutas disponibles:\n";
    for (let i = 0; i < rutasEntrenamiento.length; i++) {
        textoRutas += (i + 1) + ". " + rutasEntrenamiento[i].nombreRuta + "\n";
    }
    
    let opcionRutaTexto = prompt(textoRutas + "\nIngresa el número de la ruta:");
    if (opcionRutaTexto === null) { alert("Operación cancelada."); return; }
    
    let opcionRuta = parseInt(opcionRutaTexto);
    if (isNaN(opcionRuta) || opcionRuta < 1 || opcionRuta > rutasEntrenamiento.length) {
        alert("Error: Opción de ruta inválida.");
        return;
    }
    
    let ruta = rutasEntrenamiento[opcionRuta - 1];
    let nombreRuta = ruta.nombreRuta;
    
    // Paso 2: Pedir el trainer
    let textoTrainers = "Trainers:\n";
    for (let i = 0; i < trainers.length; i++) {
        textoTrainers += (i + 1) + ". " + trainers[i].nombre + " (ID: " + trainers[i].id + ")\n";
    }
    
    let opcionTrainerTexto = prompt(textoTrainers + "\nIngresa el número del trainer:");
    if (opcionTrainerTexto === null) { alert("Operación cancelada."); return; }
    
    let opcionTrainer = parseInt(opcionTrainerTexto);
    if (isNaN(opcionTrainer) || opcionTrainer < 1 || opcionTrainer > trainers.length) {
        alert("Error: Opción de trainer inválida.");
        return;
    }
    
    let trainer = trainers[opcionTrainer - 1];
    let idTrainer = trainer.id;
    
    // Paso 3: Buscar los campers de ese trainer en esa ruta
    let idsCampers = [];
    for (let i = 0; i < matriculas.length; i++) {
        if (matriculas[i].nombreRuta === nombreRuta && matriculas[i].idTrainer === idTrainer) {
            idsCampers.push(matriculas[i].idCamper);
        }
    }
    
    if (idsCampers.length === 0) {
        alert("No hay campers matriculados con ese trainer en esa ruta.");
        return;
    }
    
    console.log("\n========================================");
    console.log("  REPORTE DE APROBADOS Y REPROBADOS");
    console.log("  Ruta: " + nombreRuta);
    console.log("  Trainer: " + trainer.nombre);
    console.log("========================================");
    
    // Paso 4: Para cada módulo de la ruta, contar aprobados y reprobados
    for (let i = 0; i < ruta.modulos.length; i++) {
        let nombreModulo = ruta.modulos[i].nombreModulo;
        let aprobados = 0;
        let reprobados = 0;
        
        // Revisamos las notas de los campers en este módulo
        for (let j = 0; j < notasModulos.length; j++) {
            let nota = notasModulos[j];
            
            // Verificamos si esta nota pertenece a alguno de nuestros campers
            if (idsCampers.indexOf(nota.idCamper) !== -1 && 
                nota.nombreRuta === nombreRuta && 
                nota.nombreModulo === nombreModulo) {
                
                if (nota.aprobado) {
                    aprobados++;
                } else {
                    reprobados++;
                }
            }
        }
        
        console.log("\n--- " + nombreModulo + " ---");
        console.log("  Aprobados: " + aprobados);
        console.log("  Reprobados: " + reprobados);
        console.log("  Sin notas: " + (idsCampers.length - aprobados - reprobados));
    }
    
    console.log("\n========================================\n");
    alert("Reporte generado. Revisa la consola del navegador (F12).");
}

/*
  Función: menuReportes
  Qué hace: Muestra un submenú con todas las opciones de reportes
  Recibe: Nada
  Retorna: Nada
*/
function menuReportes() {
    let continuar = true;
    
    while (continuar) {
        let opcionTexto = prompt(
            "========== MÓDULO DE REPORTES ==========\n\n" +
            "1. Listar campers en estado 'Inscrito'\n" +
            "2. Listar campers que aprobaron examen inicial\n" +
            "3. Listar todos los trainers\n" +
            "4. Listar campers con bajo rendimiento\n" +
            "5. Listar campers y trainers por ruta\n" +
            "6. Reporte de aprobados/reprobados por módulo\n" +
            "0. Volver al menú anterior\n\n" +
            "Ingresa el número de tu opción:"
        );
        
        if (opcionTexto === null) {
            continuar = false;
            break;
        }
        
        let opcion = parseInt(opcionTexto);
        
        switch (opcion) {
            case 1:
                listarCampersInscritos();
                break;
            case 2:
                listarCampersAprobados();
                break;
            case 3:
                listarTodosLosTrainers();
                break;
            case 4:
                listarCampersBajoRendimiento();
                break;
            case 5:
                listarCampersYTrainersPorRuta();
                break;
            case 6:
                reporteAprobadosReprobadosPorModulo();
                break;
            case 0:
                continuar = false;
                break;
            default:
                alert("Opción inválida. Por favor ingresa un número del 0 al 6.");
        }
    }
}


// === Sección 7: FUNCIÓN PARA ACTUALIZAR RIESGO DEL CAMPER ===

/*
  Función: actualizarRiesgoCamper
  Qué hace: Actualiza el nivel de riesgo de un camper según sus notas
           Si tiene algún módulo reprobado, su riesgo pasa a "Alto"
           Si no tiene módulos reprobados, su riesgo es "Ninguno"
  Recibe: El ID del camper
  Retorna: Nada
*/
function actualizarRiesgoCamper(idCamper) {
    let camper = buscarCamperPorId(idCamper);
    if (camper === null) return;
    
    // Buscamos si tiene algún módulo reprobado
    let tieneReprobados = false;
    
    for (let i = 0; i < notasModulos.length; i++) {
        if (notasModulos[i].idCamper === idCamper && !notasModulos[i].aprobado) {
            tieneReprobados = true;
            break;
        }
    }
    
    // Actualizamos el riesgo
    if (tieneReprobados) {
        camper.riesgo = "Alto";
    } else {
        camper.riesgo = "Ninguno";
    }
}


// === Sección 8: Menús Principales ===

/*
  Función: menuCoordinador
  Qué hace: Muestra el menú del rol Coordinador con todas sus opciones
  Recibe: Nada
  Retorna: Nada
*/
function menuCoordinador() {
    let continuar = true;
    
    while (continuar) {
        let opcionTexto = prompt(
            "========== MENÚ COORDINADOR ==========\n\n" +
            "1. Registrar nuevo camper\n" +
            "2. Registrar nuevo trainer\n" +
            "3. Crear nueva ruta de entrenamiento\n" +
            "4. Registrar notas de prueba inicial\n" +
            "5. Matricular camper en ruta\n" +
            "6. Consultar campers en riesgo alto\n" +
            "7. Módulo de reportes\n" +
            "0. Volver al menú principal\n\n" +
            "Ingresa el número de tu opción:"
        );
        
        // Si el usuario presiona Cancelar, salimos
        if (opcionTexto === null) {
            continuar = false;
            break;
        }
        
        // Convertimos la opción a número
        let opcion = parseInt(opcionTexto);
        
        // Ejecutamos la función según la opción elegida
        switch (opcion) {
            case 1:
                registrarCamper();
                break;
            case 2:
                registrarTrainer();
                break;
            case 3:
                crearRutaEntrenamiento();
                break;
            case 4:
                registrarNotasPruebaInicial();
                break;
            case 5:
                matricularCamperEnRuta();
                break;
            case 6:
                consultarCampersEnRiesgo();
                break;
            case 7:
                menuReportes();
                break;
            case 0:
                continuar = false;
                break;
            default:
                alert("Opción inválida. Por favor ingresa un número del 0 al 7.");
        }
    }
}

/*
  Función: menuTrainer
  Qué hace: Muestra el menú del rol Trainer con todas sus opciones
  Recibe: Nada
  Retorna: Nada
*/
function menuTrainer() {
    let continuar = true;
    
    while (continuar) {
        let opcionTexto = prompt(
            "========== MENÚ TRAINER ==========\n\n" +
            "1. Ver mis campers asignados\n" +
            "2. Registrar notas de módulo\n" +
            "3. Consultar notas de mis campers\n" +
            "0. Volver al menú principal\n\n" +
            "Ingresa el número de tu opción:"
        );
        
        if (opcionTexto === null) {
            continuar = false;
            break;
        }
        
        let opcion = parseInt(opcionTexto);
        
        switch (opcion) {
            case 1:
                verCampersAsignados();
                break;
            case 2:
                registrarNotasModulo();
                break;
            case 3:
                consultarNotasCampers();
                break;
            case 0:
                continuar = false;
                break;
            default:
                alert("Opción inválida. Por favor ingresa un número del 0 al 3.");
        }
    }
}

/*
  Función: menuCamper
  Qué hace: Muestra el menú del rol Camper con todas sus opciones
  Recibe: Nada
  Retorna: Nada
*/
function menuCamper() {
    let continuar = true;
    
    while (continuar) {
        let opcionTexto = prompt(
            "========== MENÚ CAMPER ==========\n\n" +
            "1. Consultar mi información personal\n" +
            "2. Ver en qué ruta estoy matriculado\n" +
            "3. Ver mis notas por módulo\n" +
            "0. Volver al menú principal\n\n" +
            "Ingresa el número de tu opción:"
        );
        
        if (opcionTexto === null) {
            continuar = false;
            break;
        }
        
        let opcion = parseInt(opcionTexto);
        
        switch (opcion) {
            case 1:
                consultarInformacionCamper();
                break;
            case 2:
                consultarRutaMatriculada();
                break;
            case 3:
                consultarNotasPropias();
                break;
            case 0:
                continuar = false;
                break;
            default:
                alert("Opción inválida. Por favor ingresa un número del 0 al 3.");
        }
    }
}

/*
  Función: mostrarMenuPrincipal
  Qué hace: Muestra el menú principal del programa y controla el flujo
  Recibe: Nada
  Retorna: Nada
  
  Esta es la función principal que se ejecuta cuando cargamos el programa.
  Muestra un menú que se repite hasta que el usuario elija salir (opción 0).
*/
function mostrarMenuPrincipal() {
    // Mensaje de bienvenida
    alert("¡Bienvenido a CampusLands ERP!\n\nSistema de Gestión Académica\n\nRECUERDA: Abre la consola del navegador (F12 → pestaña Console) para ver los reportes y listados completos.");
    
    // Variable para controlar si el programa sigue ejecutándose
    let programaActivo = true;
    
    // Bucle principal del programa
    // Mientras programaActivo sea true, el programa seguirá mostrando el menú
    while (programaActivo) {
        // Mostramos el menú usando prompt
        // prompt muestra un cuadro de texto donde el usuario puede escribir
        let opcionTexto = prompt(
            "========== CampusLands ERP ==========\n" +
            "      Sistema de Gestión Académica\n" +
            "=====================================\n\n" +
            "Selecciona tu rol:\n\n" +
            "1. Camper (Estudiante)\n" +
            "2. Trainer (Instructor)\n" +
            "3. Coordinador\n" +
            "0. Salir del programa\n\n" +
            "Ingresa el número de tu opción:"
        );
        
        // Si el usuario presiona el botón "Cancelar" en el prompt,
        // opcionTexto será null, así que salimos del programa
        if (opcionTexto === null) {
            programaActivo = false;
            alert("¡Hasta luego! Gracias por usar CampusLands ERP.");
            break;
        }
        
        // Convertimos el texto a número usando parseInt
        // Por ejemplo: "1" se convierte en el número 1
        let opcion = parseInt(opcionTexto);
        
        // Usamos switch para ejecutar diferentes acciones según el número elegido
        switch (opcion) {
            case 1:
                // Si eligió 1, va al menú de Camper
                menuCamper();
                break;
            case 2:
                // Si eligió 2, va al menú de Trainer
                menuTrainer();
                break;
            case 3:
                // Si eligió 3, va al menú de Coordinador
                menuCoordinador();
                break;
            case 0:
                // Si eligió 0, sale del programa
                programaActivo = false;
                alert("¡Hasta luego! Gracias por usar CampusLands ERP.");
                break;
            default:
                // Si eligió cualquier otro número, mostramos un mensaje de error
                alert("Opción inválida. Por favor ingresa un número del 0 al 3.");
        }
    }
    
    // Mensaje final en la consola
    console.log("\n========================================");
    console.log("  Programa finalizado");
    console.log("  ¡Gracias por usar CampusLands ERP!");
    console.log("========================================\n");
}


// === Sección 9: Inicio del Programa =======

// Esta es la línea que inicia todo el programa
// Cuando el navegador carga este archivo JavaScript, ejecuta esta función
mostrarMenuPrincipal();