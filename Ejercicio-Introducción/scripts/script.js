//=======================================
//CampusLands ERP - Versión principiantes
//=======================================

//=== Base de datos en memoria. ===

//Se almacena los datos de todos los campers.
let campers = [];

//Se almacena los datos de las rutas de entranamiento.
let rutas = [];

//Se almacena los datos de los trainer.
let trainers = [];

//Se almacena los datos de las inscripciones o matriculas.
let matriculas = [];

//=== Función creación de un nuevo CAMPER ===
//Esta función recibe varios datos, para generar el objeto CAMPER.
function crearCamper(id, nombres, apellidos, dirección, acudiente, telefono){
    let nuevoCamper ={
        id: id,
        nombres: nombres,
        apellidos: apellidos,
        dirección: dirección,
        acudiente: acudiente,
        telefono: telefono,
        estado: "En proceso",
        riesgo: false,
        notas: []
    };

    campers.push(nuevoCamper);
    console.log("Camper creado exitosamente:");
    console.log(nuevoCamper);
    return nuevoCamper;
}

//Función para ver todos los CAMPERS.
function listarCampers(){
    console.log("== LISTA DE CAMPERS ==");

    //Si no tenemos datos de CAMPERS mostramos un mensaje
    if (campers.length === 0){
        console.log("No hay campers registrados.");
        return;
    }

    //Para recorrer la lista de CAMPERS uno por uno
    for(let i= 0; i< campers.length; i++){
        let camper = campers[i];
        console.log('${i+1}. ID: ${camper.id} - ${camper.nombres} ${camper.apellidos} - Estado: ${camper.estado}');
    }
}

