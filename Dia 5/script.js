// Un  promesa es un objeto que representa laeventual finalización o falla de una operación asíncona

//"Te prometo entregar algo"
//Si cumplo hago algo --> Resultado
// Si no cumplo --> Error

//Estados de una promesa:
//1. Pendiente: Aun no se resolvió ni falló.
//2. Fullfilled (Cumplida): Ya tenemos un valor para usar.
//3. Rejected (Rechazada): Ya tiene un motivo de error.

/* Ciclo de vida de una promesa
1. Nace en pendiente --> Pasará una sola vez a filfilled o rejected --> quedará en "asentada" (settled), donode no cambiará jamás su estado. --> Evitar doble entrega.
*/

//Plantillas generales

//Utilidades
const log = (...args) => console.log(...args);

const titulo = (n, nombre) => {
  log("\n" + "=".repeat(50));
  log(`EJERCICIO ${n}: ${nombre}`);
  log("=".repeat(50));
};

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Plantilla para promesa con delay de RESUELVE
 */
const resolverEn = (ms, valor) => 
    new Promise((resolve) => setTimeout(() => resolve(valor), ms));

/**
 * Plantilla para promesa con delay de RECHAZA
 */
const rechazarEn = (ms, error) => 
    new Promise((_, reject) => setTimeout(() => reject(error), ms));

//Ejemplo de promesa que se resuelve.
function runEjercicio1() {
    titulo(1,"Mi primera promesa(Resolve)");
    function saludarAsync(nombre) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('Hola, $(nombre)');
            }, 800);
        })
    }
    log("Antes de llamar a saludarAsync...");
    saludarAsync("Pedro").then((msg) => log(" them:", msg)).catch((err) => log("catch:", err.message)).finally(() => log("finally: terminó Ejercicio1"));
}
runEjercicio1();
/*

==========================================================================================================================================

A. Ejercicio 1 — Promesa básica con delay
Objetivo: Crear una promesa que se resuelva después de cierto tiempo.

Instrucciones

1. Crea una función mensajeAsync(texto, tiempo)

2. Debe devolver una Promise

3. Después de tiempo milisegundos debe resolver con el texto recibido

4. Consumirla con .then()

5. Agregar un .finally()

Validación esperada

1. Antes de la llamada se imprime: "Iniciando..."

2. Después del tiempo: el mensaje

3. Finalmente: "Proceso finalizado"

==========================================================================================================================================
SOLUCIÓN A. Ejercicio 1: Promesa básica con delay
==========================================================================================================================================*/

// 1. Creamos la función mensajeAsync que recibe dos parámetros:
// - texto: el mensaje que queremos mostrar
// - tiempo: los milisegundos que esperaremos antes de mostrar el mensaje
function mensajeAsync(texto, tiempo) {
    
    // 2. Devolvemos una nueva Promesa
    // La promesa recibe una función con dos parámetros: resolve y reject
    // resolve se usa cuando la operación es exitosa
    // reject se usa cuando hay un error (aunque en este caso no lo usaremos)
    return new Promise((resolve) => {
        
        // 3. Usamos setTimeout para esperar el tiempo indicado
        // setTimeout recibe dos parámetros:
        // - Una función que se ejecutará después del tiempo
        // - El tiempo en milisegundos a esperar
        setTimeout(() => {
            // Cuando pasa el tiempo, llamamos a resolve con el texto
            // Esto hace que la promesa se complete exitosamente
            resolve(texto);
        }, tiempo); // 'tiempo' es el segundo parámetro de nuestra función
    });
}

// 4. Usamos la función
console.log("Iniciando..."); // Se imprime inmediatamente

// Llamamos a la función mensajeAsync con el texto y el tiempo
mensajeAsync("Hola después de 2 segundos", 2000) // 2000 milisegundos = 2 segundos
    
    // .then() se ejecuta cuando la promesa se resuelve (resolve)
    .then((resultado) => {
        // 'resultado' contiene el texto que pasamos a resolve()
        console.log(resultado); // Muestra: "Hola después de 2 segundos"
    })
    
    // .finally() se ejecuta SIEMPRE, después de .then() o .catch()
    .finally(() => {
        console.log("Proceso finalizado"); // Se muestra después de todo
    });

/*

=================================================================================================================================================

B. Ejercicio 2 — Rechazo condicional
Objetivo: Comprender resolve vs reject.

Instrucciones

1. Crea verificarNumeroAsync(numero)

2. Si el número es par → resolve "Número válido"

3. Si es impar → reject "Número inválido"

4. Maneja ambos casos

Validación

Probar con:

1. 4 → debe entrar en .then()

2. 5 → debe entrar en .catch()

=================================================================================================================================================
SOLUCIÓN B. Ejercicio 2: Rechazo condicional 
=================================================================================================================================================*/

// 1. Creamos la función verificarNumeroAsync
// Recibe un número como parámetro
function verificarNumeroAsync(numero) {
    
    //  2. Devolvemos una nueva Promesa
    return new Promise((resolve, reject) => {
        
        // 3. Verificamos si el número es par o impar
        // Usamos el operador módulo (%) que nos da el resto de una división
        // Si numero % 2 es 0, el número es par
        // Si numero % 2 es 1, el número es impar
        if (numero % 2 === 0) {
            // CASO PAR: La promesa se resuelve exitosamente
            // Llamamos a resolve con el mensaje de éxito
            resolve("Número válido");
        } else {
            // CASO IMPAR: La promesa se rechaza
            // Llamamos a reject con el mensaje de error
            reject("Número inválido");
        }
        
        // Nota: No usamos setTimeout aquí para que sea instantáneo,
        // pero podríamos añadirlo si quisiéramos simular una operación que tarda
    });
}

// 4. Probamos con diferentes números

console.log("--- Probando con número 4 (par) ---");
verificarNumeroAsync(4)
    // .then() se ejecuta cuando la promesa se resuelve (resolve)
    .then((mensaje) => {
        console.log("ÉXITO:", mensaje); // Mostrará: "ÉXITO: Número válido"
    })
    // .catch() se ejecuta cuando la promesa se rechaza (reject)
    .catch((error) => {
        console.log("ERROR:", error); // No se ejecutará en este caso
    })
    // .finally() siempre se ejecuta
    .finally(() => {
        console.log("Verificación completada para número 4\n");
    });

console.log("--- Probando con número 5 (impar) ---");
verificarNumeroAsync(5)
    .then((mensaje) => {
        console.log("ÉXITO:", mensaje); // No se ejecutará
    })
    .catch((error) => {
        console.log("ERROR:", error); // Mostrará: "ERROR: Número inválido"
    })
    .finally(() => {
        console.log("Verificación completada para número 5\n");
    });

// También podemos hacerlo de forma más elegante probando varios números:
console.log("--- Prueba múltiple ---");
const numerosParaProbar = [2, 3, 6, 7, 10];

// Recorremos el array de números
numerosParaProbar.forEach((numero) => {
    verificarNumeroAsync(numero)
        .then((mensaje) => {
            console.log(`Número ${numero}: ${mensaje}`);
        })
        .catch((error) => {
            console.log(`Número ${numero}: ${error}`);
        });
});

//=================================================================================================================================================*/

fetch("https://www.dnd5eapi.co/api/2014/monsters")
.then((response) => response.json())
.then((data) => {
    console.table(data["results"][0]);  
});



//=================================================================================================================================================*/
//   API: RICK AND MORTY
//=================================================================================================================================================*/

// Preguntamos al usuario qué quiere buscar y guardamos su respuesta en la variable "seccion"
seccion= prompt("¿Qué sección quieres consultar?\n1. Personajes\n2. Lugares\n3. Episodios");

// Dependiendo de lo que haya respondido el usuario, haremos una cosa u otra
switch (seccion) {
    // Si el usuario eligió la opción 1 (Personajes)
    case "1":
        // Preparamos la búsqueda para personajes (en inglés la página usa "character")
        seccion = "character";
        // Preguntamos qué personaje específico quiere buscar (ej: Rick, Morty, etc)
        personaje = prompt("¿Qué personaje quieres consultar?");
        // Agregamos el nombre del personaje a la búsqueda (ej: "character?name=Rick")
        seccion += "?name="+personaje;
        // Llamamos a la función que buscará los resultados (explicada abajo)
        mostrarResultados(seccion);
        // Terminamos esta opción para que no siga ejecutando el resto
        break;
    
    // Si el usuario eligió la opción 2 (Lugares)
    case "2":
        // Preparamos la búsqueda para lugares (en inglés "location")
        seccion = "location";
        // Preguntamos qué lugar específico quiere buscar (ej: Tierra, Citadel, etc)
        lugar = prompt("¿Qué lugar quieres consultar?");
        // Agregamos el nombre del lugar a la búsqueda
        seccion += "?name="+lugar;
        // Buscamos los resultados
        mostrarResultados(seccion);
        break;
    
    // Si el usuario eligió la opción 3 (Episodios)
    case "3":
        // Preparamos la búsqueda para episodios (en inglés "episode")
        seccion = "episode";
        // Preguntamos qué episodio específico quiere buscar (ej: Pilot, Rickmancing, etc)
        episodio = prompt("¿Qué episodio quieres consultar?");
        // Agregamos el nombre del episodio a la búsqueda
        seccion += "?name="+episodio;
        // Buscamos los resultados
        mostrarResultados(seccion);       
        break;
    
    // Si el usuario NO eligió 1, 2 ni 3 (es decir, escribió cualquier otra cosa)
    default:
        // Le avisamos que su opción no es válida
        alert("Opción no válida. Se consultará la sección de personajes por defecto.");
        // Por si acaso, buscamos personajes (para que el programa no se rompa)
        seccion = "character";
}

// Esta es una "función" - su trabajo es ir a Internet a buscar información y mostrarla
function mostrarResultados(seccion) {
    // "fetch" significa "ir a buscar" - vamos a la página de Rick y Morty
    // Agregamos al final lo que el usuario quiere buscar (personajes, lugares o episodios)
    fetch("https://rickandmortyapi.com/api/"+seccion)
    // Cuando recibamos la respuesta, la convertimos a un formato que JavaScript entienda (JSON)
    .then((response) => response.json())
    // Cuando ya tengamos los datos convertidos, los mostramos
    .then((data) => {
        // "console.table" muestra los resultados en la consola del navegador como una tabla
        // Los resultados vienen dentro de "results" (por eso data["results"])
        console.table(data["results"]);  
    });
}