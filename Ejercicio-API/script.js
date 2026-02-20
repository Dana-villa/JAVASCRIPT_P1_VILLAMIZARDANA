// Le pedimos a la API la lista de todos los personajes
fetch("https://rickandmortyapi.com/api/character/1")
  .then((response) => {
    // response.text() nos da el contenido como texto plano (string)
    return response.text();
  })
  .then((textoCrudo) => {
    console.log("🔍 ESTO ES LO QUE RECIBIMOS DEL SERVIDOR:");
    console.log(textoCrudo);
    console.log("📏 Tipo de dato:", typeof textoCrudo);
    console.log("📊 Longitud del texto:", textoCrudo.length, "caracteres");
  });

// =============================================
// PROGRAMA INTERACTIVO PARA CONSULTAR RICK AND MORTY
// =============================================

function consultarRickAndMorty() {
  
    // --- Función: Extraer datos del texto ---
    // Esta función busca un campo en el texto y devuelve su valor
    function extraerCampo(texto, nombreCampo) {
      // Buscamos algo como: "nombreCampo":"valor"
      let busqueda = `"${nombreCampo}":"`;
      let inicio = texto.indexOf(busqueda) + busqueda.length;
      
      if (inicio < busqueda.length) return "No encontrado"; // Si no encuentra el campo
      
      let fin = texto.indexOf('"', inicio);
      return texto.substring(inicio, fin);
    }
    
    // --- Función: Extraer arrays simples ---
    function extraerArray(texto, nombreCampo) {
      let busqueda = `"${nombreCampo}":[`;
      let inicio = texto.indexOf(busqueda) + busqueda.length;
      
      if (inicio < busqueda.length) return [];
      
      let fin = texto.indexOf(']', inicio);
      let contenidoArray = texto.substring(inicio, fin);
      
      // Dividimos por comas y limpiamos
      return contenidoArray.split(',').map(item => 
        item.trim().replace(/"/g, '')
      ).filter(item => item.length > 0);
    }
    
    // --- Función: Extraer objeto anidado (como origin) ---
    function extraerObjetoAnidado(texto, nombreObjeto, propiedad) {
      let busqueda = `"${nombreObjeto}":{"`;
      let inicioObjeto = texto.indexOf(busqueda);
      
      if (inicioObjeto === -1) return "No encontrado";
      
      let busquedaProp = `"${propiedad}":"`;
      let inicioProp = texto.indexOf(busquedaProp, inicioObjeto) + busquedaProp.length;
      let finProp = texto.indexOf('"', inicioProp);
      
      return texto.substring(inicioProp, finProp);
    }
  
    // --- MENÚ PRINCIPAL ---
    let opcion = prompt(
      "🌌 CONSULTOR DE RICK AND MORTY (SIN JSON) 🌌\n\n" +
      "¿Qué quieres hacer?\n" +
      "1 - Ver personajes (página 1)\n" +
      "2 - Buscar personaje por ID\n" +
      "3 - Buscar por nombre\n" +
      "4 - Ver ubicaciones\n" +
      "5 - Ver episodios\n\n" +
      "Escribe el número:"
    );
  
    // =============================================
    // OPCIÓN 1: LISTA DE PERSONAJES
    // =============================================
    if (opcion === "1") {
      console.log("⏳ Cargando personajes...");
      
      fetch("https://rickandmortyapi.com/api/character")
        .then(response => response.text())
        .then(texto => {
          console.log("╔══════════════════════════════════════╗");
          console.log("║     PERSONAJES (PRIMERA PÁGINA)      ║");
          console.log("╚══════════════════════════════════════╝");
          
          // Extraemos manualmente los primeros 5 personajes
          // El texto tiene estructura: {"results":[ {...}, {...} ]}
          
          let inicioResults = texto.indexOf('"results":[') + 10;
          let finResults = texto.indexOf(']}', inicioResults);
          let resultadosTexto = texto.substring(inicioResults, finResults + 1);
          
          // Dividimos los personajes (esto es complicado sin JSON, pero lo haremos simple)
          console.log("🔍 ANALIZANDO TEXTO MANUALMENTE...");
          
          // Contamos cuántos personajes hay buscando "name":
          let contador = 0;
          let pos = 0;
          let nombres = [];
          
          while (true) {
            pos = texto.indexOf('"name":"', pos);
            if (pos === -1 || nombres.length >= 5) break;
            pos += 8;
            let finNombre = texto.indexOf('"', pos);
            let nombre = texto.substring(pos, finNombre);
            nombres.push(nombre);
          }
          
          // Mostramos los primeros 5 nombres encontrados
          nombres.forEach((nombre, index) => {
            console.log(`${index + 1}. ${nombre}`);
          });
        });
    }
    
    // =============================================
    // OPCIÓN 2: PERSONAJE POR ID
    // =============================================
    else if (opcion === "2") {
      let id = prompt("Ingresa el ID del personaje (1-826):");
      
      if (id && !isNaN(id)) {
        console.log(`⏳ Buscando personaje #${id}...`);
        
        fetch(`https://rickandmortyapi.com/api/character/${id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error("Personaje no encontrado");
            }
            return response.text();
          })
          .then(texto => {
            console.log("╔══════════════════════════════════════╗");
            console.log("║      DETALLE DEL PERSONAJE           ║");
            console.log("╚══════════════════════════════════════╝");
            
            // Extraemos cada campo manualmente del texto
            let nombre = extraerCampo(texto, "name");
            let estado = extraerCampo(texto, "status");
            let especie = extraerCampo(texto, "species");
            let genero = extraerCampo(texto, "gender");
            let origen = extraerObjetoAnidado(texto, "origin", "name");
            let locacion = extraerObjetoAnidado(texto, "location", "name");
            
            // Extraemos episodios (es más complicado, haremos una versión simple)
            let inicioEpisodios = texto.indexOf('"episode":[') + 10;
            let finEpisodios = texto.indexOf(']', inicioEpisodios);
            let episodiosTexto = texto.substring(inicioEpisodios, finEpisodios);
            let episodios = episodiosTexto.split(',').map(url => {
              let match = url.match(/\/(\d+)/);
              return match ? match[1] : '';
            }).filter(e => e).slice(0, 3);
            
            // Mostramos los resultados
            console.log(`📛 Nombre: ${nombre}`);
            console.log(`❤️ Estado: ${estado}`);
            console.log(`🧬 Especie: ${especie}`);
            console.log(`⚥ Género: ${genero}`);
            console.log(`🌍 Origen: ${origen}`);
            console.log(`📍 Locación: ${locacion}`);
            console.log(`📺 Primeros episodios: ${episodios.join(', ')}`);
            
            // Mostramos un pedazo del texto original para que vean cómo es
            console.log("\n📄 VISTAZO AL TEXTO ORIGINAL:");
            console.log(texto.substring(0, 200) + "...");
          })
          .catch(error => {
            console.log("❌ Error:", error.message);
          });
      }
    }
    
    // =============================================
    // OPCIÓN 3: BÚSQUEDA POR NOMBRE
    // =============================================
    else if (opcion === "3") {
      let nombre = prompt("Ingresa el nombre a buscar (ej: Rick):");
      
      if (nombre) {
        console.log(`⏳ Buscando "${nombre}"...`);
        
        fetch(`https://rickandmortyapi.com/api/character/?name=${nombre}`)
          .then(response => {
            if (!response.ok) {
              throw new Error("No se encontraron personajes");
            }
            return response.text();
          })
          .then(texto => {
            console.log(`╔══════════════════════════════════════╗`);
            console.log(`║      RESULTADOS PARA "${nombre}"     ║`);
            console.log(`╚══════════════════════════════════════╝`);
            
            // Extraemos nombres manualmente
            let nombres = [];
            let pos = 0;
            
            while (true) {
              pos = texto.indexOf('"name":"', pos);
              if (pos === -1 || nombres.length >= 5) break;
              pos += 8;
              let fin = texto.indexOf('"', pos);
              let nombreEncontrado = texto.substring(pos, fin);
              nombres.push(nombreEncontrado);
              pos = fin + 1;
            }
            
            if (nombres.length === 0) {
              console.log("No se encontraron personajes.");
            } else {
              nombres.forEach((nombre, i) => {
                console.log(`${i+1}. ${nombre}`);
              });
            }
          })
          .catch(error => {
            console.log("❌ Error:", error.message);
          });
      }
    }
    
    // =============================================
    // OPCIÓN 4: VER UBICACIONES
    // =============================================
    else if (opcion === "4") {
      console.log("⏳ Cargando ubicaciones...");
      
      fetch("https://rickandmortyapi.com/api/location")
        .then(response => response.text())
        .then(texto => {
          console.log("╔══════════════════════════════════════╗");
          console.log("║         PRIMERAS UBICACIONES         ║");
          console.log("╚══════════════════════════════════════╝");
          
          // Extraemos nombres de ubicaciones
          let ubicaciones = [];
          let pos = 0;
          
          while (true) {
            pos = texto.indexOf('"name":"', pos);
            if (pos === -1 || ubicaciones.length >= 10) break;
            pos += 8;
            let fin = texto.indexOf('"', pos);
            ubicaciones.push(texto.substring(pos, fin));
            pos = fin + 1;
          }
          
          ubicaciones.forEach((ubicacion, i) => {
            console.log(`${i+1}. ${ubicacion}`);
          });
        });
    }
    
    // =============================================
    // OPCIÓN 5: VER EPISODIOS
    // =============================================
    else if (opcion === "5") {
      console.log("⏳ Cargando episodios...");
      
      fetch("https://rickandmortyapi.com/api/episode")
        .then(response => response.text())
        .then(texto => {
          console.log("╔══════════════════════════════════════╗");
          console.log("║          PRIMEROS EPISODIOS          ║");
          console.log("╚══════════════════════════════════════╝");
          
          // Extraemos nombres de episodios
          let episodios = [];
          let pos = 0;
          
          while (true) {
            pos = texto.indexOf('"name":"', pos);
            if (pos === -1 || episodios.length >= 10) break;
            pos += 8;
            let fin = texto.indexOf('"', pos);
            episodios.push(texto.substring(pos, fin));
            pos = fin + 1;
          }
          
          episodios.forEach((episodio, i) => {
            console.log(`${i+1}. ${episodio}`);
          });
        });
    }
    
    else {
      console.log("❌ Opción no válida. Vuelve a intentarlo.");
    }
  }
  
  // =============================================
  // EJECUTAMOS EL PROGRAMA
  // =============================================
  console.log("🚀 INICIANDO CONSULTOR DE RICK AND MORTY");
  console.log("📝 Este programa trabaja DIRECTAMENTE con el texto de la respuesta");
  consultarRickAndMorty();