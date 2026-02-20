//Nuestro primer comentario
console.log("Hola mundo!");

//Datos primitivos
numero1 = 1; //Tipo number --> "La mayoria de números"
numero2 = 2;
console.log(typeof numero1);

texto1 = "Textico"; //TIpo String
texto2 = " mas texto"
console.log(typeof texto1)

operacionesBasicas= ((((5*8)+5)-2)); //PENDAS
console.log(operacionesBasicas);

unionTexto=texto1+texto2; //Concatenación
console.log(unionTexto);

//Funciones con parametros y con retorno
function sumar (a,b){
    return a+b;
}
console.log(sumar(5,7));

//Funciones con parametros y sin retorno
function sumar5R(a,b){
    console.log(a+b);
}
sumar5R(8,9);

//Funciones sin parametros y sin retorno
function functionSPCR(){
    console.log("Esra es una función sin parametros y sin retorno");
}
functionSPCR();

//Funciones sin parametros y con retorno
function functionSPCR(){
    return "Esra es una función sin parametros y con retorno"
}


let carejopo = "monda"
let misuma = 5 + 3
//Funciones con parametros y con retorno
function matemosaSANTIAGO(porque) {
    porque = porque + "care"
    return porque
}
console.log(matemosaSANTIAGO(carejopo))



//Funciones con parametros y sin retorno
function matemosaSANTIAGO2(misuma2) {
    console.log(misuma2)
}
matemosaSANTIAGO2(misuma)

//Funciones sin parametros y sin retorno
function matemosaSANTIAGO() {
    console.log("Porque le dan sus MARICADAS")
}
matemosaSANTIAGO()
//Funciones sin parametros y con retorno
function matemosaSANTIAGO3() {
    textoconretorno = "Porque le dan sus MARICADotas"
    return textoconretorno
}
console.log(matemosaSANTIAGO3())
