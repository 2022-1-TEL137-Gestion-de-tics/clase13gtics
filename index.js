const funciones = require("./funciones");
const fs = require("fs");

let textoArchivo = fs.readFileSync("./textoPrueba.txt");

console.log(textoArchivo.toString());
console.log("fin del programa");





/*let sumatoria = funciones.suma(5,6);
console.log(sumatoria);

funciones.holaMundo2("juan");
funciones.holaMundo();
funciones.saluda("diego","vargas");*/